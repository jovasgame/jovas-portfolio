// API del portafolio — Cloudflare D1 (principal) con fallback a KV (legado).
//
// D1 resuelve los problemas históricos del blob único en KV:
//  - Una fila por proyecto/foto: crear/editar/borrar toca solo esa fila.
//  - Consistencia fuerte: sin la ventana de datos viejos (~60s) de KV.
//  - updated_at por fila: el cliente compara fechas y no pisa ediciones nuevas.
//  - Sin límite de 25 MB por valor (D1: 10 GB por base).
//
// Escrituras protegidas con SYNC_SECRET (variable de entorno de Pages):
//  - Si SYNC_SECRET está configurada, POST requiere header `x-sync-key` igual.
//  - Si NO está configurada, la API opera en modo abierto (compatibilidad).

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  all<T = any>(): Promise<{ results: T[] }>;
  run(): Promise<any>;
  first<T = any>(colName?: string): Promise<T | null>;
}

interface D1Database {
  prepare(sql: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<any[]>;
}

interface KVNamespace {
  get(key: string, options?: { type: string }): Promise<any>;
  put(key: string, value: string): Promise<void>;
}

interface Env {
  PORTFOLIO_D1?: D1Database;
  PORTFOLIO_KV?: KVNamespace;
  SYNC_SECRET?: string;
}

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-sync-key'
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

const isAuthorized = (env: Env, request: Request): boolean => {
  if (!env.SYNC_SECRET) return true; // modo abierto: sin secreto configurado
  return request.headers.get('x-sync-key') === env.SYNC_SECRET;
};

const safeParse = (raw: string | null | undefined) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const onRequestOptions = async () => new Response(null, { headers: corsHeaders });

// ---------------------------------------------------------------- GET (lectura pública)
export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;

  // --- D1 (fuente de verdad principal) ---
  if (env.PORTFOLIO_D1) {
    try {
      const db = env.PORTFOLIO_D1;
      const [projRows, photoRows, settingRows] = await db.batch([
        db.prepare('SELECT data, updated_at FROM portfolio_projects'),
        db.prepare('SELECT data FROM portfolio_photos'),
        db.prepare('SELECT key, data, updated_at FROM portfolio_settings')
      ]);

      const projects = (projRows.results || [])
        .map((r: any) => safeParse(r.data))
        .filter(Boolean);
      const photos = (photoRows.results || [])
        .map((r: any) => safeParse(r.data))
        .filter(Boolean);

      const settings: Record<string, any> = {};
      for (const row of settingRows.results || []) {
        settings[row.key] = safeParse(row.data);
      }

      const updatedAt = (projRows.results || []).reduce(
        (max: string, r: any) => (r.updated_at > max ? r.updated_at : max),
        ''
      );

      const isEmpty = projects.length === 0 && photos.length === 0 && !settings.profile;

      return json({
        projects: isEmpty ? null : projects,
        photos: isEmpty ? null : photos,
        profile: settings.profile || null,
        brandAssets: settings.brandAssets || null,
        stats: settings.stats || null,
        updatedAt: updatedAt || null,
        bound: true,
        db: 'd1',
        status: isEmpty ? 'empty' : 'ok'
      });
    } catch (e: any) {
      console.error('D1 Read Error:', e);
      return json(
        { projects: null, bound: true, db: 'd1', status: 'error', error: String(e) },
        500
      );
    }
  }

  // --- KV (fallback legado) ---
  if (env.PORTFOLIO_KV) {
    try {
      const data = await env.PORTFOLIO_KV.get('portfolio_data', { type: 'json' });
      if (data && typeof data === 'object') {
        return json({ ...data, bound: true, db: 'kv', status: 'ok' });
      }
      return json({ projects: null, bound: true, db: 'kv', status: 'empty' });
    } catch (e: any) {
      console.error('KV Read Error:', e);
      return json(
        { projects: null, bound: true, db: 'kv', status: 'error', error: String(e) },
        500
      );
    }
  }

  return json({
    projects: null,
    bound: false,
    status: 'unbound',
    message: 'Ni PORTFOLIO_D1 ni PORTFOLIO_KV están vinculados en Cloudflare Pages'
  });
};

// ---------------------------------------------------------------- POST (escritura, requiere token)
export const onRequestPost = async (context: { env: Env; request: Request }) => {
  const { env, request } = context;

  if (!isAuthorized(env, request)) {
    return json(
      {
        success: false,
        status: 'unauthorized',
        message: 'Token de sincronización inválido o ausente (x-sync-key)'
      },
      401
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, status: 'error', error: 'JSON inválido' }, 400);
  }

  const projects = Array.isArray(body?.projects) ? body.projects : [];
  const photos = Array.isArray(body?.photos) ? body.photos : [];
  const now = new Date().toISOString();

  // --- D1 ---
  if (env.PORTFOLIO_D1) {
    try {
      const db = env.PORTFOLIO_D1;

      // Guarda anti-vaciado: nunca borrar todo salvo reset explícito (force:true)
      const countRow = await db
        .prepare('SELECT COUNT(*) AS c FROM portfolio_projects')
        .first<{ c: number }>();
      const existing = countRow?.c ?? 0;
      if (existing > 0 && projects.length === 0 && body?.force !== true) {
        return json(
          {
            success: false,
            status: 'rejected_empty',
            message: `Rechazado: el payload traía 0 proyectos y la base tiene ${existing}. Usa force:true solo para reset intencional.`
          },
          409
        );
      }

      const stmts: D1PreparedStatement[] = [];
      const upsert = (table: string, idCol: string, id: string, data: unknown) =>
        db
          .prepare(
            `INSERT INTO ${table} (${idCol}, data, updated_at) VALUES (?, ?, ?)
             ON CONFLICT(${idCol}) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
          )
          .bind(id, JSON.stringify(data), now);

      // Defensa SQLITE_TOOBIG: D1 limita cada statement a ~1 MB. Filas que
      // lo excedan se omiten (y se reportan) en vez de tumbar toda la sync;
      // su id se conserva en la lista para que el DELETE no las borre.
      const ROW_MAX_BYTES = 950_000;
      const skippedOversized: string[] = [];

      // Proyectos: upsert por id + borrado de ids ausentes (sincronía autoritativa)
      const projectIds: string[] = [];
      for (const p of projects) {
        if (!p || !p.id) continue;
        projectIds.push(String(p.id));
        const serialized = JSON.stringify(p);
        if (serialized.length > ROW_MAX_BYTES) {
          skippedOversized.push(String(p.id));
          continue;
        }
        stmts.push(upsert('portfolio_projects', 'id', String(p.id), p));
      }
      if (projectIds.length > 0) {
        const placeholders = projectIds.map(() => '?').join(',');
        stmts.push(
          db
            .prepare(`DELETE FROM portfolio_projects WHERE id NOT IN (${placeholders})`)
            .bind(...projectIds)
        );
      } else if (body?.force === true) {
        stmts.push(db.prepare('DELETE FROM portfolio_projects'));
      }

      // Fotos
      const photoIds: string[] = [];
      for (const ph of photos) {
        if (!ph || !ph.id) continue;
        photoIds.push(String(ph.id));
        if (JSON.stringify(ph).length > ROW_MAX_BYTES) {
          skippedOversized.push(String(ph.id));
          continue;
        }
        stmts.push(upsert('portfolio_photos', 'id', String(ph.id), ph));
      }
      if (photoIds.length > 0) {
        const placeholders = photoIds.map(() => '?').join(',');
        stmts.push(
          db
            .prepare(`DELETE FROM portfolio_photos WHERE id NOT IN (${placeholders})`)
            .bind(...photoIds)
        );
      } else if (body?.force === true) {
        stmts.push(db.prepare('DELETE FROM portfolio_photos'));
      }

      // Ajustes (perfil, marca, stats)
      for (const key of ['profile', 'brandAssets', 'stats'] as const) {
        if (body?.[key] && typeof body[key] === 'object') {
          if (JSON.stringify(body[key]).length > ROW_MAX_BYTES) {
            skippedOversized.push(key);
            continue;
          }
          stmts.push(upsert('portfolio_settings', 'key', key, body[key]));
        }
      }

      if (stmts.length > 0) await db.batch(stmts);

      return json({
        success: true,
        bound: true,
        db: 'd1',
        status: 'saved',
        counts: { projects: projectIds.length, photos: photoIds.length },
        skippedOversized: skippedOversized.length ? skippedOversized : undefined,
        timestamp: now
      });
    } catch (e: any) {
      console.error('D1 Write Error:', e);
      return json(
        { success: false, bound: true, db: 'd1', status: 'error', error: String(e) },
        500
      );
    }
  }

  // --- KV (fallback legado, blob único) ---
  if (env.PORTFOLIO_KV) {
    try {
      await env.PORTFOLIO_KV.put('portfolio_data', JSON.stringify(body));
      return json({ success: true, bound: true, db: 'kv', status: 'saved', timestamp: now });
    } catch (e: any) {
      console.error('KV Write Error:', e);
      return json(
        { success: false, bound: true, db: 'kv', status: 'error', error: String(e) },
        500
      );
    }
  }

  return json({
    success: false,
    bound: false,
    status: 'unbound',
    message: 'Ni PORTFOLIO_D1 ni PORTFOLIO_KV están vinculados en Cloudflare Pages'
  });
};
