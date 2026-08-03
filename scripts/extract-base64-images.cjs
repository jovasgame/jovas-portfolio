// Extrae las imágenes base64 incrustadas en src/data/initialData.ts
// y las guarda como archivos estáticos en public/images/, reemplazando
// las cadenas base64 por rutas /images/*.jpg
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'data', 'initialData.ts');
const OUT_DIR = path.join(ROOT, 'public', 'images');

// Nombres en orden de aparición en el archivo:
// 1: proyecto "RECUERDO DE HERRAMIENTAS", 2: proyecto "Dark Vader",
// 3: avatar del perfil, 4: icono metálico de marca, 5: foto "Iguana al Sol"
const NAMES = [
  'default-project-tools.jpg',
  'default-project-vader.jpg',
  'avatar-default.jpg',
  'metallic-icon-default.jpg',
  'default-photo-iguana.jpg',
];

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let content = fs.readFileSync(SRC, 'utf8');
let index = 0;

const updated = content.replace(/"data:image\/jpeg;base64,[A-Za-z0-9+/=]+"/g, (match) => {
  if (index >= NAMES.length) {
    throw new Error(`Hay más imágenes base64 de las esperadas (${NAMES.length})`);
  }
  const base64 = match.slice('"data:image/jpeg;base64,'.length, -1);
  const buffer = Buffer.from(base64, 'base64');
  const name = NAMES[index];
  fs.writeFileSync(path.join(OUT_DIR, name), buffer);
  console.log(`Extraída: ${name} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
  index++;
  return `"/images/${name}"`;
});

if (index === 0) {
  console.log('No se encontraron imágenes base64. Nada que hacer.');
  process.exit(0);
}

fs.writeFileSync(SRC, updated, 'utf8');
console.log(`\nListo: ${index} imágenes extraídas. initialData.ts ahora pesa ${(fs.statSync(SRC).size / 1024).toFixed(1)} KB`);
