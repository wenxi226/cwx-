const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const dir = path.join(__dirname, '../public/fonts');
  fs.mkdirSync(dir, { recursive: true });
  const sources = [ ['barlow-condensed', 'Barlow Condensed', [500, 600]], ['space-grotesk', 'Space Grotesk', [400, 500, 600, 700]] ];
  const styles = await Promise.all(sources.map(async ([id, family, weights]) => {
    const metadata = await fetch(`https://registry.npmmirror.com/@fontsource%2f${id}/latest`, { signal: AbortSignal.timeout(20000) }).then(response => response.json());
    const response = await fetch(metadata.dist.tarball.replace('registry.npmjs.org', 'registry.npmmirror.com'), { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Font archive failed: ${response.status}`);
    const archive = require('node:zlib').gunzipSync(Buffer.from(await response.arrayBuffer()));
    const files = new Map();
    for(let offset = 0; offset + 512 <= archive.length;) {
      const name = archive.subarray(offset, offset+100).toString().replace(/\0.*$/s, '');
      if(!name) break;
      const size = parseInt(archive.subarray(offset+124, offset+136).toString().replace(/\0.*$/s, '').trim(), 8) || 0;
      files.set(name, archive.subarray(offset+512, offset+512+size));
      offset += 512 + Math.ceil(size/512)*512;
    }
    const rules = weights.map(weight => {
      const filename = `${id}-latin-${weight}-normal.woff2`;
      const file = files.get(`package/files/${filename}`);
      if(!file) throw new Error(`Missing ${filename}`);
      fs.writeFileSync(path.join(dir, filename), file);
      return `@font-face { font-family: '${family}'; font-style: normal; font-weight: ${weight}; font-display: swap; src: url('/fonts/${filename}') format('woff2'); }`;
    });
    const license = [...files].find(([name]) => /\/(LICENSE|OFL)(\.txt)?$/i.test(name));
    if(license) fs.writeFileSync(path.join(dir, `${id}-LICENSE.txt`), license[1]);
    return rules.join('\n');
  }));
  fs.writeFileSync(path.join(dir, 'fonts.css'), styles.join('\n\n'));
  console.log('Saved 6 local font files and font licenses.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });

