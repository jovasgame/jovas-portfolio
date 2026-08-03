// Extrae TODAS las imágenes base64 incrustadas en src/data/initialData.ts
// y las guarda como archivos estáticos en public/images/, reemplazando
// las cadenas base64 por rutas /images/*.jpg|png
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'data', 'initialData.ts');
const OUT_DIR = path.join(ROOT, 'public', 'images');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let content = fs.readFileSync(SRC, 'utf8');
let index = 0;
const EXT_BY_MIME = { jpeg: 'jpg', jpg: 'jpg', png: 'png', webp: 'webp', gif: 'gif' };

const updated = content.replace(/"data:image\/(jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=]+"/g, (match, mime) => {
  index++;
  const ext = EXT_BY_MIME[mime] || 'jpg';
  const name = `extracted-${String(index).padStart(2, '0')}.${ext}`;
  const base64 = match.slice(match.indexOf(',') + 1, -1);
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(path.join(OUT_DIR, name), buffer);
  console.log(`Extraída: ${name} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
  return `"/images/${name}"`;
});

if (index === 0) {
  console.log('No se encontraron imágenes base64. Nada que hacer.');
  process.exit(0);
}

fs.writeFileSync(SRC, updated, 'utf8');
console.log(`\nListo: ${index} imágenes extraídas. initialData.ts ahora pesa ${(fs.statSync(SRC).size / 1024).toFixed(1)} KB`);
