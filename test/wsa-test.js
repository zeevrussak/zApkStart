'use strict';
/**
 * WSA / 外接 adb 设备后端测试（docs/zapkstart/wsa-backend.md §Verification）。
 *
 * 全部跑在 x64 开发机上，不依赖真实 WSA：探测夹具走注入、传输走 fake AdbClient。
 * 分阶段与本体的实现顺序对应：
 *   - phase 0：探测解析夹具 + store 精确匹配白名单 + wsaPort 默认值；
 *   - phase 1：状态机（未安装 / vm-stopped→toggle-timeout / offline→device / unauthorized）、
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

  console.log('\n[wsa · phase 1 后端注册表（保守放行）]');

  const backends = require('../src/core/backends');
  const { WsaBackend } = require('../src/core/backends/wsa');

  await test('模式放行矩阵：wsa+探测确认 → WsaBackend；wsa+未确认 → builtin；mumu → builtin', () => {
    const base = { appRoot: TMP, store, log: () => {} };
    const on = backends.create({ ...base, settings: { engine: { mode: 'wsa' } }, wsaAvailable: true });
    assert(on.id === 'wsa' && on.backend instanceof WsaBackend, `wsa+确认 → ${on.id}`);
    const off = backends.create({ ...base, settings: { engine: { mode: 'wsa' } }, wsaAvailable: false });
    assert(off.id === 'builtin' && !(off.backend instanceof WsaBackend), `wsa+未确认 → ${off.id}`);
    const mumu = backends.create({ ...base, settings: { engine: { mode: 'mumu' } } });
    assert(mumu.id === 'builtin', `mumu → ${mumu.id}`);
  });

  await test('autoPick 永远 builtin-only（绝不自动选 WSA）', async () => {
    const picked = await backends.autoPick();
    assert(picked.id === 'builtin', `autoPick → ${picked.id}`);
    assert(picked.reason === 'builtin-only', `reason=${picked.reason}`);
  });

  await test('caps：只有 sharedHost（不嵌入、不旋转、不快照、不部署）', () => {
    const caps = new WsaBackend(TMP, { store }).caps;
    assert(caps.has('sharedHost'), '应包含 sharedHost');
    for (const banned of ['snapshot', 'rotatePanel', 'resizeData', 'provision', 'priority', 'shutdown']) {
      assert(!caps.has(banned), `不该有 ${banned}`);
    }
  });

  // ---- fake 传输构造器 ----

  /**
   * 状态可编排的 fake AdbClient。calls.state 是「adb devices 里这条 serial 的状态」，
   * 测试中途改它即可编排 no-device → offline → device 的翻转；
   * shellOk=false 时 shell 抛错（模拟「传输在但命令不通」= booting/offline）。
   */
  function makeFakeClientFactory(state) {
    const calls = { connect: 0, disconnect: 0, shell: 0, state, shellOk: false };
    const factory = (serial) => ({
      serial,
      adbPath: 'adb',
      async connect() {
        calls.connect += 1;
        return calls.state === 'device' || calls.state === 'offline';
      },
      async isOnline() { return calls.state === 'device' && calls.shellOk; },
      async deviceState() { return calls.state; },
      async shell() {
        calls.shell += 1;
        if (calls.state !== 'device' || !calls.shellOk) throw new Error('closed');
        return '1';
      },
      async exec(args) {
        if (args[0] === 'disconnect') calls.disconnect += 1;
        return { stdout: '', stderr: '' };
      },
    });
    factory.calls = calls;
    return factory;
  }

  function makeBackend(o = {}) {
    return new WsaBackend(TMP, {
      store,
      log: () => {},
      probeFn: o.probeFn || (async () => ({ found: true, version: '2507.40000.4.0' })),
      clientFactory: o.clientFactory || makeFakeClientFactory('no-device'),
      runtime: o.runtime || null,
      // 单测预算：2 次轮询 × 10ms（生产默认是 45 × 2s = 90 秒，见 DEFAULT_BUDGET）
      budget: { tries: 2, intervalMs: 10, fallbackTries: 2 },
    });
  }

  console.log('\n[wsa · phase 1 ensure 状态机（fake 传输）]');

  await test('not-installed：探测说没装 → needs:wsa-not-installed，不碰传输', async () => {
    const be = makeBackend({ probeFn: async () => ({ found: false, version: '' }) });
    const r = await be.ensure({ onLog: () => {} });
    assert(r.ok === false && r.needs === 'wsa-not-installed', JSON.stringify(r));
  });

  await test('快路径：设备已在线（device+命令通）→ ok 且 reused=true', async () => {
    const factory = makeFakeClientFactory('device');
    factory.calls.shellOk = true;
    const be = makeBackend({ clientFactory: factory });
    const r = await be.ensure({ onLog: () => {} });
    assert(r.ok === true && r.reused === true, JSON.stringify(r));
    assert(r.serial === '127.0.0.1:5855', `serial=${r.serial}`);
    assert(r.engine === 'wsa', `engine=${r.engine}`);
  });

  await test('unauthorized：adb 列表里是 unauthorized → needs:wsa-unauthorized', async () => {
    const be = makeBackend({ clientFactory: makeFakeClientFactory('unauthorized') });
    const r = await be.ensure({ onLog: () => {} });
    assert(r.ok === false && r.needs === 'wsa-unauthorized', JSON.stringify(r));
  });

  await test('vm-stopped → toggle 超时：状态始终 no-device → needs:wsa-adb-toggle', async () => {
    // 状态恒为 no-device：AUMID 拉起 + 90 秒轮询预算 + 5555 回退全部走完后，
    // 落到「Developer settings 的 ADB 开关没开」这个持久引导状态。
    const be = makeBackend({ clientFactory: makeFakeClientFactory('no-device') });
    const r = await be.ensure({ onLog: () => {} });
    assert(r.ok === false && r.needs === 'wsa-adb-toggle', JSON.stringify(r));
  });

  await test('offline→device：中途翻成 device → ok', async () => {
    const factory = makeFakeClientFactory('no-device');
    factory.calls.shellOk = true; // device 状态下命令通（真正就绪）
    let queries = 0;
    const be = makeBackend({
      clientFactory: (serial) => {
        const c = factory(serial);
        const orig = c.deviceState.bind(c);
        c.deviceState = async () => {
          queries += 1;
          // 第 1 次查询（快路径）no-device；之后（AUMID 拉起后的轮询）翻成 device
          if (queries > 1) factory.calls.state = 'device';
          return orig();
        };
        return c;
      },
    });
    const r = await be.ensure({ onLog: () => {} });
    assert(r.ok === true, JSON.stringify(r));
    assert(r.serial === '127.0.0.1:5855', `serial=${r.serial}`);
  });

  await test('stop() = 只 adb disconnect：disconnect 被调用、running 归 false', async () => {
    const factory = makeFakeClientFactory('device');
    factory.calls.shellOk = true;
    const be = makeBackend({ clientFactory: factory });
    await be.ensure({ onLog: () => {} });
    assert(be.running() === true, 'ensure 后应 running');
    const r = await be.stop();
    assert(r.ok === true, JSON.stringify(r));
    assert(factory.calls.disconnect >= 1, '应调用 adb disconnect');
    assert(be.running() === false, 'stop 后 running() 应为 false');
  });

  console.log('\n[wsa · phase 1 serial 同步恒等（真实 Runtime）]');

  await test('ensure 后 rt.emuSerial = 127.0.0.1:5855 且 runtime.client() 恒等复用', async () => {
    // 真实 Runtime（纯 Node 可构造，engine-test.js 同款）；传输仍用 fake
    const { Runtime } = require('../src/core/engine');
    const rt = new Runtime(TMP);
    const factory = makeFakeClientFactory('device');
    factory.calls.shellOk = true;
    const made = backends.create({
      appRoot: TMP,
      settings: { engine: { mode: 'wsa' } },
      runtime: rt,
      store,
      log: () => {},
      wsaAvailable: true,
      backendDeps: {
        probeFn: async () => ({ found: true, version: '2507.40000.4.0' }),
        clientFactory: factory,
        budget: { tries: 2, intervalMs: 10, fallbackTries: 2 },
      },
    });
    rt._backend = made.backend;
    rt._backendId = 'wsa';
    const r = await made.backend.ensure({ onLog: () => {} });
    assert(r.ok === true, JSON.stringify(r));
    assert(rt.emuSerial === '127.0.0.1:5855', `rt.emuSerial=${rt.emuSerial}`);
    // runtime.client() 就是这条传输（同一缓存实例）
    const c1 = rt.client();
    const c2 = rt.client();
    assert(c1 === c2, 'runtime.client() 应复用同一缓存实例');
    assert(c1.serial === '127.0.0.1:5855', `client.serial=${c1.serial}`);
    assert(r.client === c1, 'ensure 返回的 client 应是 runtime.client() 的同一实例');
  });

  await test('engine 分发点（源码级）：stop=disconnect-only、ensure 首行路由、看门狗断开', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'core', 'engine.js'), 'utf8');
    // 1) _ensureInner 第一行路由 wsa
    const ensureBody = src.slice(src.indexOf('async _ensureInner'), src.indexOf('beginApp(pkg'));
    assert(/backend\.id === 'wsa'/.test(ensureBody.slice(0, 600)), '_ensureInner 未在开头路由 wsa');
    assert(/backend\.ensure\(\{ onLog \}\)/.test(ensureBody), '_ensureInner 未交给 backend.ensure');
    // 2) stop：wsa 分支只交给 backend.stop()，分支内无 emu kill / taskkill
    const stopBody = src.slice(src.indexOf('async stop({ graceful = true }'), src.indexOf('monitorCmd(cmd'));
    const wsaBranch = stopBody.slice(stopBody.indexOf("backend.id === 'wsa'"), stopBody.indexOf('const adbPath'));
    assert(/backend\.stop\(\)/.test(wsaBranch), 'wsa stop 未交给 backend.stop()');
    assert(!/taskkill|'emu'/.test(wsaBranch), 'wsa stop 分支含 emu kill/taskkill');
    // 3) 看门狗：空闲时 wsa → backend.stop()（disconnect）而非 runtime.stop()
    const watchdog = src.slice(src.indexOf('startWatchdog()'), src.indexOf('get vmRunning'));
    assert(/backend\.id === 'wsa'/.test(watchdog), '看门狗缺少 wsa 分发');
    // 4) adopt / killOrphans 有闸
    assert(/async adoptExisting[\s\S]{0,200}=== 'wsa'/.test(src), 'adoptExisting 缺少 wsa 闸');
    assert(/async killOrphanEmulators[\s\S]{0,200}=== 'wsa'/.test(src), 'killOrphanEmulators 缺少 wsa 闸');
    // 5) kill-server 闸：emulator 侧有谓词，engine 侧自愈走 guarded helper
    const emuSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'core', 'emulator.js'), 'utf8');
    assert(/adbServerResetGuard/.test(emuSrc), 'emulator 缺少 adb server 重建闸');
    assert(/_resetAdbServerGuarded/.test(src), 'engine 自愈未走 guarded helper');
  });

  console.log('\n[wsa · phase 2 每应用路由 routeForApp 四组合]');

  const { routeForApp } = require('../src/core/installer');

  await test('routeForApp 真值表：同底座放行，异底座 mismatch', () => {
    const mk = (backend) => (backend ? { backend } : {});
    assert(routeForApp(mk('builtin'), { engine: { mode: 'builtin' } }) === 'run-builtin', 'builtin+builtin');
    assert(routeForApp(mk('wsa'), { engine: { mode: 'wsa' } }) === 'run-wsa', 'wsa+wsa');
    assert(routeForApp(mk('builtin'), { engine: { mode: 'wsa' } }) === 'mismatch:builtin', 'builtin app on wsa mode');
    assert(routeForApp(mk('wsa'), { engine: { mode: 'builtin' } }) === 'mismatch:wsa', 'wsa app on builtin mode');
    // 老记录（无 backend 字段 / app 为 null）按 builtin 读，零迁移
    assert(routeForApp({}, { engine: { mode: 'builtin' } }) === 'run-builtin', '缺省 app.backend=builtin');
    assert(routeForApp({}, { engine: { mode: 'wsa' } }) === 'mismatch:builtin', '无字段记录在 wsa 模式 = mismatch');
    assert(routeForApp(null, { engine: { mode: 'builtin' } }) === 'run-builtin', 'app=null 按 builtin');
    // 乱写的 backend 值：既不等于模式时如实报 mismatch（不静默兜底重装）
    assert(routeForApp(mk('mumu'), { engine: { mode: 'builtin' } }) === 'mismatch:mumu', '未知 backend 报 mismatch');
  });

  await test('app 记录的 backend 字段：源码级（finishInstall 按 rt.engine 写入）', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'core', 'installer.js'), 'utf8');
    assert(/backend:\s*rt\.engine === 'wsa' \? 'wsa' : undefined/.test(src), 'finishInstall 未写 backend 字段');
    assert(/routeForApp/.test(src), 'routeForApp 不在 installer.js（单测入口丢失）');
  });

  await test('main.js 启动路径：路由在任何 ensure 之前（源码级）', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'main.js'), 'utf8');
    // launchOne（含路由前置段）与 launchOneWsa 相邻，一起取到下一个顶层函数
    const one = src.slice(src.indexOf('async function launchOne(pkg)'), src.indexOf('function onContainerActive'));
    const routeAt = one.indexOf('routeForApp(store.getApp(pkg)');
    const ensureAt = one.indexOf('installer.launch(pkg');
    assert(routeAt > -1, 'launchOne 没有按 routeForApp 路由');
    assert(ensureAt === -1 || routeAt < ensureAt, '路由必须发生在 installer.launch（内含 ensure）之前');
    // mismatch 短路：不许出现静默重装（v1 只提示）
    const mismatchBranch = one.slice(one.indexOf('startsWith(\'mismatch:\')'));
    assert(/route_mismatch_builtin_on_wsa|route_mismatch_wsa_on_builtin/.test(mismatchBranch), 'mismatch 缺少提示文案');
    // WSA 路由走无窗口管线
    assert(/launchOneWsa\(pkg\)/.test(one), 'run-wsa 未交给 launchOneWsa');
    // autoDeploy / 预热在 wsa 模式跳过
    assert(/mode\) === 'wsa'/.test(src), 'autoDeploy 缺少 wsa 跳过闸');
    assert(/engine\.mode !== 'wsa'/.test(src), '启动预热缺少 wsa 跳过闸');
  });

  console.log('\n[wsa · phase 2 共享目录按 serial 作用域]');

  await test('sharer：状态键带 serial 前缀，旧无前缀键第一次同步被丢弃（源码级）', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'core', 'sharer.js'), 'utf8');
    assert(/scopeKey = \(rel\) => `\$\{client\.serial\}:\$\{rel\}`/.test(src), '缺少 serial 前缀键');
    assert(!/state\[f\.rel\]/.test(src) && !/state\[r\.rel\]/.test(src), '还有不带前缀的状态读写');
    assert(/!String\(k\)\.includes\(':'\)/.test(src), '缺少旧键的一次性丢弃');
  });

  console.log('\n[wsa · phase 3 ABI 方向反转 abiDirectionFor]');

  const { abiDirectionFor, Installer } = require('../src/core/installer');

  const ARM_META = { package: 'com.arm.app', label: 'ArmApp', versionCode: 1, abis: ['arm64-v8a'] };
  const X86_META = { package: 'com.x86.app', label: 'X86App', versionCode: 3, abis: ['x86_64', 'x86'] };
  const UNIVERSAL_META = { package: 'com.java.app', label: 'JavaApp', versionCode: 1, abis: [] };

  await test('abiDirectionFor 真值表：wsa 永不 compat；builtin 阶梯原样', () => {
    // wsa：ARM 应用原生装（abilist 已知或未知都一样 —— WSA 本命就是 ARM 设备）
    assert(abiDirectionFor('wsa', ARM_META, 'arm64-v8a,armeabi-v7a') === 'native');
    assert(abiDirectionFor('wsa', ARM_META, null) === 'native');
    // wsa：x86-only 在 ARM 设备（含 abilist 未知）→ fail:x86-only
    assert(abiDirectionFor('wsa', X86_META, 'arm64-v8a') === 'fail:x86-only');
    assert(abiDirectionFor('wsa', X86_META, null) === 'fail:x86-only');
    // 罕见的带 x86 转译构建 → 原生装
    assert(abiDirectionFor('wsa', X86_META, 'x86_64,arm64-v8a') === 'native');
    // 纯字节码应用没有 ABI 需求
    assert(abiDirectionFor('wsa', UNIVERSAL_META, 'arm64-v8a') === 'native');
    assert(abiDirectionFor('wsa', UNIVERSAL_META, null) === 'native');
    // 形状保证：wsa 上永远不出现 compat（兼容镜像机制禁用）
    for (const [m, a] of [[ARM_META, null], [ARM_META, 'x86_64'], [X86_META, 'arm64-v8a'], [UNIVERSAL_META, null]]) {
      assert(abiDirectionFor('wsa', m, a) !== 'compat', 'wsa 不得返回 compat');
    }
    // builtin：现有阶梯原样（探测不到不切；确认无翻译层的 ARM-only 才切）
    assert(abiDirectionFor('builtin', ARM_META, null) === 'native', '探测不到不切（交给重试兜底）');
    assert(abiDirectionFor('builtin', ARM_META, 'x86_64') === 'compat', '无翻译层的 ARM-only 应切');
    assert(abiDirectionFor('builtin', ARM_META, 'arm64-v8a') === 'native');
    assert(abiDirectionFor('builtin', X86_META, 'x86_64') === 'native');
  });

  await test('WSA 上 ensureCompatImage / switchToCompat 永不触发（spy）', async () => {
    // 关掉快捷方式自动创建（单测环境不写 .lnk）
    writeSettings({});
    store.saveSettings({ createShortcutOnInstall: false });
    let compatImage = 0;
    let switchCompat = 0;
    const fakeClient = {
      async shell() { return 'arm64-v8a'; },
      async install() { const e = new Error('INSTALL_FAILED_NO_MATCHING_ABIS'); e.code = 'NO_MATCHING_ABIS'; throw e; },
      batteryOptimizeOff() { /* no-op */ },
      clearLauncherCache() { /* no-op */ },
      async resolveLauncher() { return null; },
    };
    const fakeRuntime = {
      backendId: 'wsa',
      touch() { /* no-op */ },
      provisioner: { playImageInfo() { return { ok: false }; } },
    };
    const inst = new Installer(fakeRuntime, { desktopDir: TMP });
    inst.ensureCompatImage = async () => { compatImage += 1; return true; };
    inst.switchToCompat = async () => { switchCompat += 1; return { ok: true, client: fakeClient, engine: 'wsa' }; };
    let threw = null;
    try {
      await inst.finishInstall({ engine: 'wsa', client: fakeClient }, X86_META, 'fake.apk', null, () => {});
    } catch (e) { threw = e; }
    assert(threw && threw.code === 'WSA_X86_ONLY', `应抛 WSA_X86_ONLY，实际 ${threw && threw.code}: ${threw && threw.message}`);
    assert(compatImage === 0 && switchCompat === 0, 'WSA 上绝不能切镜像');
  });

  await test('installer 启动路径：wsa 跳过显示手术、快照与镜像切换（源码级）', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'core', 'installer.js'), 'utf8');
    assert(/if \(beforeStart && rt\.engine !== 'wsa'\)/.test(src), 'beforeStart 未被 wsa 跳过');
    assert(/if \(rt\.engine !== 'wsa'\) \{\s*await rt\.client\.resetDisplayOverrides/.test(src), 'resetDisplayOverrides 未被 wsa 跳过');
    assert(/started && rt\.engine !== 'wsa'/.test(src), 'setOrientation 未被 wsa 跳过');
    assert(/if \(rt\.engine !== 'wsa'\) \{\s*try \{ this\.runtime\.emulator\?\.invalidateSnapshot/.test(src), '快照作废未被 wsa 跳过');
    assert(/this\.runtime\.backendId === 'wsa'/.test(src), 'NO_MATCHING_ABIS 重试缺 wsa 禁用闸');
    assert(/abiDirectionFor\(rt\.engine, meta/.test(src), '预切未按 abiDirectionFor 判定');
    assert(/launch_anti_emulator_wsa/.test(src), '缺 WSA 版反模拟文案（崩溃分类按底座换口径）');
  });

  console.log('\n[wsa · phase 3 doctor / preflight 卡片]');

  const doctor = require('../src/core/doctor');
  const preflight = require('../src/core/preflight');

  await test('doctor：wsa 分支不给 accel/AVD/快照建议；给出 GMS caveat + x64 AEHD 说明', () => {
    const d = doctor.diagnose(['x86_64 emulation currently requires hardware acceleration'], { backend: 'wsa' });
    assert(d.code !== 'ACCEL', `wsa 分支不应报 ACCEL（实际 ${d.code}）`);
    const d2 = doctor.diagnose(['Running multiple emulators with the same AVD'], { backend: 'wsa' });
    assert(d2.code !== 'AVD_LOCK', `wsa 分支不应报 AVD_LOCK（实际 ${d2.code}）`);
    const d3 = doctor.diagnose(['snapshot load failed'], { backend: 'wsa' });
    assert(d3.code !== 'SNAPSHOT', `wsa 分支不应报 SNAPSHOT（实际 ${d3.code}）`);
    const d4 = doctor.diagnose([], { backend: 'wsa' });
    assert(d4.code === 'WSA', `空日志应给 WSA 结论（实际 ${d4.code}）`);
    assert(/Google/.test(d4.hint), 'WSA 结论缺 GMS caveat');
    assert(/AEHD/.test(d4.hint), 'x64 上 WSA 结论应附 AEHD↔Hyper-V 说明');
    // builtin 默认行为不变
    const d5 = doctor.diagnose(['x86_64 emulation currently requires hardware acceleration'], {});
    assert(d5.code === 'ACCEL', 'builtin 诊断路径不应受 wsa 分支影响');
  });

  await test('preflight：ARM64+found → 推荐卡；absent → 引导卡；x64 → 信息卡+AEHD 说明', () => {
    arch._setHostArchForTest('arm64');
    const hw = {
      machineArch: 'arm64', cpu: {}, memory: {}, gpu: {},
      virtualization: { hypervisorPlatform: 'enabled', winHvApi: true, hypervisorPresent: true },
      osBuild: 22631,
    };
    const on = preflight.evaluate({ hw, settings: {}, edition: 'installer', wsa: 'available' });
    const card = on.items.find((i) => i.key === 'wsa-found');
    assert(card && card.level === 'ok', 'ARM64+found 缺少 wsa-found 卡');
    assert(card.action && card.action.kind === 'link', 'found 卡应带显式点击的链接动作');
    assert(preflight.WSA_BUILDS_URL === 'https://github.com/MustardChef/WSABuilds', '链接 URL 固定为社区续作');
    const off = preflight.evaluate({ hw, settings: {}, edition: 'installer', wsa: 'absent' });
    assert(off.items.some((i) => i.key === 'wsa-absent'), 'ARM64+absent 缺少引导卡');
    // x64：found → 信息卡 + AEHD 说明；absent → 不出卡
    const hw64 = { ...hw, machineArch: 'x64' };
    const fx = preflight.evaluate({ hw: hw64, settings: {}, edition: 'installer', wsa: 'available' });
    assert(fx.items.some((i) => i.key === 'wsa-found-x64'), 'x64+found 缺少信息卡');
    const ax = preflight.evaluate({ hw: hw64, settings: {}, edition: 'installer', wsa: 'absent' });
    assert(!ax.items.some((i) => String(i.key).startsWith('wsa-')), 'x64+absent 不应出 WSA 卡');
    arch._setHostArchForTest('x64');
  });

  await test('tier 不变量（重申）：preflight 卡片与 WSA 探测都不改 runtimePlan 的 tier', () => {
    arch._setWsaProbeForTest({ at: Date.now(), found: true, version: '9.9.9' });
    assert(arch.runtimePlan('arm64').tier === 'shell-native', 'arm64 tier 被改动了');
    assert(arch.runtimePlan('arm64').engineDefault === 'gate', 'arm64 engineDefault 被改动了');
    assert(arch.runtimePlan('x64').tier === 'supported', 'x64 tier 被改动了');
    arch._setWsaProbeForTest(null);
  });

  console.log('\n[wsa · phase 3 设置页引擎分段控件（源码级）]');

  await test('setEngineBackend 控件：存在、渲染条件、命名禁令', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'index.html'), 'utf8');
    assert(/id="setEngineBackend"/.test(html), '缺少 setEngineBackend 控件');
    assert(!/setEngineMode/.test(html), 'setEngineMode 这个名字被 standalone-test 禁止');
    assert(/id="engineBackendRow" hidden/.test(html), '控件默认应隐藏（探测命中才显示）');
    const appjs = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui', 'app.js'), 'utf8');
    assert(/wsaDetect\(\)/.test(appjs), '渲染层未接 wsaDetect');
    assert(/refreshEngineBackend/.test(appjs), '缺少渲染条件逻辑');
    const mainjs = fs.readFileSync(path.join(__dirname, '..', 'src', 'main.js'), 'utf8');
    assert(/wsa:detect/.test(mainjs) && /wsa:openGuide/.test(mainjs), '主进程缺 wsa:detect / wsa:openGuide');
    assert(/resetBackend\(\)/.test(mainjs), '引擎模式切换后未 resetBackend');
  });

  console.log(`\n结果：${passed} 通过，${failed} 失败\n`);
  process.exit(failed ? 1 : 0);
})();
