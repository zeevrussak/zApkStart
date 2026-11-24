'use strict';
/**
 * WSA / 外接 adb 设备后端测试（docs/zapkstart/wsa-backend.md §Verification）。
 *
 * 全部跑在 x64 开发机上，不依赖真实 WSA：探测夹具走注入、传输走 fake AdbClient。
 * 分阶段与本体的实现顺序对应：
 *   - phase 0：探测解析夹具 + store 精确匹配白名单 + wsaPort 默认值；
 *   - phase 1：状态机（未安装 / VM 未起→开关超时 / offline→device / unauthorized）、
 *              serial 同步恒等、模式放行矩阵；
 *   - phase 2：routeForApp 四组合；
 *   - phase 3：abiDirectionFor 真值表 + 兼容镜像禁用；doctor/preflight 卡片；tier 不变。
 *
 * 运行：node test/wsa-test.js
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

// 隔离测试数据目录，避免污染真实用户配置（engine-test.js 同款约定）
const TMP = path.join(os.tmpdir(), `apkstart-wsa-test-${Date.now()}`);
process.env.APPDATA = TMP;
fs.mkdirSync(path.join(TMP, 'zapkstart'), { recursive: true });
// 文案断言钉住中文（i18n 默认 auto 会跟随本机语言）
require('../src/core/i18n').setActiveT('zh-CN', '');

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
const store = require('../src/core/store');

(async () => {
  console.log('\n[wsa · phase 0 探测解析]');

  await test('装了 WSA：带版本号的输出解析为 found+version', () => {
    const r = arch.parseWsaPackageOutput('2507.40000.4.0\r\n');
    assert(r.found === true, `found=${r.found}`);
    assert(r.version === '2507.40000.4.0', `version=${r.version}`);
  });

  await test('没装 WSA：空输出解析为 not found', () => {
    const r = arch.parseWsaPackageOutput('   \r\n');
    assert(r.found === false, `found=${r.found}`);
    assert(r.version === '', `version=${r.version}`);
  });

  await test('探测失败：null（无输出）解析为 not found 且不抛异常', () => {
    const r = arch.parseWsaPackageOutput(null);
    assert(r.found === false, `found=${r.found}`);
    assert(r.version === '', `version=${r.version}`);
  });

  await test('detectWsa 缓存：_setWsaProbeForTest 注入后命中缓存', async () => {
    arch._setWsaProbeForTest({ at: Date.now(), found: true, version: '1.2.3.4' });
    const r = await arch.detectWsa();
    assert(r.found === true && r.version === '1.2.3.4', JSON.stringify(r));
    assert(r.cached === true, '应为缓存命中');
  });

  await test('runtimePlan.wsaEngine：纯读缓存（available / absent / unknown）', () => {
    arch._setWsaProbeForTest({ at: Date.now(), found: true, version: '1.2.3.4' });
    assert(arch.runtimePlan('arm64').wsaEngine === 'available');
    assert(arch.runtimePlan('x64').wsaEngine === 'available');
    arch._setWsaProbeForTest({ at: Date.now(), found: false, version: '' });
    assert(arch.runtimePlan('arm64').wsaEngine === 'absent');
    arch._setWsaProbeForTest(null);
    assert(arch.runtimePlan('x64').wsaEngine === 'unknown');
  });

  await test('tier / engineDefault 不受 WSA 探测影响（QEMU 门不能重新打开）', () => {
    arch._setWsaProbeForTest({ at: Date.now(), found: true, version: '1.2.3.4' });
    const arm = arch.runtimePlan('arm64');
    assert(arm.tier === 'shell-native', `tier=${arm.tier}`);
    assert(arm.engineDefault === 'gate', `engineDefault=${arm.engineDefault}`);
    const on = arch.runtimePlan('arm64', { runtime: { allowEmulatedEngine: true } });
    assert(on.engineDefault === 'google-emulator' && on.tier === 'shell-native');
    const x = arch.runtimePlan('x64');
    assert(x.tier === 'supported' && x.engineDefault === 'google-emulator');
    arch._setWsaProbeForTest(null);
  });

  console.log('\n[wsa · phase 0 store 精确匹配白名单]');

  const SETTINGS_FILE = path.join(store.DATA_DIR, 'settings.json');

  function writeSettings(engine) {
    fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ engine }), 'utf8');
  }

  await test('coercion 矩阵：wsa 存活，mumu / ldplayer / attach / 乱填 / 缺失 → builtin', () => {
    const cases = [
      ['wsa', 'wsa'],
      ['builtin', 'builtin'],
      ['mumu', 'builtin'],
      ['ldplayer', 'builtin'],
      ['attach', 'builtin'],
      ['fydeos', 'builtin'],
      ['WSA', 'builtin'],
      [' whatever ', 'builtin'],
      ['', 'builtin'],
    ];
    for (const [input, want] of cases) {
      writeSettings({ mode: input });
      const s = store.getSettings();
      assert(s.engine.mode === want, `mode=${JSON.stringify(input)} 期望 ${want}，实际 ${s.engine.mode}`);
    }
    // 缺失：deepMerge 后是默认 builtin
    writeSettings({});
    assert(store.getSettings().engine.mode === 'builtin', '缺失 mode 应回落到默认 builtin');
  });

  await test('engine.wsaPort 默认 5855；显式写的端口保留', () => {
    writeSettings({ mode: 'wsa' });
    assert(store.getSettings().engine.wsaPort === 5855, `默认 wsaPort=${store.getSettings().engine.wsaPort}`);
    writeSettings({ mode: 'wsa', wsaPort: 5555 });
    assert(store.getSettings().engine.wsaPort === 5555, '显式端口应保留');
    assert(store.DEFAULT_WSA_PORT === 5855, 'DEFAULT_WSA_PORT 应为 5855');
  });

  await test('白名单外的 mode 不会留下第三方字段', () => {
    writeSettings({ mode: 'mumu', mumuPath: 'C:\\mumu', mumuIndex: 1 });
    const s = store.getSettings();
    assert(s.engine.mode === 'builtin', `mode=${s.engine.mode}`);
    assert(s.engine.mumuPath === undefined, 'mumuPath 应被清掉');
    assert(s.engine.mumuIndex === undefined, 'mumuIndex 应被清掉');
  });

  // 清理：恢复默认设置文件，避免影响后续 phase 的 store 断言
  try { fs.rmSync(SETTINGS_FILE, { force: true }); } catch (_) { /* ignore */ }

  console.log(`\n结果：${passed} 通过，${failed} 失败\n`);
  process.exit(failed ? 1 : 0);
})();
