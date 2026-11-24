'use strict';
/**
 * 独立运行相关的纯 Node 测试：不需要 Electron、不需要模拟器、不需要联网。
 *
 * 守的是一条产品底线（0.5.6 起升级为硬约束；0.7.x 按 docs/zapkstart/wsa-backend.md
 * **收窄但保留**）：
 *   **ApkStart 在任何机器上都只跑「自带运行时」或「用户显式选择且探测确认的 WSA」；
 *   绝不探测、接管、驱动任何第三方模拟器（MuMu / 雷电 / 蓝叠 / FydeOS）。**
 *
 * 具体要盯住五件事：
 *   1. 代码里没有第三方模拟器底座（MuMu / 雷电 / 蓝叠 / FydeOS）的实现文件
 *      （WSA 是例外：检测式、只经 adb、opt-in）；
 *   2. mode 放行是保守的：残留值一律 builtin；wsa 只在包探测确认时放行，否则回落 builtin；
 *   3. autoPick 永远 builtin-only，绝不做任何自动选择（没有「装了就用」）；
 *   4. store 的 mode 白名单是精确匹配（builtin|wsa），其它值就地压回；
 *   5. 打出来的包里不许出现任何第三方模拟器的二进制或目录。
 *
 * 运行：node test/standalone-test.js
 */
const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { findBundled, findForbiddenSource, assertStandalone } = require('../build/guard-standalone');
const backends = require('../src/core/backends');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}\n    ${e.message}`); }
}

const ROOT = path.join(__dirname, '..');
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');
const exists = (...p) => fs.existsSync(path.join(ROOT, ...p));

function tmpDir(name) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), `apkstart-${name}-`));
  return d;
}
function touch(dir, rel, bytes = 8) {
  const p = path.join(dir, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, Buffer.alloc(bytes));
  return p;
}

(() => {
  console.log('\n[独立运行 · 只有一个底座]');

  const store = require('../src/core/store');
  const settings = store.getSettings();

  test('默认引擎是自带运行时', () => {
    assert.equal(settings.engine.mode, 'builtin', `默认 mode=${settings.engine.mode}`);
  });

  test('注册表里只有 builtin 与 wsa 两个底座', () => {
    assert.equal(backends.REGISTRY.length, 2, `注册表有 ${backends.REGISTRY.length} 个底座`);
    assert.deepEqual(backends.describe().map((d) => d.id), ['builtin', 'wsa']);
  });

  test('mode 放行矩阵：残留值一律 builtin；wsa 只在探测确认时放行（保守放行）', () => {
    for (const mode of ['mumu', 'fydeos', 'attach', 'ldplayer', 'whatever', '']) {
      const made = backends.create({
        appRoot: ROOT, settings: { engine: { mode } }, store, log: () => {},
      });
      assert.equal(made.id, 'builtin', `mode=${mode} 却创建了 ${made.id}`);
      assert.equal(made.backend.constructor.id, 'builtin', '实例类型不是 BuiltinBackend');
    }
    // wsa + 探测确认（注入 wsaAvailable=true）→ WsaBackend
    const wsa = backends.create({
      appRoot: ROOT, settings: { engine: { mode: 'wsa' } }, store, log: () => {}, wsaAvailable: true,
    });
    assert.equal(wsa.id, 'wsa', 'mode=wsa 且探测确认时应创建 WsaBackend');
    assert.equal(wsa.backend.constructor.id, 'wsa', '实例类型不是 WsaBackend');
    // wsa + 探测未确认（false / 缓存为空）→ 回落 builtin
    const fb1 = backends.create({
      appRoot: ROOT, settings: { engine: { mode: 'wsa' } }, store, log: () => {}, wsaAvailable: false,
    });
    assert.equal(fb1.id, 'builtin', 'wsa 探测未确认时应回落 builtin');
  });

  test('显式传别的 id 也压不过去（回退路径不会再建出第三方底座）', () => {
    const made = backends.create({
      appRoot: ROOT, settings: { engine: { mode: 'builtin' } }, store, log: () => {}, id: 'mumu',
    });
    assert.equal(made.id, 'builtin', '显式 id=mumu 仍然被接受了');
  });

  test('自动挑选不做探测；mode 放行必须带探测闸（源码级）', () => {
    const src = read('src', 'core', 'backends', 'index.js');
    // 新契约：create 的 wsa 放行必须先过探测闸（wsaAvailable / wsaEngineNow）
    assert(/wsaAvailable/.test(src) && /wsaEngineNow/.test(src), 'create 缺少 wsa 探测闸');
    assert(/mode === 'wsa'/.test(src), 'create 没有精确匹配 mode===');
    // 反抢不变式：autoPick 永远 builtin-only，绝不在「非 wsa」时做任何自动选择
    const pick = src.slice(src.indexOf('async function autoPick'));
    assert(!/\.probe\(/.test(pick), 'autoPick 仍在探测');
    assert(/builtin-only/.test(pick), 'autoPick 不再是 builtin-only');
    // 注册表数组本体不许出现第三方模拟器（只扫数组块，文档注释里的提及不算）
    const reg = src.slice(src.indexOf('const REGISTRY'), src.indexOf('];', src.indexOf('const REGISTRY')));
    assert(!/mumu|fydeos|ldplayer|bluestacks/i.test(reg), '注册表里还有第三方底座');
    assert(/BuiltinBackend/.test(reg) && /WsaBackend/.test(reg), '注册表应包含 builtin 与 wsa');
  });

  console.log('\n[独立运行 · 第三方底座代码已删除]');

  test('backends/ 下只有 base / builtin / index / wsa', () => {
    const files = fs.readdirSync(path.join(ROOT, 'src', 'core', 'backends')).sort();
    assert.deepEqual(files, ['base.js', 'builtin.js', 'index.js', 'wsa.js'], `实际：${files.join(', ')}`);
  });

  test('mumu / fydeos / mumu-compat / frame 模块都不在了', () => {
    for (const rel of [
      ['src', 'core', 'backends', 'mumu.js'],
      ['src', 'core', 'backends', 'fydeos.js'],
      ['src', 'core', 'mumu-compat.js'],
      ['src', 'core', 'frame.js'],
    ]) {
      assert.equal(exists(...rel), false, `${rel.join('/')} 仍然存在`);
    }
  });

  test('引擎里没有「第三方底座不可用 → 回退」这类分支', () => {
    const src = read('src', 'core', 'engine.js');
    assert(!/_fallbackFrom/.test(src), '还留着第三方底座的回退标记');
    assert(!/backend\.id !== 'builtin'/.test(src), '还有按底座 id 分叉的逻辑');
    assert(!/engine\.mode === 'attach'/.test(src), '还有 attach（连接已有运行时）分支');
    assert(!/ATTACH_ENDPOINTS/.test(src), '还在探测外部模拟器的 adb 端口');
  });

  test('设置页的引擎选择器叫 setEngineBackend（探测命中才显示），没有第三方字段', () => {
    const html = read('src', 'ui', 'index.html');
    assert(!/setEngineMode/.test(html), '设置页仍有被禁用的引擎模式下拉名');
    assert(/id="setEngineBackend"/.test(html), '设置页缺少 setEngineBackend 分段控件（WSA 入口）');
    assert(!/value="mumu"|value="fydeos"|value="attach"/.test(html), '设置页仍有第三方选项');
    assert(!/setMumuPath|setMumuMemGB|setMumuCores|setFydeosHost/.test(html), '设置页仍有第三方字段');
    assert(/id="setEngineLabel"/.test(html), '设置页缺少只读的运行时说明');
  });

  test('持久化层用精确匹配白名单压回 mode（wsa 可存活，其它一律 builtin）', () => {
    const src = read('src', 'core', 'store.js');
    assert(/ENGINE_MODES/.test(src) && /new Set\(\['builtin', 'wsa'\]\)/.test(src),
      'getSettings 没有精确匹配白名单（builtin|wsa）');
    assert(/!ENGINE_MODES\.has\(s\.engine\.mode\)\) s\.engine\.mode = 'builtin'/.test(src),
      '白名单外没有压回 builtin');
    assert(/mumuPath/.test(src) && /delete s\.engine\[k\]/.test(src), '没有清理残留的第三方字段');
  });

  test('adb 候选路径不含第三方模拟器自带的 adb', () => {
    const src = read('src', 'core', 'adb.js');
    const block = src.slice(src.indexOf('const COMMON_ADB_PATHS'), src.indexOf('];', src.indexOf('const COMMON_ADB_PATHS')));
    assert(!/mumu|ldplayer|bluestacks|hd-adb/i.test(block), '仍在借用第三方模拟器的 adb');
  });

  console.log('\n[独立运行 · 包内不许有别的模拟器]');

  test('守卫能认出 MuMu 二进制', () => {
    const d = tmpDir('guard-hit');
    touch(d, 'runtime/MuMuManager.exe');
    const hits = findBundled(d);
    assert.equal(hits.length, 1, `命中数 ${hits.length}`);
    assert.equal(hits[0].vendor, 'MuMu 模拟器');
    fs.rmSync(d, { recursive: true, force: true });
  });

  test('守卫能认出 MuMu 的目录（nx_main / nx_device / nemu）', () => {
    for (const dirName of ['nx_main', 'nx_device', 'nemu']) {
      const d = tmpDir('guard-dir');
      fs.mkdirSync(path.join(d, dirName), { recursive: true });
      touch(d, path.join(dirName, 'whatever.bin'));
      assert.equal(findBundled(d).length, 1, `${dirName} 没被拦下`);
      fs.rmSync(d, { recursive: true, force: true });
    }
  });

  test('守卫也认雷电 / 蓝叠', () => {
    const d = tmpDir('guard-others');
    touch(d, 'runtime/LDPlayer.exe');
    touch(d, 'runtime/Bluestacks.exe');
    const vendors = new Set(findBundled(d).map((h) => h.vendor));
    assert.ok(vendors.has('雷电模拟器'), '雷电没被拦下');
    assert.ok(vendors.has('蓝叠模拟器'), '蓝叠没被拦下');
    fs.rmSync(d, { recursive: true, force: true });
  });

  test('守卫不会误伤我们自己的运行时', () => {
    const d = tmpDir('guard-src');
    touch(d, 'app/src/core/backends/builtin.js', 64);
    touch(d, 'app/src/core/resources.js', 64);
    assert.equal(findBundled(d).length, 0, '把自家源码当成模拟器本体了');
    fs.rmSync(d, { recursive: true, force: true });
  });

  test('守卫会拦第三方底座的适配器源码（防止又长回来）', () => {
    const d = tmpDir('guard-adapter');
    touch(d, 'app/src/core/backends/mumu.js', 64);
    touch(d, 'app/src/core/backends/fydeos.js', 64);
    touch(d, 'app/src/core/mumu-compat.js', 64);
    const hits = findForbiddenSource(d);
    assert.equal(hits.length, 3, `命中数 ${hits.length}（应为 3）`);
    const r = assertStandalone(d, { label: '测试', exit: false });
    assert.equal(r.ok, false, '适配器源码没让守卫失败');
    fs.rmSync(d, { recursive: true, force: true });
  });

  test('守卫不会把普通的 frame.js / 业务 js 当成第三方底座', () => {
    const d = tmpDir('guard-other-js');
    touch(d, 'app/src/render/frame.js', 64);
    touch(d, 'app/src/core/backends/builtin.js', 64);
    assert.equal(findForbiddenSource(d).length, 0, 'core 外的 frame.js / builtin.js 不应被误判');
    fs.rmSync(d, { recursive: true, force: true });
  });

  test('干净的运行时目录不报错', () => {
    const d = tmpDir('guard-clean');
    touch(d, 'runtime/emulator/emulator.exe', 64);
    touch(d, 'runtime/platform-tools/adb.exe', 64);
    const r = assertStandalone(d, { label: '测试', exit: false });
    assert.equal(r.ok, true, JSON.stringify(r.hits));
    fs.rmSync(d, { recursive: true, force: true });
  });

  test('目录不存在时跳过检查而不是崩掉', () => {
    const r = assertStandalone(path.join(os.tmpdir(), 'apkstart-not-exist-xyz'), { exit: false });
    assert.equal(r.ok, true);
    assert.equal(r.skipped, true);
  });

  console.log('\n[独立运行 · 构建链路已接入守卫]');

  test('便携版打包会扫一遍 resources', () => {
    const src = read('build', 'pack.js');
    assert(/assertStandalone\(path\.join\(OUT, 'resources'\)/.test(src), 'pack.js 未接入守卫');
  });

  test('MSIX 打包会扫一遍载荷 app/', () => {
    const src = read('build', 'msix.js');
    assert(/assertStandalone\(appDir/.test(src), 'msix.js 未接入守卫');
  });

  test('打包只带 build/runtime（Google 运行时），没有别的模拟器目录', () => {
    const yml = read('electron-builder.yml');
    const block = yml.slice(yml.indexOf('extraResources:'));
    const head = block.slice(0, block.indexOf('win:'));
    assert(!/mumu|ldplayer|bluestacks/i.test(head), 'extraResources 里出现了第三方模拟器');
    assert(/build\/runtime/.test(head), 'extraResources 没有内置运行时');
  });

  console.log(`\n结果：${passed} 通过，${failed} 失败\n`);
  process.exit(failed ? 1 : 0);
})();
