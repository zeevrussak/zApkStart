'use strict';
/**
 * 底座嵌入探针（开发用，不打进发行版）
 *
 * 目的：在真实 Electron 窗口里验证「第三方底座的画面窗口能不能嵌进来」，
 * 不用打开主界面、不用装应用，方便改一版跑一次。
 *
 * 为什么单独做一个极小的 Electron 应用（tools/embed-probe/）：
 * electron.exe 只把「目录（带 package.json）」当成 app，直接传 .js 不会跑。
 *
 * 用法：
 *   set APKSTART_BACKEND=mumu  &  node_modules\electron\dist\electron.exe tools\embed-probe
 *   注意必须清掉 ELECTRON_RUN_AS_NODE（某些环境会设成 1，那样 electron 只当 node 用）。
 *
 * 做的事：
 *   1. 按 id 建后端实例，ensure() 开机；
 *   2. 等窗口就绪（windowReady）；
 *   3. 用和正式代码同一条路径（WinAgent.embed，带 targets）嵌进一个宿主窗口；
 *   4. 截图存到 .probe/embed-probe-<id>.png，然后退出。
 */
const { BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

const backendId = process.env.APKSTART_BACKEND || 'mumu';
const OUT_DIR = path.join(__dirname, '..', '..', '.probe');

function outDir() {
  try { fs.mkdirSync(OUT_DIR, { recursive: true }); } catch (_) { /* ignore */ }
  return OUT_DIR;
}

/** 结果同时写文件：Electron 主进程的 stdout 在不少启动方式下抓不到 */
function log(m) {
  const line = `[probe] ${m}\n`;
  try { fs.appendFileSync(path.join(outDir(), 'probe.log'), line); } catch (_) { /* ignore */ }
  try { process.stdout.write(line); } catch (_) { /* ignore */ }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run(appRoot) {
  try { fs.writeFileSync(path.join(outDir(), 'probe.log'), ''); } catch (_) { /* ignore */ }

  // 这里才 require Electron 侧的东西：入口文件先跑过 app.whenReady() 了
  const backends = require(path.join(appRoot, 'src', 'core', 'backends'));
  const { WinAgent } = require(path.join(appRoot, 'src', 'core', 'agent'));

  const Cls = backends.byId(backendId);
  if (!Cls) { log(`未知后端 ${backendId}`); return; }
  const backend = new Cls(appRoot, { runtime: null, store: null, log });

  log(`probe ${backendId} …`);
  const probe = await backend.probe();
  log(`probe → ${JSON.stringify(probe)}`);
  if (!probe.found) { log('没有找到这个后端'); return; }

  log('ensure() …');
  const t0 = Date.now();
  const ens = await backend.ensure({ onLog: (m) => log(`  ${m}`) });
  log(`ensure → ok=${ens.ok} serial=${ens.serial} reused=${ens.reused} (${Date.now() - t0}ms)`);
  if (!ens.ok) { log(`失败：${ens.error}`); return; }

  const win = new BrowserWindow({
    width: 560,
    height: 1000,
    show: true,
    frame: false,
    backgroundColor: '#101014',
  });
  await win.loadURL('data:text/html,<html><body style="margin:0;background:%23101014"></body></html>');
  await sleep(900);

  const agent = new WinAgent();
  await agent.ensure();
  await agent.scope([], process.pid).catch(() => null);
  log('agent ready');

  const ready = await backend.windowReady({}).catch((e) => ({ ok: false, reason: e.message }));
  log(`windowReady → ${JSON.stringify(ready)}`);
  await sleep(1500);

  const targets = await backend.windowTargets().catch(() => []);
  log(`targets → ${JSON.stringify(targets)}`);
  if (!targets.length) { log('拿不到窗口句柄，结束'); return; }

  const buf = win.getNativeWindowHandle();
  const hwnd = buf.length >= 8 ? buf.readBigUInt64LE(0) : BigInt(buf.readUInt32LE(0));
  const content = win.getContentBounds();
  const r = await agent.embed(Number(hwnd), {
    x: 0, y: 0, w: content.width, h: content.height,
  }, targets);
  log(`embed → ${JSON.stringify(r)}`);

  await sleep(2600);
  const img = await win.webContents.capturePage();
  const png = img.toPNG();
  const out = path.join(outDir(), `embed-probe-${backendId}.png`);
  fs.writeFileSync(out, png);
  log(`截图 → ${out} (${png.length} bytes)`);

  await agent.park().catch(() => {});
  agent.dispose();
  log('done');
}

module.exports = { run };
