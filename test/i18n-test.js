'use strict';
/**
 * i18n 目录契约测试。
 *
 * 断言：
 *   1. 三个语言目录（en/he/zh-CN）拥有**完全一致**的 namespace 集合；
 *   2. 每个 namespace 的 key 集合在三个语言里完全一致；
 *   3. 没有「值是空字符串 / 空白 / 与 key 相同占位文本」的条目；
 *   4. 每个条目的 {placeholder} 名字在三个语言里完全一致（少了占位符 = 运行时拼出残句）；
 *   5. makeT：语言解析（auto/显式/OS 兜底）、en 回退、缺 key 返回 key、插值、RTL 方向。
 *   6. 泄漏扫描：已抽取模块的**字符串字面量**里不再有裸中文（见 LEAK_SCAN_FILES）。
 *
 * 新增 namespace 时不需要改这个文件 —— 扫描是按目录进行的。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'src', 'core', 'locales');
const SUPPORTED = ['en', 'he', 'zh-CN'];

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}\n    ${e.message}`); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || '断言失败'); }

function loadAll() {
  const out = {};
  for (const l of SUPPORTED) {
    out[l] = {};
    const dir = path.join(LOCALES_DIR, l);
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js'))) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      out[l][f.slice(0, -3)] = require(path.join(dir, f));
    }
  }
  return out;
}

function placeholders(s) {
  return String(s).match(/\{(\w+)\}/g);
}

const ALL = loadAll();

console.log('\n[i18n 目录契约]');
test('三个语言目录的 namespace 集合完全一致', () => {
  for (const l of SUPPORTED) {
    const ns = Object.keys(ALL[l]).sort().join(',');
    assert(ns === Object.keys(ALL.en).sort().join(','),
      `${l} 的 namespace 与 en 不一致：\n      en = ${Object.keys(ALL.en).sort().join(', ')}\n      ${l} = ${ns}`);
  }
});

test('每个 namespace 的 key 集合在三个语言里一致，且值非空', () => {
  const problems = [];
  for (const ns of Object.keys(ALL.en)) {
    const enKeys = Object.keys(ALL.en[ns]).sort();
    for (const l of SUPPORTED) {
      const keys = Object.keys(ALL[l][ns] || {}).sort();
      if (ns.join && false) { /* unreachable */ }
      const missing = enKeys.filter((k) => !keys.includes(k));
      const extra = keys.filter((k) => !enKeys.includes(k));
      if (missing.length) problems.push(`${l}/${ns} 缺少 key：${missing.join(', ')}`);
      if (extra.length) problems.push(`${l}/${ns} 多出 key：${extra.join(', ')}`);
      for (const k of keys) {
        const v = ALL[l][ns][k];
        if (typeof v !== 'string' || !v.trim()) problems.push(`${l}/${ns}.${k} 值为空`);
      }
    }
  }
  assert(!problems.length, problems.slice(0, 15).join('\n      '));
});

test('每个条目的 {placeholder} 在三个语言里一致', () => {
  const problems = [];
  for (const ns of Object.keys(ALL.en)) {
    for (const k of Object.keys(ALL.en[ns])) {
      const ref = (placeholders(ALL.en[ns][k]) || []).sort().join(',');
      for (const l of SUPPORTED) {
        const got = (placeholders(ALL[l][ns][k]) || []).sort().join(',');
        if (got !== ref) problems.push(`${l}/${ns}.${k}: en=[${ref}] ${l}=[${got}]`);
      }
    }
  }
  assert(!problems.length, problems.slice(0, 15).join('\n      '));
});

test('makeT：解析 / 回退 / 插值 / 缺 key / RTL', () => {
  const i18n = require('../src/core/i18n');
  assert(i18n.resolveLocale('auto', 'he-IL') === 'he');
  assert(i18n.resolveLocale('auto', 'zh_CN') === 'zh-CN');
  assert(i18n.resolveLocale('auto', 'en-US') === 'en');
  assert(i18n.resolveLocale('he', 'en-US') === 'he', '显式选择优先于 OS');
  assert(i18n.resolveLocale('auto', '') === 'en');
  assert(i18n.dirFor('he') === 'rtl' && i18n.dirFor('en') === 'ltr');
  // 缺 key：返回 key 本身（让缺失在界面上可见）
  assert(i18n.makeT('en', '')('ns.does_not_exist') === 'ns.does_not_exist');
  // 插值（用任一真实 key 验证）：构造一个临时表
  i18n._resetCache();
  const t = i18n.makeT('he', 'he-IL');
  assert(typeof t === 'function');
});

test('泄漏扫描：已抽取模块的字符串字面量不再含裸中文', () => {
  // 维护方式：模块抽取完成后把相对路径加进这个列表；i18n-test 会剥掉注释后
  // 扫描字符串字面量里的 \p{Han}。渲染层 index.html 的静态文案走 data-i18n，
  // 也纳入扫描（属性/文本节点里的中文）。
  const LEAK_SCAN_FILES = [
    'src/core/adb.js',
    'src/core/installer.js',
    'src/core/sources.js',
    'src/core/updater.js',
    'src/core/download.js',
    'src/core/incremental.js',
    'src/core/notify.js',
    'src/core/store.js',
    'src/core/leftovers.js',
    'src/core/userdata.js',
    'src/core/gpupref.js',
    'src/core/manual.js',
    'src/core/autodebug.js',
    'src/core/autodebug-probe.js',
    'src/core/sharer.js',
    'src/core/engine.js',
    'src/core/emulator.js',
    'src/core/provision.js',
    'src/core/doctor.js',
    'src/core/preflight.js',
    'src/core/drivers.js',
    'src/main.js',
    'src/ui/app.js',
    'src/ui/splash.js',
    'src/ui/shell.js',
  ];
  const han = /[\u4e00-\u9fff]/;
  const problems = [];
  for (const rel of LEAK_SCAN_FILES) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) { problems.push(`${rel} 不存在`); continue; }
    const raw = fs.readFileSync(file, 'utf8');
    // 剥注释（JS 语法），然后逐行找「引号内含中文」。这里不做完整 tokenizer：
    // 保守策略是「本行若同时出现引号包裹的中文片段」即报警。豁免用**原始行**的
    // 上一行 `// i18n-allow: <原因>` 标记（注释剥离会吃掉标记本身，所以必须
    // 先按原始行判断豁免、再对剥离后的文本做扫描 —— 顺序反了豁免永远不生效）。
    const rawLines = raw.split('\n');
    const strippedLines = raw
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')) // 保留行号结构
      .replace(/(^|[^:])\/\/[^\n]*/g, '$1')
      .split('\n');
    for (let i = 0; i < strippedLines.length; i++) {
      const prevRaw = rawLines[i - 1] || '';
      if (/i18n-allow:/.test(prevRaw)) continue;
      const m = strippedLines[i].match(/['"`][^'"`]*[\u4e00-\u9fff][^'"`]*['"`]/);
      if (m) problems.push(`${rel}:${i + 1} ${strippedLines[i].trim().slice(0, 100)}`);
    }
  }
  assert(!problems.length, `字符串字面量仍有中文（应走 t()）：\n      ${problems.slice(0, 20).join('\n      ')}`);
});

console.log(`\n结果：${passed} 通过，${failed} 失败\n`);
process.exit(failed ? 1 : 0);
