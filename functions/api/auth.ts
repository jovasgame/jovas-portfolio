// Login server-side para el dashboard.
//
// Variables de entorno en Cloudflare Pages (Settings > Environment variables):
//  - ADMIN_USERNAME: usuario del dashboard (ej. JovasMotion)
//  - ADMIN_PASSWORD: contraseña real del dashboard (texto plano, solo vive en Cloudflare)
//  - SYNC_SECRET:    token aleatorio que se devuelve al cliente tras login válido;
//                    el cliente lo envía como `x-sync-key` en cada POST a /api/portfolio.
//
// Si las variables NO están configuradas, responde configured:false y el cliente
// opera en modo abierto (solo con la verificación local por hash, como antes).

interface Env {
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  SYNC_SECRET?: string;
}

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

export const onRequestOptions = async () => new Response(null, { headers: corsHeaders });

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  const { env, request } = context;

  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD) {
    return json({
      success: false,
      configured: false,
      message: 'Auth de servidor no configurada (faltan ADMIN_USERNAME/ADMIN_PASSWORD en Pages env). Modo abierto.'
    });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, configured: true, message: 'JSON inválido' }, 400);
  }

  const userOk = String(body?.username || '').trim() === env.ADMIN_USERNAME;
  const passOk = String(body?.password || '') === env.ADMIN_PASSWORD;

  if (userOk && passOk) {
    return json({
      success: true,
      configured: true,
      token: env.SYNC_SECRET || null
    });
  }

  return json(
    { success: false, configured: true, message: 'Credenciales inválidas' },
    401
  );
};
