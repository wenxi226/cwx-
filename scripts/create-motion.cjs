const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/31589/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.setContent('<canvas id="motion" width="1440" height="1000"></canvas>');
  const bytes = await page.evaluate(async () => {
    const canvas = document.getElementById('motion');
    const ctx = canvas.getContext('2d');
    const duration = 8000;
    function draw(time) {
      const phase = time / duration * Math.PI * 2;
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 1440, 1000);
      ctx.fillStyle = '#acd044';
      ctx.beginPath(); ctx.moveTo(0, 1000); ctx.lineTo(1440, 370); ctx.lineTo(1440, 750); ctx.lineTo(690, 1000); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.clip();
      ctx.strokeStyle = 'rgba(255,255,255,.13)'; ctx.lineWidth = 1;
      for (let i = -18; i < 24; i++) {
        const offset = Math.sin(phase) * 18;
        ctx.beginPath(); ctx.moveTo(i * 100 + offset, 1000); ctx.lineTo(i * 100 + 1440 + offset, 370); ctx.stroke();
      }
      const opacity = .1 + (Math.sin(phase) + 1) * .06;
      ctx.fillStyle = `rgba(255,255,255,${opacity})`;
      for(let i = 0; i < 5; i++) {
        const x = 70 + i * 47 + Math.sin(phase) * 30;
        const y = 939 - i * 21;
        ctx.beginPath(); ctx.moveTo(x,y);ctx.lineTo(x+16,y-7);ctx.lineTo(x+3,y-31);ctx.lineTo(x-13,y-24);ctx.closePath();ctx.fill();
      }
      ctx.restore();
      ctx.strokeStyle = `rgba(153,184,105,${.12 + (Math.sin(phase)+1)*.07})`;
      ctx.lineWidth = 1;
      ctx.beginPath();ctx.arc(1165, 340, 264 + Math.sin(phase)*12, 0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.arc(1165, 340, 280 + Math.sin(phase)*12, .1,1.4);ctx.stroke();
      ctx.fillStyle = '#a6c66b';
      const markerX = 760 + Math.sin(phase)*100;
      ctx.fillRect(markerX, 112, 23, 2);
      ctx.fillRect(markerX + 10, 103, 2, 20);
    }
    draw(0);
    const supported = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    const recorder = new MediaRecorder(canvas.captureStream(30), { mimeType: supported, videoBitsPerSecond: 1800000 });
    const chunks = [];
    recorder.ondataavailable = event => { if(event.data.size) chunks.push(event.data); };
    const complete = new Promise(resolve => { recorder.onstop = async () => resolve(Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer()))); });
    recorder.start();
    const start = performance.now();
    function tick(now) { draw((now-start)%duration); if(now-start<duration) requestAnimationFrame(tick); else recorder.stop(); }
    requestAnimationFrame(tick);
    return complete;
  });
  const destination = path.join(__dirname, '../public/media/hero-motion.webm');
  fs.writeFileSync(destination, Buffer.from(bytes));
  console.log(`Saved local motion loop: ${bytes.length} bytes`);
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });

