'use strict';
/**
 * 按键映射运行时引擎
 *
 * 在应用窗口前台时，拦截键盘事件 → 查当前应用的映射表 → 转成 adb input 命令。
 * 与 pointer.js（鼠标钩子）并行工作：鼠标走 Qt 原生 + 右键/滚轮钩子，
 * 键盘走这里。两者互不干扰。
 *
 * 设计约束：
 *  - 纯 Node 模块，不依赖 Electron BrowserWindow（方便单测）；
 *  - adb 命令通过注入的 `execInput(cmd)` 回调发送，解耦 AdbClient；
 *  - 每条命令有最小间隔（默认 50ms），防止快速连按时 adb shell 排队卡死；
 *  - 映射表按应用包名存储，切换应用时自动切换。
 */

const { lookup, toCommand } = require('./keymap');

class KeymapEngine {
  /**
   * @param {object} opts
   * @param {Function} opts.execInput  (cmd) => Promise — 发送 adb shell input 命令
   * @param {Function} opts.getSize    () => {width, height} — 当前 LCD 尺寸
   * @param {number}   [opts.minInterval=50]  两条命令之间的最小间隔（ms）
   */
  constructor({ execInput, getSize, minInterval = 50 } = {}) {
    this._exec = execInput || (() => Promise.resolve());
    this._getSize = getSize || (() => ({ width: 720, height: 1280 }));
    this._minInterval = minInterval;
    this._lastExec = 0;
    this._enabled = false;
    // pkg → mappings[]
    this._maps = new Map();
  }

  /** 设置某个应用的映射表 */
  setMap(pkg, mappings) {
    if (!pkg) return;
    if (!mappings || !mappings.length) { this._maps.delete(pkg); return; }
    this._maps.set(pkg, mappings);
  }

  /** 获取某个应用的映射表 */
  getMap(pkg) { return this._maps.get(pkg) || []; }

  /** 启用/禁用 */
  enable(on) { this._enabled = !!on; }
  get enabled() { return this._enabled; }

  /**
   * 处理一个键盘事件。
   * @param {string} key Electron KeyboardEvent.key
   * @param {string} pkg 当前前台应用包名
   * @returns {Promise<boolean>} 是否消费了这个按键（true = 已映射并发送）
   */
  async handleKey(key, pkg) {
    if (!this._enabled || !pkg) return false;
    const mappings = this._maps.get(pkg);
    if (!mappings || !mappings.length) return false;
    const hit = lookup(mappings, key);
    if (!hit) return false;
    const { width, height } = this._getSize();
    const cmd = toCommand(hit, width, height);
    if (!cmd) return false;
    // 限流：防止快速连按时 adb shell 排队
    const now = Date.now();
    const wait = Math.max(0, this._minInterval - (now - this._lastExec));
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    this._lastExec = Date.now();
    try { await this._exec(cmd); } catch (_) { /* 输入注入失败不影响游戏 */ }
    return true;
  }
}

module.exports = { KeymapEngine };
