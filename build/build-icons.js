'use strict';
/**
 * 统一图标生成器
 *   node_modules/electron/dist/electron.exe build/build-icons.js
 *
 * 一套设计，三种尺寸语言（业界通行做法，不是三套图标）：
 *   1. 主标   ≥64px    build/logo.html 的「APK start」深色磁贴（Chromium 离屏渲染）
 *   2. 简化标 ≤48px    同色板深底 + 安卓绿播放三角（纯 JS 绘制，16px 仍可辨识）
 *   3. 磁贴版          主标裁掉透明边后满幅，交给 Windows 自己裁圆角
 *
 * 产出：
 *   src/ui/assets/logo.png (512) / logo-256 / logo-128 / logo-64    窗口、关于页、Linux
 *   src/ui/assets/tray-16|20|24|32.png                               托盘（简化标）
 *   src/ui/assets/appicon.ico                                        16–256 多尺寸
 *   build/store-assets/StoreLogo 50 / Square44 / Square71 /
 *                      Square150 / Square310 / Wide310x150 / Splash 620x300
 *   docs/images/logo.png (1024)
 */
const { app, BrowserWindow, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');
const { drawAppIcon } = require('../src/core/png');

const ROOT = path.join(__dirname, '..');
const UI = path.join(ROOT, 'src', 'ui', 'assets');
const STORE = path.join(ROOT, 'build', 'store-assets');
const DOCS = path.join(ROOT, 'docs', 'images');

// 1:1 像素，别让高 DPI 缩放把 1024 渲染成 1280
app.commandLine.appendSwitch('force-device-scale-factor', '1');
app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');
app.disableHardwareAcceleration();

const SQ = 1024;
const TILE_RATIO = 896 / 1024;            // 主标里磁贴占画面比例
const TILE_PAD = Math.round((SQ - SQ * TILE_RATIO) / 2);

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function pngSize(buf) {
  if (!buf || buf.length < 24 || buf.toString('ascii', 1, 4) !== 'PNG') return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function save(file, buf) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, buf);
  const s = pngSize(buf);
  const dim = s ? `${s.w}x${s.h}` : `${buf.length}B`;
  console.log(`  ${path.relative(ROOT, file).replace(/\\/g, '/')}  ${dim}  ${(buf.length / 1024).toFixed(1)}KB`);
  return { file, buf, dim };
}

/** PNG-in-ICO：Vista 起 ICO 条目可直接内嵌 PNG，不重编码、不丢 alpha。 */
function icoFrom(entries) {
  const items = entries.slice().sort((a, b) => a.size - b.size);
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(items.length, 4);
  const dir = Buffer.alloc(items.length * 16);
  let offset = 6 + items.length * 16;
  items.forEach((it, i) => {
    const p = i * 16;
    dir.writeUInt8(it.size >= 256 ? 0 : it.size, p);
    dir.writeUInt8(it.size >= 256 ? 0 : it.size, p + 1);
    dir.writeUInt8(0, p + 2);
    dir.writeUInt8(0, p + 3);
    dir.writeUInt16LE(1, p + 4);
    dir.writeUInt16LE(32, p + 6);
    dir.writeUInt32LE(it.buf.length, p + 8);
    dir.writeUInt32LE(offset, p + 12);
    offset += it.buf.length;
  });
  return Buffer.concat([head, dir, ...items.map((i) => i.buf)]);
}

// 一个窗口画布同时容纳三种布局，渲染后按坐标裁剪。
// 不要每次新建 BrowserWindow：offscreen 模式下连续 destroy/create 时，
// 第二次 loadFile 会稳定报 ERR_FAILED（Electron 33 的坑）。
const CANVAS = 1240;
let _win = null;

async function ensureWindow() {
  if (_win) return _win;
  _win = new BrowserWindow({
    width: CANVAS,
    height: CANVAS,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: { offscreen: true, backgroundThrottling: false },
  });
  _win.setContentSize(CANVAS, CANVAS);
  await _win.loadFile(path.join(__dirname, 'logo.html'));
  try {
    await _win.webContents.executeJavaScript('document.fonts.ready.then(() => true)');
  } catch (_) { /* 老版本没有 fonts API，靠下面的延时 */ }
  await new Promise((r) => setTimeout(r, 900));
  return _win;
}

async function render(layout, w, h) {
  const win = await ensureWindow();
  await win.webContents.executeJavaScript(
    `document.body.classList.remove('layout-square','layout-wide','layout-splash');`
    + `document.body.classList.add('layout-${layout}');true;`
  );
  await new Promise((r) => setTimeout(r, 700));
  const full = nativeImage.createFromBuffer((await win.webContents.capturePage()).toPNG());
  const got = full.getSize();
  if (got.width < w || got.height < h) {
    console.log(`  [警告] 画布 ${got.width}x${got.height} 小于 ${w}x${h}，改用缩放`);
    return full.resize({ width: w, height: h, quality: 'best' });
  }
  const x = Math.round((got.width - w) / 2);
  const y = Math.round((got.height - h) / 2);
  return full.crop({ x, y, width: w, height: h });
}

function resized(img, w, h) {
  return img.resize({ width: w, height: h, quality: 'best' }).toPNG();
}

app.whenReady().then(async () => {
  console.log('渲染主标（square 1024）…');
  const square = await render('square', SQ, SQ);

  console.log('渲染宽磁贴（wide 620x300）…');
  const wide = await render('wide', 620, 300);

  console.log('渲染启动图（splash 1240x600）…');
  const splash = await render('splash', 1240, 600);

  // 磁贴版：裁掉主标四周的透明留白，让磁贴满幅，避免开始菜单里图标偏小
  const tileBox = { x: TILE_PAD, y: TILE_PAD, width: SQ - TILE_PAD * 2, height: SQ - TILE_PAD * 2 };
  const tile = square.crop(tileBox);
  const tileSize = tile.getSize();
  console.log(`主标磁贴区 ${tileSize.width}x${tileSize.height}（裁自 1024 中央）`);

  console.log('\n输出品牌图：');
  save(path.join(DOCS, 'logo.png'), square.toPNG());
  save(path.join(UI, 'logo.png'), resized(square, 512, 512));
  save(path.join(UI, 'logo-256.png'), resized(square, 256, 256));
  save(path.join(UI, 'logo-128.png'), resized(square, 128, 128));
  save(path.join(UI, 'logo-64.png'), resized(square, 64, 64));

  console.log('\n输出托盘图（简化标）：');
  for (const s of [16, 20, 24, 32]) {
    save(path.join(UI, `tray-${s}.png`), drawAppIcon(s));
  }

  console.log('\n输出 ICO（16–48 简化标 / 64–256 主标）：');
  const icoEntries = [];
  for (const s of [16, 20, 24, 32, 40, 48]) icoEntries.push({ size: s, buf: drawAppIcon(s) });
  for (const s of [64, 128, 256]) icoEntries.push({ size: s, buf: resized(tile, s, s) });
  const ico = icoFrom(icoEntries);
  save(path.join(UI, 'appicon.ico'), ico);

  console.log('\n输出商店资源：');
  save(path.join(STORE, 'StoreLogo.png'), drawAppIcon(50));
  save(path.join(STORE, 'Square44x44Logo.png'), drawAppIcon(44));
  save(path.join(STORE, 'Square71x71Logo.png'), drawAppIcon(71));
  save(path.join(STORE, 'Square150x150Logo.png'), resized(tile, 150, 150));
  save(path.join(STORE, 'Square310x310Logo.png'), resized(tile, 310, 310));
  save(path.join(STORE, 'Wide310x150Logo.png'), resized(wide, 310, 150));
  save(path.join(STORE, 'SplashScreen.png'), resized(splash, 620, 300));

  console.log('\n完成。校验汇总：');
  const check = [
    ['logo-256.png', 256, 256], ['tray-16.png', 16, 16], ['tray-32.png', 32, 32],
    ['StoreLogo.png', 50, 50], ['Square44x44Logo.png', 44, 44], ['Square71x71Logo.png', 71, 71],
    ['Square150x150Logo.png', 150, 150], ['Square310x310Logo.png', 310, 310],
    ['Wide310x150Logo.png', 310, 150], ['SplashScreen.png', 620, 300],
  ];
  let bad = 0;
  for (const [name, w, h] of check) {
    const p = [UI, STORE].map((d) => path.join(d, name)).find((f) => fs.existsSync(f));
    const s = p ? pngSize(fs.readFileSync(p)) : null;
    const ok = !!s && s.w === w && s.h === h;
    if (!ok) bad += 1;
    console.log(`  ${ok ? 'OK  ' : 'BAD '} ${name} ${s ? `${s.w}x${s.h}` : 'missing'} (期望 ${w}x${h})`);
  }
  const icoBuf = fs.readFileSync(path.join(UI, 'appicon.ico'));
  const icoCount = icoBuf.readUInt16LE(4);
  console.log(`  ${icoCount === 9 ? 'OK  ' : 'BAD '} appicon.ico ${icoCount} 个尺寸`);
  app.exit(bad === 0 && icoCount === 9 ? 0 : 1);
}).catch((e) => {
  console.error('生成失败：', e);
  app.exit(1);
});
