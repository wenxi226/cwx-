const fs = require('node:fs');
const path = require('node:path');
const sharp = require('C:/Users/31589/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const workspace = path.resolve(__dirname, '..');
const sourceRoot = path.join(workspace, '..', '素材库');
const outputRoot = path.join(workspace, 'public', 'portfolio-assets');
const imageOutput = path.join(outputRoot, 'images');
const originalOutput = path.join(outputRoot, 'originals');
const videoOutput = path.join(outputRoot, 'videos');
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const videoExtensions = new Set(['.mp4', '.mov', '.webm', '.m4v']);
const imageSources = [
  { folder: '图片类', category: 'images', label: '图片作品', prefix: 'image' },
  { folder: '包装类', category: 'packaging', label: '包装作品', prefix: 'packaging' },
  { folder: 'IP设计', category: 'ip', label: 'IP 设计作品', prefix: 'ip' },
];

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function slug(value) {
  return value.normalize('NFKC').replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'asset';
}

function titleFromPath(relativePath) {
  const parts = relativePath.split(path.sep);
  return parts.at(-1) || parts.at(-2) || '未命名系列';
}

async function processImage(input, output) {
  await sharp(input).rotate().resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 84, effort: 4 }).toFile(output);
}

async function main() {
  if (!fs.existsSync(sourceRoot)) throw new Error(`素材库不存在：${sourceRoot}`);
  fs.rmSync(outputRoot, { recursive: true, force: true });
  fs.mkdirSync(imageOutput, { recursive: true });
  fs.mkdirSync(originalOutput, { recursive: true });
  fs.mkdirSync(videoOutput, { recursive: true });

  const imageProjects = [];
  const categoryCounts = {};
  let imageFilesTotal = 0;
  let seriesIndex = 1;

  for (const source of imageSources) {
    const sourceDirectory = path.join(sourceRoot, source.folder);
    const files = walk(sourceDirectory).filter(file => imageExtensions.has(path.extname(file).toLowerCase()));
    imageFilesTotal += files.length;
    const groups = new Map();
    for (const file of files) {
      const relative = path.relative(sourceDirectory, file);
      const group = path.dirname(relative);
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(file);
    }
    categoryCounts[source.category] = groups.size;

    for (const [group, groupFiles] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, 'zh-CN'))) {
      groupFiles.sort((a, b) => path.basename(a).localeCompare(path.basename(b), 'zh-CN', { numeric: true }));
      const images = [];
      const originalImages = [];
      const seriesId = String(seriesIndex).padStart(3, '0');
      for (let fileIndex = 0; fileIndex < groupFiles.length; fileIndex += 1) {
        const file = groupFiles[fileIndex];
        const base = `${source.prefix}-${seriesId}-${String(fileIndex + 1).padStart(2, '0')}-${slug(path.basename(file, path.extname(file)))}`;
        const displayName = `${base}.webp`;
        const originalName = `${base}${path.extname(file).toLowerCase()}`;
        await processImage(file, path.join(imageOutput, displayName));
        fs.copyFileSync(file, path.join(originalOutput, originalName));
        images.push(`/portfolio-assets/images/${encodeURIComponent(displayName)}`);
        originalImages.push(`/portfolio-assets/originals/${encodeURIComponent(originalName)}`);
      }
      const parts = group.split(path.sep);
      const pathLabel = [source.folder, ...parts].join(' / ');
      imageProjects.push({
        id: `material-${source.category}-${seriesId}`,
        title: titleFromPath(group),
        subtitle: `${parts.slice(0, -1).join(' / ') || source.folder} · ${source.label}`,
        category: source.category,
        layout: 'material-gallery',
        image: images[0],
        images,
        originalImages,
        year: '2026',
        folder: pathLabel,
        description: `来自素材库「${pathLabel}」的 ${groupFiles.length} 张${source.label}。`
      });
      seriesIndex += 1;
    }
  }

  const videoDirectory = path.join(sourceRoot, '视频类');
  const videoFiles = walk(videoDirectory).filter(file => videoExtensions.has(path.extname(file).toLowerCase()));
  const videoProjects = [];
  for (let index = 0; index < videoFiles.length; index += 1) {
    const file = videoFiles[index];
    const relative = path.relative(videoDirectory, file);
    const folder = path.dirname(relative);
    const extension = path.extname(file).toLowerCase();
    const outputName = `${String(index + 1).padStart(3, '0')}-${slug(path.basename(file, extension))}${extension}`;
    fs.copyFileSync(file, path.join(videoOutput, outputName));
    videoProjects.push({ id: `material-video-${String(index + 1).padStart(3, '0')}`, title: path.basename(file, extension), subtitle: `${folder} · 视频作品`, category: 'video', layout: 'material-video', video: `/portfolio-assets/videos/${encodeURIComponent(outputName)}`, year: '2026', folder: `视频类/${relative.split(path.sep).join('/')}`, description: `来自素材库「视频类 / ${folder}」的最新视频作品。` });
  }

  const allProjects = [...imageProjects, ...videoProjects];
  fs.writeFileSync(path.join(workspace, 'src', 'materialProjects.js'), `// Generated from C:/Users/31589/Desktop/作品集/素材库. Do not edit by hand.\nexport const materialProjects = ${JSON.stringify(allProjects, null, 2)};\n`, 'utf8');
  fs.writeFileSync(path.join(outputRoot, 'manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), imageFiles: imageFilesTotal, imageSeries: imageProjects.length, imageSeriesByCategory: categoryCounts, videoFiles: videoFiles.length, projects: allProjects.length }, null, 2));
  console.log(JSON.stringify({ imageFiles: imageFilesTotal, imageSeries: imageProjects.length, imageSeriesByCategory: categoryCounts, videoFiles: videoFiles.length, projects: allProjects.length, outputRoot }, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });

