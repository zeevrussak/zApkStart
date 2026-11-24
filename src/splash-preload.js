'use strict';
const { contextBridge, ipcRenderer } = require('electron');
// 开机动画也要本地化：主进程只传纯数据（locale/dir/pref/osLocale），t 在 preload 这一侧现造
const i18n = require('./core/i18n');

contextBridge.exposeInMainWorld('zapkstartSplash', {
  version: () => ipcRenderer.invoke('splash:version'),
  isFirstRun: () => ipcRenderer.invoke('splash:isFirstRun'),
  // 运行组件是随包带来的（完整版 / 商店 MSIX 版）还是需要联网下载（轻量版）。
  // 开机动画据此换掉「下载 xx MB」那套文案 —— 明明已经内置了还写「正在下载」，
  // 用户会以为装完还要再下一遍。
  bundled: () => ipcRenderer.invoke('splash:bundled'),
  onProgress: (cb) => { ipcRenderer.on('splash:progress', (_e, p) => cb(p)); },
  onDone: (cb) => { ipcRenderer.on('splash:done', () => cb()); },
  close: () => ipcRenderer.send('splash:close'),
  i18n: {
    state: async () => {
      const s = await ipcRenderer.invoke('i18n:state');
      return { ...s, t: i18n.makeT(s.pref, s.osLocale) };
    },
  },
});
