// 探针入口：只做最少的 Electron 初始化，然后把活交给 ../embed-probe.js
const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const LOG = path.join(__dirname, '..', '..', '..', '.probe', 'boot.txt');
function mark(m) { try { fs.appendFileSync(LOG, m + ' ' + new Date().toISOString() + '\n'); } catch (_) {} }
try { fs.mkdirSync(path.dirname(LOG), { recursive: true }); fs.writeFileSync(LOG, ''); } catch (_) {}
mark('module-loaded');

// 子进程也会跑这个脚本（--type=renderer/gpu/...），一律不掺和主流程
if (process.argv.some((a) => a.startsWith('--type='))) {
  module.exports = {};
} else {
  process.on('uncaughtException', (e) => { mark('UNCAUGHT ' + (e && e.stack || e)); });

  mark('before-whenReady');
  app.whenReady().then(async () => {
    mark('ready');
    try {
      const { run } = require('../embed-probe.js');
      await run(path.join(__dirname, '..', '..'));
      mark('done');
      app.exit(0);
    } catch (e) {
      mark('ERR ' + (e && e.stack || e));
      app.exit(1);
    }
  });
  app.on('window-all-closed', () => {});
}
