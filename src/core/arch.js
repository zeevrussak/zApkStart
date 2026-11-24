'use strict';
/**
 * 主机架构真相 + 按架构的运行时计划。
 *
 * 为什么不能只用 process.arch：Windows 11 ARM64 上，x64 进程（包括被模拟运行的
 * x64 Electron）里 process.arch 返回的是**二进制的架构**（'x64'），不是机器的。
 * 上游所有 arch 判断（doctor/drivers/preflight）因此会在 ARM64 机器上自我报告为
 * x64，然后走进一条注定的失败路径（x64 引擎 + 软件模拟 + 错误的修复建议）。
 *
 * 这里的 hostArch() 用 PowerShell 查 Win32_Processor.Architecture（preflight 本来
 * 就会拉起 PowerShell，成本可接受；结果按进程缓存）。Architecture 字段：
 *   9 = x64, 12 = ARM64, 5 = arm, 6 = ia64, 0 = x86。
 *
 * runtimePlan() 是「这台机器上，运行时该怎么跑」的**唯一**权威：
 *   - x64   宿主：上游体验不变（Google 引擎 + AEHD/WHPX 硬件加速，可回退软渲染）。
 *   - arm64 宿主：壳层是原生的，但 Google 不发布 Windows-ARM64 模拟器（已核验
 *           dl.google.com 索引），x64 引擎在 Windows 模拟下退化为纯软件模拟
 *           （TCG inside Prism），对真实应用不可用。所以 arm64 默认给出能力门，
 *           只有用户显式 opt-in（runtime.allowEmulatedEngine）才尝试一次，
 *           且不跑重试阶梯、不给做不到的修复建议。
 *   - 真正原生的 ARM64 引擎是研究课题，见 docs/zapkstart/arm64-research.md；
 *     gates 全部通过之前不在产品里出现。
 *
 * detectWsa() 是 WSA 底座（docs/zapkstart/wsa-backend.md）的探测入口：
 * 用 PowerShell 查 Appx 包 MicrosoftCorporationII.WindowsSubsystemForAndroid。
 * 只探测、不下载、不安装 —— ZapkStart 永远不碰微软的 WSA 二进制，只通过 adb
 * 驱动一个已经装好的子系统。结果按进程缓存（60 秒 TTL），测试可用
 * _setWsaProbeForTest 注入，与 _setHostArchForTest 同一套约定。
 */
const { execFile } = require('child_process');
const path = require('path');

const POWERSHELL = path.join(process.env.SystemRoot || 'C:\\Windows',
  'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');

const KNOWN_ARCH = new Set(['x64', 'arm64', 'ia32', 'arm']);

let _hostArchCache = null;   // 'x64' | 'arm64' | null（拿不到就回落 binary arch）
// WSA 探测缓存：null = 从未探测过；{ at, found, version, error } = 最近一次结果。
// 60 秒 TTL 由 detectWsa() 消费；wsaEngineNow() 只同步读缓存（绝不在这里拉 PowerShell）。
let _wsaProbe = null;

const WSA_PACKAGE = 'MicrosoftCorporationII.WindowsSubsystemForAndroid';

function normalizeWinArch(code) {
  const n = Number(code);
  if (n === 12 || n === 6) return 'arm64';     // 12 = ARM64；6 = ia64（当 arm64 处理只会更保守）
  if (n === 9 || n === 0) return 'x64';
  if (n === 5) return 'arm64';
  return '';
}

/**
 * 询问系统真实 CPU 架构。失败返回 ''（调用方回落 process.arch）。
 * 纯函数式封装便于测试注入（arch-probe 可被 mock）。
 */
function queryWindowsCpuArch() {
  return new Promise((resolve) => {
    if (process.platform !== 'win32') { resolve(''); return; }
    const ps = POWERSHELL;
    const args = [
      '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
      '-Command', '(Get-CimInstance Win32_Processor | Select-Object -First 1).Architecture',
    ];
    execFile(ps, args, { timeout: 8000, windowsHide: true }, (err, stdout) => {
      if (err) { resolve(''); return; }
      resolve(normalizeWinArch(String(stdout || '').trim()));
    });
  });
}

/**
 * 机器的真实架构（已缓存）。探测失败时回落到 process.arch（x64 宿主上两者一致；
 * ARM64 宿主上回落值是保守错误，但探测失败本身说明 PowerShell 不可用，
 * 此时任何引擎都跑不起来，保守处理是对的）。
 * @returns {Promise<'x64'|'arm64'>}
 */
async function hostArch() {
  if (_hostArchCache && KNOWN_ARCH.has(_hostArchCache)) return _hostArchCache;
  const probed = await queryWindowsCpuArch();
  _hostArchCache = probed || (process.arch === 'arm64' ? 'arm64' : 'x64');
  return _hostArchCache;
}

/** 测试注入：覆盖缓存 */
function _setHostArchForTest(v) { _hostArchCache = v; }

/**
 * 解析 Get-AppxPackage 的输出 → { found, version }。
 * 纯函数，供单测喂三种夹具：装了（带版本号）/ 没装（空输出）/ 探测失败（null）。
 */
function parseWsaPackageOutput(text) {
  const version = String(text == null ? '' : text).trim();
  return { found: !!version, version };
}

/**
 * 探测 WSA Appx 包。失败/超时一律返回 { found:false }，绝不抛异常 ——
 * 「探测不到」只是「absent」，不能因为探测失败把用户引去装 WSA。
 */
function queryWsaPackage() {
  return new Promise((resolve) => {
    if (process.platform !== 'win32') { resolve({ found: false, version: '', error: 'not-windows' }); return; }
    const args = [
      '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass',
      '-Command', `Get-AppxPackage -Name '${WSA_PACKAGE}' | Select-Object -First 1 -ExpandProperty Version`,
    ];
    execFile(POWERSHELL, args, { timeout: 10000, windowsHide: true }, (err, stdout) => {
      if (err) {
        resolve({ found: false, version: '', error: (err && err.message) || 'probe-failed' });
        return;
      }
      resolve(parseWsaPackageOutput(stdout));
    });
  });
}

/**
 * WSA 是否已安装（带 60 秒 TTL 缓存）。
 * @param {{maxAgeMs?:number}} [o]
 * @returns {Promise<{found:boolean, version:string, at:number, cached?:boolean, error?:string}>}
 */
async function detectWsa({ maxAgeMs = 60000 } = {}) {
  if (_wsaProbe && Date.now() - _wsaProbe.at < maxAgeMs) return { ..._wsaProbe, cached: true };
  const r = await queryWsaPackage();
  _wsaProbe = { at: Date.now(), found: !!r.found, version: r.version || '', error: r.error || '' };
  return { ..._wsaProbe };
}

/** 测试注入：覆盖 WSA 探测缓存（传 null = 回到「从未探测」状态） */
function _setWsaProbeForTest(v) { _wsaProbe = v; }

/**
 * 同步读 WSA 探测缓存的结论：'available' | 'absent' | 'unknown'。
 * runtimePlan() 用它填 wsaEngine 字段 —— 不探测（纯读缓存），
 * 所以 runtimePlan 仍然是零副作用的纯函数；真正的探测由 detectWsa() 做。
 */
function wsaEngineNow() {
  if (!_wsaProbe) return 'unknown';
  return _wsaProbe.found ? 'available' : 'absent';
}

/**
 * 这台机器的运行时计划。settings 可省（测试用）。
 * @param {{allowEmulatedEngine?:boolean}} [settings]
 * @returns {{
 *   hostArch:'x64'|'arm64',
 *   tier:'supported'|'shell-native',
 *   imageAbi:string,           // guest 系统镜像 ABI
 *   qemuExeName:string,        // 引擎可执行文件名（x64 引擎在两种宿主上都叫这个）
 *   accel:string[],            // 加速尝试顺序
 *   assetSuffix:string,        // 更新资产架构后缀判定用
 *   engineDefault:'google-emulator'|'gate',
 *   nativeEngine:'available'|'research',
 *   wsaEngine:'available'|'absent'|'unknown',  // WSA Appx 包的缓存探测结论（纯读，不探测）
 * }}
 */
function runtimePlan(host, settings) {
  const arch = host || 'x64';
  // wsaEngine 只描述「WSA 装没装」这个事实，绝不影响 tier / engineDefault ——
  // tier 一动就会重新打开 QEMU 的 ARM64 能力门（见 docs/zapkstart/wsa-backend.md）。
  const wsaEngine = wsaEngineNow();
  if (arch === 'arm64') {
    const optIn = !!(settings && settings.runtime && settings.runtime.allowEmulatedEngine);
    return {
      hostArch: 'arm64',
      tier: 'shell-native',
      imageAbi: 'x86_64',                    // 唯一可跑的引擎是 x64 的（Windows 模拟下）
      qemuExeName: 'qemu-system-x86_64.exe', // 同上：不要在这里「帮忙」换 aarch64
      accel: ['software'],                   // WHPX/AEHD 都不可能加速 x64 guest
      assetSuffix: 'x64',                    // 引擎资产仍是 x64 的
      engineDefault: optIn ? 'google-emulator' : 'gate',
      nativeEngine: 'research',
      wsaEngine,
    };
  }
  return {
    hostArch: 'x64',
    tier: 'supported',
    imageAbi: 'x86_64',
    qemuExeName: 'qemu-system-x86_64.exe',
    accel: ['aehd', 'whpx', 'software'],
    assetSuffix: 'x64',
    engineDefault: 'google-emulator',
    nativeEngine: 'available',
    wsaEngine,
  };
}

/** 便捷版：hostArch + runtimePlan 一次拿全 */
async function plan(settings) {
  const h = await hostArch();
  return runtimePlan(h, settings);
}

/** ARM64 宿主上是否允许尝试 x64 引擎（显式 opt-in 才 true） */
function emulatedEngineAllowed(settings) {
  const p = runtimePlan('arm64', settings);
  return p.engineDefault === 'google-emulator';
}

/** 引擎在这台机器上是否受支持（arm64 且未 opt-in = false，UI据此给能力门） */
async function engineSupported(settings) {
  const p = await plan(settings);
  return p.tier === 'supported' || p.engineDefault === 'google-emulator';
}

module.exports = {
  hostArch, runtimePlan, plan, emulatedEngineAllowed, engineSupported,
  queryWindowsCpuArch, _setHostArchForTest,
  detectWsa, parseWsaPackageOutput, wsaEngineNow, _setWsaProbeForTest, WSA_PACKAGE,
};
