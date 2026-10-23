// Regenerate web videos from the untouched source library. Requires FFmpeg + ffprobe.
const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const ffmpeg = process.env.FFMPEG_BIN || 'ffmpeg';
const ffprobe = process.env.FFPROBE_BIN || 'ffprobe';
const sourceRoot = process.env.MATERIAL_SOURCE || path.resolve(root, '../素材库');
const raw = fs.readFileSync(path.join(root, 'src/materialProjects.js'), 'utf8');
const projects = JSON.parse(raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1));
const output = path.join(root, 'public/portfolio-assets/videos-optimized');
fs.mkdirSync(output, { recursive: true });
const probe = file => JSON.parse(spawnSync(ffprobe, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file], { encoding: 'utf8' }).stdout);
const run = args => new Promise((resolve, reject) => {
  const child = spawn(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-nostdin', ...args], { windowsHide: true });
  let error = '';
  child.stderr.on('data', data => { error += data; });
  child.on('error', reject);
  child.on('close', code => code === 0 ? resolve() : reject(new Error(error || `FFmpeg exited ${code}`)));
});

async function main() {
  const report = [];
  for (const project of projects.filter(item => item.category === 'video')) {
    const source = path.join(sourceRoot, project.folder);
    const id = project.id.replace('material-video-', '');
    const target = path.join(output, `${id}.mp4`);
    const poster = path.join(output, `${id}.webp`);
    const original = probe(source);
    const originalAudio = original.streams.find(stream => stream.codec_type === 'audio');
    console.log(`Encoding ${id} ${project.title}`);
    // Long edge <=1280, even dimensions, original aspect ratio. H.264/AAC works
    // with native players on Android/iOS; front-loaded MP4 metadata enables seeking.
    await run(['-y', '-threads', '4', '-i', source, '-map', '0:v:0', '-map', '0:a:0?',
      '-vf', 'scale=1280:1280:force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1,fps=30',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-threads', '4', '-pix_fmt', 'yuv420p',
      '-profile:v', 'high', '-level:v', '4.1', '-tag:v', 'avc1', '-g', '60',
      '-c:a', originalAudio?.codec_name === 'aac' ? 'copy' : 'aac',
      ...(originalAudio?.codec_name === 'aac' ? [] : ['-b:a', '128k']),
      '-movflags', '+faststart', '-map_metadata', '-1', target]);
    await run(['-y', '-threads', '2', '-ss', String(Math.min(8, Number(original.format.duration) * .25)), '-i', source, '-frames:v', '1', '-vf',
      'scale=640:640:force_original_aspect_ratio=decrease', '-quality', '82', poster]);
    const encoded = probe(target);
    // Decode the complete file, including its audio. A valid header alone is insufficient.
    await run(['-xerror', '-threads', '2', '-i', target, '-f', 'null', '-']);
    const stream = encoded.streams.find(item => item.codec_type === 'video');
    const audio = encoded.streams.find(item => item.codec_type === 'audio');
    project.video = `/portfolio-assets/videos-optimized/${id}.mp4`;
    project.poster = `/portfolio-assets/videos-optimized/${id}.webp`;
    project.videoWidth = stream.width;
    project.videoHeight = stream.height;
    report.push({ id, title: project.title, originalBytes: Number(original.format.size), bytes: Number(encoded.format.size),
      duration: Number(encoded.format.duration), width: stream.width, height: stream.height,
      videoCodec: stream.codec_name, pixelFormat: stream.pix_fmt, audioCodec: audio?.codec_name,
      audioCopied: originalAudio?.codec_name === 'aac', fullDecode: 'passed' });
    fs.writeFileSync(path.join(output, 'verification.json'), JSON.stringify(report, null, 2));
    console.log(`Verified ${id}: ${encoded.format.size} bytes, ${stream.width}x${stream.height}, audio=${audio?.codec_name}`);
  }
  fs.writeFileSync(path.join(root, 'src/materialProjects.js'), `export const materialProjects = ${JSON.stringify(projects, null, 2)};\n`);
  console.log('Completed all 15 videos');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
