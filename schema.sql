-- Esquema D1 para jovas-portfolio
-- Una fila por proyecto/foto: elimina el problema del blob único de KV
-- (límite de 25 MB, "último gana" entre dispositivos, duplicados).
-- updated_at permite al cliente comparar fechas y nunca pisar ediciones nuevas.

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_photos (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Claves usadas: 'profile', 'brandAssets', 'stats'
CREATE TABLE IF NOT EXISTS portfolio_settings (
  key TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
