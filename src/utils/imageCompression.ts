// Compresión de imágenes para sincronización con Cloudflare D1.
//
// D1 rechaza statements cuyos parámetros ligados superan ~1 MB
// (SQLITE_TOOBIG). Las imágenes base64 deben quedar por debajo de ese
// límite ANTES de enviarse. MAX_DATAURL_CHARS deja margen para el resto
// del JSON de la fila (título, descripción, tags, etc.).

export const MAX_DATAURL_CHARS = 850_000; // ~0.81 MiB, margen seguro bajo el 1 MiB de D1

const isDataUrl = (url?: string | null): url is string =>
  !!url && url.startsWith('data:image');

/**
 * Re-comprime un data URL de imagen hasta que quepa bajo maxChars.
 * Escala de calidad y dimensiones progresivamente. Si no puede comprimir
 * (SVG inválido, CORS, etc.), devuelve el original.
 */
export const ensureImageUnderLimit = (
  dataUrl: string,
  maxChars: number = MAX_DATAURL_CHARS
): Promise<string> => {
  if (!isDataUrl(dataUrl) || dataUrl.length <= maxChars) {
    return Promise.resolve(dataUrl);
  }
  // GIF/SVG animados: re-encodar a JPEG los convierte en imagen estática,
  // pero es la única forma de que quepan en D1.
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scales = [1, 0.85, 0.7, 0.55, 0.4, 0.3];
      const qualities = [0.8, 0.7, 0.6, 0.5, 0.42, 0.35];
      const baseW = Math.min(img.width, 1400);
      const baseH = Math.round((img.height * baseW) / img.width);

      for (const scale of scales) {
        const w = Math.max(1, Math.round(baseW * scale));
        const h = Math.max(1, Math.round(baseH * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) break;
        ctx.drawImage(img, 0, 0, w, h);
        for (const q of qualities) {
          try {
            const out = canvas.toDataURL('image/jpeg', q);
            if (out.length <= maxChars) {
              resolve(out);
              return;
            }
          } catch {
            break;
          }
        }
      }
      // Último recurso: la versión más agresiva aunque exceda (el servidor
      // la reportará como fila omitida en vez de tumbar toda la sync).
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(baseW * 0.3));
        canvas.height = Math.max(1, Math.round(baseH * 0.3));
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.35));
          return;
        }
      } catch {}
      resolve(dataUrl);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

/**
 * Comprime un File de imagen recién subido (dashboard) apuntando a que
 * quepa en D1 desde el inicio: máx 1400px y escalera de calidad.
 */
export const compressImageFile = (
  file: File,
  maxChars: number = MAX_DATAURL_CHARS
): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = e.target?.result as string;
      if (!raw) {
        resolve('');
        return;
      }
      ensureImageUnderLimit(raw, maxChars).then((out) => {
        // ensureImageUnderLimit devuelve el original si ya cabe; si el
        // original era un JPEG/PNG pequeño se conserva tal cual.
        resolve(out);
      });
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

// ---------------------------------------------------------------------------
// Sanitizadores de payload para sync: recorren los campos de imagen conocidos
// y comprimen los data URLs que excedan el límite de D1.
// ---------------------------------------------------------------------------

export interface HasImageFields {
  imageUrl?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  galleryUrls?: string[];
}

const compressMediaFields = async <T extends HasImageFields>(
  item: T,
  warnings: string[]
): Promise<T> => {
  const out = { ...item };
  const label = (item as any).title || (item as any).id || 'elemento';

  // Count base64 images in this item to allocate per-image budget so total row fits under D1 limit (~850 KB)
  let base64Count = 0;
  if (isDataUrl(out.imageUrl)) base64Count++;
  if (isDataUrl(out.thumbnailUrl)) base64Count++;
  if (Array.isArray(out.galleryUrls)) {
    for (const g of out.galleryUrls) {
      if (isDataUrl(g)) base64Count++;
    }
  }

  // Budget per base64 image (minimum 120 KB per image if many images, max MAX_DATAURL_CHARS)
  const targetMaxChars = base64Count > 1
    ? Math.max(120_000, Math.floor(MAX_DATAURL_CHARS / base64Count))
    : MAX_DATAURL_CHARS;

  if (isDataUrl(out.imageUrl) && out.imageUrl!.length > targetMaxChars) {
    out.imageUrl = await ensureImageUnderLimit(out.imageUrl!, targetMaxChars);
  }
  if (isDataUrl(out.thumbnailUrl) && out.thumbnailUrl!.length > targetMaxChars) {
    out.thumbnailUrl = await ensureImageUnderLimit(out.thumbnailUrl!, targetMaxChars);
  }

  if (Array.isArray(out.galleryUrls) && out.galleryUrls.length > 0) {
    const newGallery: string[] = [];
    let galleryChanged = false;
    for (const gUrl of out.galleryUrls) {
      if (isDataUrl(gUrl) && gUrl.length > targetMaxChars) {
        const compressed = await ensureImageUnderLimit(gUrl, targetMaxChars);
        newGallery.push(compressed);
        galleryChanged = true;
      } else {
        newGallery.push(gUrl);
      }
    }
    if (galleryChanged) {
      out.galleryUrls = newGallery;
    }
  }

  // Los videos como base64 casi siempre exceden el límite de D1: se omiten
  // de la nube (se conservan localmente) y se avisa para usar URL externa.
  if (out.videoUrl && out.videoUrl.startsWith('data:') && out.videoUrl.length > MAX_DATAURL_CHARS) {
    warnings.push(
      `"${label}": el video subido como archivo es demasiado pesado para la base de datos y no se subió a la nube. Súbelo a Google Drive/YouTube/Vimeo y pega el enlace.`
    );
    out.videoUrl = undefined;
  }
  return out;
};

export interface SanitizeResult<T> {
  items: T[];
  changed: boolean;
  warnings: string[];
}

export const sanitizeMediaListForSync = async <T extends HasImageFields>(
  list: T[]
): Promise<SanitizeResult<T>> => {
  const warnings: string[] = [];
  let changed = false;
  const items: T[] = [];
  for (const item of list || []) {
    const out = await compressMediaFields(item, warnings);
    if (
      out.imageUrl !== item.imageUrl ||
      out.thumbnailUrl !== item.thumbnailUrl ||
      out.videoUrl !== item.videoUrl ||
      JSON.stringify(out.galleryUrls) !== JSON.stringify(item.galleryUrls)
    ) {
      changed = true;
    }
    items.push(out);
  }
  return { items, changed, warnings };
};

export const sanitizeProfileForSync = async <T extends { avatarUrl?: string }>(
  profile: T,
  warnings: string[]
): Promise<{ value: T; changed: boolean }> => {
  if (isDataUrl(profile?.avatarUrl) && profile.avatarUrl!.length > MAX_DATAURL_CHARS) {
    const v = await ensureImageUnderLimit(profile.avatarUrl!);
    return { value: { ...profile, avatarUrl: v }, changed: true };
  }
  return { value: profile, changed: false };
};

export const sanitizeBrandAssetsForSync = async <
  T extends { logoUrl?: string; metallicIconUrl?: string; heroBgUrl?: string }
>(assets: T, warnings: string[]): Promise<{ value: T; changed: boolean }> => {
  let out = { ...assets };
  let changed = false;
  for (const key of ['logoUrl', 'metallicIconUrl', 'heroBgUrl'] as const) {
    const val = out[key];
    if (isDataUrl(val) && val.length > MAX_DATAURL_CHARS) {
      out = { ...out, [key]: await ensureImageUnderLimit(val) };
      changed = true;
    }
  }
  return { value: out, changed };
};
