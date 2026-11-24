'use strict';
/**
 * arch.js 契约：runtimePlan 的两种宿主形态、ARM64 opt-in 门、原生探测映射。
 * 纯 Node，不真的拉 PowerShell（queryWindowsCpuArch 的进程面不在单测范围）。
 */
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.error(`  ✗ ${name}\n    ${e.message}`);
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || '断言失败'); }

const arch = require('../src/core/arch');

(async () => {
  console.log('\n[arch.js]');

  await test('x64 宿主：supported 全能力（与上游一致的加速顺序）', async () => {
    const p = arch.runtimePlan('x64');
    assert(p.tier === 'supported');
    assert(p.engineDefault === 'google-emulator');
    assert(p.imageAbi === 'x86_64');
    assert(p.qemuExeName === 'qemu-system-x86_64.exe');
    assert(Array.isArray(p.accel) && p.accel.includes('aehd') && p.accel.includes('whpx'));
    assert(p.nativeEngine === 'available');
  });

  await test('arm64 宿主：默认是能力门（不自动装任何运行时）', async () => {
    const p = arch.runtimePlan('arm64', {});
    assert(p.tier === 'shell-native');
    assert(p.engineDefault === 'gate');
    assert(p.accel.length === 1 && p.accel[0] === 'software', 'ARM64 只有软渲染，没有 WHPX/AEHD');
    // 关键：镜像 ABI 与 qemu 可执行名仍然是 x64/x86_64 —— x64 引擎在 Windows 模拟下运行。
    // 千万不要「顺手」改成 arm64-v8a / qemu-system-aarch64（Google 镜像需要 ranchu 设备模型）。
    assert(p.imageAbi === 'x86_64');
    assert(p.qemuExeName === 'qemu-system-x86_64.exe');
    assert(p.nativeEngine === 'research');
  });

  await test('arm64 + 显式 opt-in：engineDefault 放行为 google-emulator', async () => {
    const on = arch.runtimePlan('arm64', { runtime: { allowEmulatedEngine: true } });
    assert(on.engineDefault === 'google-emulator');
    assert(arch.emulatedEngineAllowed({ runtime: { allowEmulatedEngine: true } }) === true);
    assert(arch.emulatedEngineAllowed({}) === false);
    assert(arch.emulatedEngineAllowed(undefined) === false);
  });

  await test('engineSupported：x64 恒真；arm64 仅在 opt-in 后为真', async () => {
    arch._setHostArchForTest('x64');
    assert(await arch.engineSupported({}) === true, 'x64 应 supported');
    arch._setHostArchForTest('arm64');
    assert(await arch.engineSupported({}) === false, 'arm64 未 opt-in 应 false');
    assert(await arch.engineSupported({ runtime: { allowEmulatedEngine: true } }) === true, 'opt-in 后应 true');
  });

  await test('hostArch 缓存注入生效（探测路径本身不在单测覆盖内）', async () => {
    arch._setHostArchForTest('arm64');
    assert(await arch.hostArch() === 'arm64');
    arch._setHostArchForTest('x64');
    assert(await arch.hostArch() === 'x64');
  });

  await test('Win32_Processor.Architecture 归一化映射覆盖 9（x64）与 12（ARM64）', async () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'core', 'arch.js'), 'utf8');
    assert(/=== 12/.test(src) && /=== 9/.test(src), '归一化映射应覆盖 9 与 12');
  });

  await test('runtimePlan.wsaEngine：只读探测缓存，绝不影响 tier / engineDefault', async () => {
    // 从未探测 → unknown
    arch._setWsaProbeForTest(null);
    assert(arch.runtimePlan('x64').wsaEngine === 'unknown');
    assert(arch.runtimePlan('arm64').wsaEngine === 'unknown');
    // 探测到已装 → available（两种宿主都只是「事实」字段）
    arch._setWsaProbeForTest({ at: Date.now(), found: true, version: '2507.40000.4.0' });
    assert(arch.runtimePlan('arm64').wsaEngine === 'available');
    assert(arch.runtimePlan('x64').wsaEngine === 'available');
    // 关键红线：WSA 装了也不能重新打开 QEMU 的 ARM64 能力门
    const arm = arch.runtimePlan('arm64');
    assert(arm.tier === 'shell-native' && arm.engineDefault === 'gate', 'tier/engineDefault 被 WSA 改动了');
    assert(arm.imageAbi === 'x86_64' && arm.qemuExeName === 'qemu-system-x86_64.exe', '镜像 ABI / 引擎名被改动了');
    // 探测到未装 → absent
    arch._setWsaProbeForTest({ at: Date.now(), found: false, version: '' });
    assert(arch.runtimePlan('arm64').wsaEngine === 'absent');
    arch._setWsaProbeForTest(null);
  });

  await test('parseWsaPackageOutput：Get-AppxPackage 输出的三种夹具', async () => {
    const hit = arch.parseWsaPackageOutput('2507.40000.4.0\r\n');
    assert(hit.found === true && hit.version === '2507.40000.4.0', '带版本输出应解析为 found');
    const miss = arch.parseWsaPackageOutput('  \r\n');
    assert(miss.found === false && miss.version === '', '空输出 = 没装');
    const err = arch.parseWsaPackageOutput(null);
    assert(err.found === false, 'null（探测失败）也不该 found');
  });

  console.log(`\n结果：${passed} 通过，${failed} 失败\n`);
  process.exit(failed ? 1 : 0);
})();
