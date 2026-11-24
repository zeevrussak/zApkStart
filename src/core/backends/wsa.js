'use strict';
/**
 * 底座：WSA（Windows Subsystem for Android，社区续作）——「外接 adb 设备」后端的第一个实例。
 *
 * 设计与裁决见 docs/zapkstart/wsa-backend.md：本文档**推翻**了 0.5.6 的「WSA 都不接」
 * （docs/backend-roadmap.md:15,87-91），前提是把反抢保证收窄成三件套：
 *   opt-in（只有用户在设置里显式选了 wsa）+ 探测确认（包不在就回落 builtin）
 *   + 绝不自动选择（autoPick 永远 builtin）。
 *
 * 形状：这是一个通用的 `adb connect <ip:port>` 端点。WSA 只是第一个实例 ——
 * redroid（WSL2-ARM64 容器安卓）甚至 TCP 连接的真机，之后都能以近零后端代码接入。
 *
 * 与 builtin 的本质区别（所有上层据此收敛行为）：
 *   - 传输只有 adb：装/开/截图全走 Runtime.client()，零改动复用现有流水线；
 *   - 画面窗口是 WSA 自己的 freeform 窗口：不嵌入、不 SetParent、不旋转、不键位钩子
 *     （caps 里只有 sharedHost，正是为这类「窗口归别人管」的底座准备的）；
 *   - VM 是**用户管理的**：stop() 只 adb disconnect，绝不 emu kill / 按端口推算 taskkill
 *     （5855-1=5854 上监听的是谁我们根本不知道）；
 *   - 不承诺 GMS：core-lane 社区构建没有 Play，GMS 依赖的应用由文案如实交代。
 *
 * 探测不下载： ZapkStart 永远不碰微软的 WSA 二进制，只探测已装的包并给出中性链接
 * （链接只在用户显式点击时经 shell.openExternal 打开，见 preflight/settings）。
 */
const { execFile } = require('child_process');
const { Backend, CAPS } = require('./base');
const arch = require('../arch');
const store = require('../store');
const { t } = require('../i18n');

/** WSA App 的 AUMID：explorer shell: 打开它的设置界面 = 拉起子系统 VM */
const WSA_AUMID = 'MicrosoftCorporationII.WindowsSubsystemForAndroid_cw5n1h2txyewy!Microsoft.WindowsSubsystemForAndroid';

/** WSA 的 adb 端口：5855 官方默认；5555 在部分社区构建上出现过（回退一次并持久化） */
const PRIMARY_PORT = store.DEFAULT_WSA_PORT;
const FALLBACK_PORT = 5555;

/** 连接预算：2s × 45 = 90 秒（VM 冷启动 + 子系统 Android 引导） */
const CONNECT_POLL_INTERVAL = 2000;
const CONNECT_POLL_TRIES = 45;
/** 端口回退的轮询预算：2s × 15 = 30 秒（只验证端口，不做完整开机等待） */
const PORT_FALLBACK_TRIES = 15;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class WsaBackend extends Backend {
  static get id() { return 'wsa'; }

  static get label() { return t('wsa.backend_label'); }

  static get summary() { return t('wsa.backend_summary'); }

  /** WSA 自己开 freeform 应用窗口：我们的窗口管线（嵌入/隐藏/旋转）整条不适用 */
  static get embedCapable() { return false; }

  constructor(appRoot, deps = {}) {
    super(appRoot, deps);
    this.rt = deps.runtime || null;
    /**
     * 可注入缝（单测用）：probeFn 替代真实包探测，clientFactory 替代 AdbClient 构造。
     * 生产路径两者都是 undefined，走 arch.detectWsa() / new AdbClient(...)。
     */
    this._probeFn = deps.probeFn || null;
    this._clientFactory = deps.clientFactory || null;
    /** 本次进程里见过 adb 设备 = running() 的依据（VM 归 WSA 管，我们只有传输视角） */
    this._vmSeen = false;
    /** 与 Runtime.ensure 同款幂等：预热/用户点击并发时共用同一个 Promise */
    this._ensurePromise = null;
  }

  /** 只有 sharedHost：画面窗口由第三方软件创建，上层不要嵌、不要藏、不要转 */
  get caps() {
    return new Set([CAPS.sharedHost]);
  }

  /**
   * 把 ensure() 算出来的 serial 写回 Runtime（与 BuiltinBackend.syncSerial 的读取方向相反：
   * builtin 的 serial 由 emulator 进程决定、Runtime 是真相；WSA 的 serial 由我们推算、
   * 要告诉 Runtime —— 这样 runtime.client() 默认就连这台设备）。
   */
  syncSerial() {
    if (this.rt) this.rt.emuSerial = this.serial;
    return this.serial;
  }

  /** VM 是否活着：我们只有「见过设备」这一个信号，保守且够用（watchdog 有 isOnline 兜底） */
  running() { return this._vmSeen; }

  /**
   * 探测：机器上装没装 WSA（arch.detectWsa 的 60 秒 TTL 缓存）。
   * 只探测、零副作用 —— 这里绝不下载/安装任何东西。
   */
  async probe() {
    const fn = this._probeFn || (() => arch.detectWsa());
    try {
      const r = await fn();
      this._probeCache = { found: !!r.found, version: r.version || '' };
      return { ok: true, found: !!r.found, version: r.version || '', detail: r.error || '' };
    } catch (e) {
      return { ok: false, found: false, detail: (e && e.message) || 'probe-failed' };
    }
  }

  /** 就绪检查：包在 + adb 可用。开关状态、VM 状态这类「动态事实」由 ensure() 负责 */
  async check() {
    const p = await this.probe();
    if (!p.found) return { ok: false, reason: t('wsa.not_installed'), needs: 'wsa-not-installed' };
    if (this.rt) {
      const env = await this.rt.provisioner.checkEnv().catch(() => null);
      if (!env || !env.adb.ok) return { ok: false, reason: t('wsa.adb_missing'), needs: 'adb' };
    }
    return { ok: true, version: p.version };
  }

  async resolveAdb() {
    if (this.rt && typeof this.rt.adbPath === 'function') return this.rt.adbPath();
    // 无 Runtime（纯单测）：交给 AdbClient 自己解析
    const { AdbClient } = require('../adb');
    return AdbClient.resolveAdb('', this.appRoot);
  }

  _makeClient(serial) {
    if (this._clientFactory) return this._clientFactory(serial);
    const { AdbClient } = require('../adb');
    return new AdbClient({ adbPath: this.resolveAdb(), serial });
  }

  /**
   * 对一个 serial 做「connect → 真实命令探测」。
   * state 只会是：ok（device 且命令能通）/ unauthorized / offline（device 但命令不通）
   * / no-device（轮询预算用完都没见到）。
   */
  async _trySerial(serial, tries, onLog = () => {}) {
    const client = this._makeClient(serial);
    for (let i = 0; i < tries; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await client.connect().catch(() => false);
      // eslint-disable-next-line no-await-in-loop
      const st = await (typeof client.deviceState === 'function'
        ? client.deviceState()
        : Promise.resolve((await client.isOnline().catch(() => false)) ? 'device' : 'no-device'));
      if (st === 'unauthorized') return { ok: false, client, state: 'unauthorized' };
      if (st === 'device') {
        // 「device」只是传输层状态。补一条真实命令（对齐 engine._ensureInner 的僵尸探测）：
        // 命令能通才算就绪；不通就按 offline 继续轮询（子系统可能还在引导）。
        // eslint-disable-next-line no-await-in-loop
        const probeCmd = await client.shell('getprop sys.boot_completed', { timeout: 8000 }).catch(() => null);
        if (probeCmd !== null) return { ok: true, client, state: 'device' };
      }
      if (i > 0 && i % 10 === 0) onLog(t('wsa.connect_wait', { sec: Math.round((i * CONNECT_POLL_INTERVAL) / 1000) }));
      // eslint-disable-next-line no-await-in-loop
      await sleep(CONNECT_POLL_INTERVAL);
    }
    return { ok: false, client: null, state: 'no-device' };
  }

  /** 通过 explorer 打开 WSA 的 App 入口 = 拉起子系统 VM（explorer 返回码不可靠，忽略） */
  _startVm() {
    return new Promise((resolve) => {
      try {
        execFile('explorer.exe', [`shell:AppsFolder\\${WSA_AUMID}`], { windowsHide: true }, () => resolve(true));
      } catch (_) { resolve(false); }
    });
  }

  /** ensure 成功的收尾：serial 落位 + 写回 Runtime + 归还 Runtime 的缓存 client（恒等性） */
  _finish(r, serial, { reused = false } = {}, onLog = () => {}) {
    this.serial = serial;
    this.adbPath = this.rt && typeof this.rt.adbPath === 'function' ? this.rt.adbPath() : '';
    this._vmSeen = true;
    this.syncSerial();
    // Runtime 场景下归还 rt.client()：runtime.client() 与 ensure 的返回是同一个实例
    //（缓存/输入通道 dispose 语义都保留）；纯单测（无 rt.client）退回 fake client。
    const client = (this.rt && typeof this.rt.client === 'function') ? this.rt.client() : r.client;
    onLog(t('wsa.connected', { serial }));
    return { ok: true, serial, adbPath: this.adbPath, client, reused, engine: 'wsa' };
  }

  /**
   * 状态机（docs/zapkstart/wsa-backend.md）：
   *   快路径已连（reused）│ unauthorized │ VM 未起 → AUMID 拉起 → 90s 轮询
   *   │ 5855 不通 → 5555 试一次并持久化 │ VM 起了但端点拒绝 → needs:'wsa-adb-toggle'
   */
  async ensure({ onLog = () => {} } = {}) {
    if (this._ensurePromise) return this._ensurePromise;
    const p = this._ensureInner({ onLog });
    this._ensurePromise = p;
    const clear = () => { if (this._ensurePromise === p) this._ensurePromise = null; };
    p.then(clear, clear);
    return p;
  }

  async _ensureInner({ onLog = () => {} } = {}) {
    // 0) 包探测：没装就明说，绝不顺着手感去装任何东西
    const probe = await this.probe();
    if (!probe.found) {
      return { ok: false, error: t('wsa.not_installed'), needs: 'wsa-not-installed' };
    }

    const storeDeps = this.deps.store || store;
    const settings = storeDeps.getSettings();
    let port = Number((settings.engine && settings.engine.wsaPort) || PRIMARY_PORT) || PRIMARY_PORT;
    if (!Number.isInteger(port) || port <= 0 || port > 65535) port = PRIMARY_PORT;
    const serial = `127.0.0.1:${port}`;

    // 1) 快路径：上次会话的注册还在（秒进）
    onLog(t('wsa.connecting', { serial }));
    let r = await this._trySerial(serial, 1);
    if (r.ok) return this._finish(r, serial, { reused: true }, onLog);
    if (r.state === 'unauthorized') {
      return { ok: false, error: t('wsa.unauthorized'), needs: 'wsa-unauthorized' };
    }

    // 2) VM 可能没起：explorer 拉起 WSA，然后按 90 秒预算轮询 connect
    onLog(t('wsa.starting_vm'));
    await this._startVm();
    r = await this._trySerial(serial, CONNECT_POLL_TRIES, onLog);
    if (r.ok) return this._finish(r, serial, { reused: false }, onLog);
    if (r.state === 'unauthorized') {
      return { ok: false, error: t('wsa.unauthorized'), needs: 'wsa-unauthorized' };
    }

    // 3) 端口回退：主端口整个预算都不通 → 5555 试一次；成功就持久化，下次直接命中
    if (port !== FALLBACK_PORT) {
      onLog(t('wsa.port_fallback', { port: FALLBACK_PORT }));
      const fbSerial = `127.0.0.1:${FALLBACK_PORT}`;
      r = await this._trySerial(fbSerial, PORT_FALLBACK_TRIES);
      if (r.ok) {
        try { storeDeps.saveSettings({ engine: { wsaPort: FALLBACK_PORT } }); } catch (_) { /* 设置写不进不影响连接 */ }
        onLog(t('wsa.port_saved', { port: FALLBACK_PORT }));
        return this._finish(r, fbSerial, { reused: false }, onLog);
      }
      if (r.state === 'unauthorized') {
        return { ok: false, error: t('wsa.unauthorized'), needs: 'wsa-unauthorized' };
      }
    }

    // 4) VM 已经拉起（explorer 成功）但 adb 端点始终拒绝连接 —— Developer settings
    //    里的 ADB 开关默认是关的。给一个持久的引导状态，doctor/preflight 依它渲染。
    return { ok: false, error: t('wsa.adb_toggle_needed'), needs: 'wsa-adb-toggle' };
  }

  /**
   * 停止 = 只断开 adb 注册。
   * WSA 的 VM 是用户管理的子系统：emu kill / 控制台端口推算 taskkill 在这里等于
   * 「taskkill 端口 5854 上的任意进程」，绝对禁止（NFR-Safety，见设计文档）。
   */
  async stop() {
    // 端口回退可能连在 5555 上：两个可能的注册都断一次（幂等，没注册就静默）
    const candidates = new Set([this.serial, `127.0.0.1:${PRIMARY_PORT}`, `127.0.0.1:${FALLBACK_PORT}`]);
    for (const serial of candidates) {
      if (!serial || !serial.includes(':')) continue; // eslint-disable-line no-continue
      const client = this._makeClient(serial);
      // eslint-disable-next-line no-await-in-loop
      await client.exec(['disconnect', serial], { withSerial: false, timeout: 8000 }).catch(() => {});
    }
    this._vmSeen = false;
    return { ok: true };
  }

  /**
   * 画面窗口：WSA 自己的 freeform 窗口就是用户看到的应用窗口。
   * 不给候选 HWND、不做就绪门禁 —— 上层的 attach/embed 流程对 wsa 模式整条跳过。
   */
  async windowTargets() { return []; }

  async windowReady() { return { ok: true }; }

  /** 占用统计：磁盘/CPU 都归 WSA 管，我们不掌握数字，如实说明而不是编一个 0 */
  usage() {
    return { total: 0, items: [], managedByWsa: true, note: t('wsa.managed_by_wsa') };
  }

  /** 数据分区信息：/data 在 WSA 的子系统里，同样只说明不编数 */
  dataInfo() {
    return { ok: false, managedByWsa: true, note: t('wsa.managed_by_wsa') };
  }

  /** 释放资源：VM 是用户管理的，什么都不动（连 disconnect 都不做，应用退出≠用户要关 WSA） */
  dispose() { /* no-op by design */ }

  /** 诊断信息（写进问题报告） */
  diagnose() {
    const probe = this._probeCache || null;
    return {
      backend: 'wsa',
      serial: this.serial,
      running: this.running(),
      version: probe ? probe.version : '',
      note: t('wsa.managed_by_wsa'),
    };
  }
}

module.exports = { WsaBackend, WSA_AUMID, PRIMARY_PORT, FALLBACK_PORT };
