const fs = require('node:fs');
const path = require('node:path');
const sharp = require('C:/Users/31589/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

async function main() {
  const out = path.join(__dirname, '../public/media');
  fs.mkdirSync(out, { recursive: true });
  const source = path.join(__dirname, '../../首页形象.jpg');
  await Promise.all([
    sharp(source).extract({ left: 2520, top: 660, width: 1480, height: 2340 }).resize({ width: 1000 }).webp({ quality: 92 }).toFile(path.join(out, 'hero-character.webp')),
    sharp(source).extract({ left: 0, top: 380, width: 840, height: 2000 }).resize({ height: 1100 }).webp({ quality: 90 }).toFile(path.join(out, 'character-front.webp')),
    sharp(source).extract({ left: 890, top: 380, width: 760, height: 2000 }).resize({ height: 1100 }).webp({ quality: 90 }).toFile(path.join(out, 'character-side.webp')),
    sharp(source).extract({ left: 1640, top: 380, width: 860, height: 2000 }).resize({ height: 1100 }).webp({ quality: 90 }).toFile(path.join(out, 'character-back.webp')),
    sharp(source).resize({ width: 1800 }).webp({ quality: 88 }).toFile(path.join(out, 'character-sheet.webp')),
  ]);
  console.log('Prepared provided character assets.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });

