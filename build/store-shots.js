'use strict';
/**
 * 生成 Microsoft Store 截图（1920×1080，满足 1366×768 下限）
 *   node_modules/electron/dist/electron.exe build/store-shots.js
 *
 * 素材用仓库里已有的真实界面截图（docs/images），只加背景与说明文字，
 * 不修改界面本身 —— Store 要求截图反映真实 UI。
 */
const { app, BrowserWindow, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'store-shots');
const W = 1920;
const H = 1080;

app.commandLine.appendSwitch('force-device-scale-factor', '1');
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
app.disableHardwareAcceleration();

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

app.whenReady().then(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const win = new BrowserWindow({
    width: W, height: H, show: false, frame: false,
    backgroundColor: '#0a0e13',
    webPreferences: { offscreen: true, backgroundThrottling: false },
  });
  win.setContentSize(W, H);
  await win.loadFile(path.join(__dirname, 'store-shots.html'));
  try { await win.webContents.executeJavaScript('document.fonts.ready.then(()=>true)'); } catch (_) {}
  await sleep(1200);

  const names = ['1-main', '2-window', '3-bundled'];
  for (let i = 0; i < names.length; i++) {
    const shot = String(i + 1);
    await win.webContents.executeJavaScript(
      `document.body.classList.remove('s2','s3');`
      + `if('${shot}'!=='1')document.body.classList.add('s${shot}');true;`
    );
    await sleep(700);
    const img = await win.webContents.capturePage();
    const buf = img.toPNG();
    const file = path.join(OUT, `${names[i]}.png`);
    fs.writeFileSync(file, buf);
    const s = nativeImage.createFromBuffer(buf).getSize();
    console.log(`  ${path.relative(ROOT, file).replace(/\\/g, '/')}  ${s.width}x${s.height}  ${(buf.length / 1024).toFixed(0)}KB`);
    if (s.width !== W || s.height !== H) console.log(`  [警告] 期望 ${W}x${H}`);
  }
  console.log('完成。');
  app.exit(0);
}).catch((e) => { console.error('失败：', e); app.exit(1); });
