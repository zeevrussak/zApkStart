'use strict';
/**
 * 身份门（identity gate）：zApkStart fork 的独立性回归测试。
 *
 * 断言三件事：
 *   1. 代码里不再出现上游仓库身份（RoutineMiku / daily-miku / gitee.com）——
 *      这是设计上的硬约束：更新源竞速曾会让上游构建覆盖 fork（见
 *      docs/zapkstart/design.md §The Problem）。允许出现的只有「署名」位置
 *      （README/NOTICE/关于页的 attribution），下面有显式清单。
 *   2. 「ApkStart」这个词只能出现在署名/历史注释语境里；剥离注释后的代码
 *      字符串里不允许裸出现（必须是 zApkStart 或署名短语的一部分）。
 *   3. 上游的资产前缀 ApkStart- 不再被任何匹配/生产代码引用。
 *
 * 注释会被剥离后再扫描（JS/PS1/NSIS/YML 各自的注释语法），避免把「上游历史
 * 注释」误报成身份泄漏。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}\n    ${e.message}`); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || '断言失败'); }

/** 扫描范围：所有可能进入构建或运行时的文本文件 */
const SCAN_DIRS = ['src', 'build', 'scripts', 'tools', '.github'];
const SCAN_EXT = /\.(js|ps1|nsh|yml|yaml|json|html|css|md)$/i;

/** 署名允许清单：这些文件/片段是「正确的上游署名」，不算身份泄漏 */
const ALLOW_FILES = [
  /^README\.md$/, /^README\.he\.md$/, /^NOTICE\.md$/, /^SITEMAP\.md$/, /^LICENSE$/,
  /^docs\//, // docs/ 整体放行（fork 文档 + 上游继承文档都在这里；无关运行时）
  /^CHANGELOG/i,
];
/** 代码文件里允许出现的署名短语（剥离注释后仍允许的原文） */
const ALLOW_PHRASES = [
  /fork of ApkStart by RoutineMiku/i,
  /ApkStart מאת RoutineMiku/,
  /基于 ApkStart（作者 RoutineMiku，MIT）/,
  /based on ApkStart by RoutineMiku/i,
  /original ApkStart/i,
  /ApkStart contributors/i, // 版权双署名（pack.js rcedit / electron-builder.yml copyright）
  /\(c\) 2026 ApkStart/i,
  /RoutineMiku\/apkstart/, // About 页指向上游仓库的署名链接
  /מהפרויקט המקורי ApkStart/, // HE 手册「原版 ApkStart 项目」的澄清句（不冒充声明）
  // leftovers.js 的清理发现逻辑刻意同时认自家与上游目录名（为了「绝不误删
  // 上游安装」的保护性断言，见 test/auto-test.js 的 upstream 保护用例）
  /\(\?:zApkStart\|ApkStart\)/,
];
/** 这些 token 在代码里一处都不允许有（署名也不需要它们） */
const HARD_FORBIDDEN = [/daily-miku/i, /gitee\.com/i, /GITEE_TOKEN/i, /publish-gitee/];

/** 剥离注释（按扩展名的语法） */
function stripComments(text, ext) {
  let t = text;
  if (ext === '.js') {
    t = t.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  } else if (ext === '.ps1') {
    // PowerShell 注释（# 与 <# #>）+ 嵌入 C# 的 // 注释（agent.ps1 内嵌 C# 钩子）。
    // `(^|[^:])` 与 JS 分支同理：避免误剥 URL 里的 //。
    t = t.replace(/<#[\s\S]*?#>/g, ' ').replace(/#[^\n]*/g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  } else if (ext === '.nsh') {
    t = t.replace(/;[^\n]*/g, ' ').replace(/#[^\n]*/g, ' ');
  } else if (ext === '.yml' || ext === '.yaml') {
    t = t.replace(/#[^\n]*/g, ' ');
  } else if (ext === '.html' || ext === '.css') {
    t = t.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  }
  return t;
}

function* walk(dir) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile() && SCAN_EXT.test(e.name)) yield full;
  }
}

function collectFiles() {
  const out = [];
  for (const d of SCAN_DIRS) {
    const abs = path.join(ROOT, d);
    if (fs.existsSync(abs)) out.push(...walk(abs));
  }
  // 根级构建/包文件
  for (const f of ['package.json', 'electron-builder.yml']) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) out.push(p);
  }
  return out;
}

function lineOf(text, idx) { return text.slice(0, idx).split('\n').length; }

console.log('\n[identity-gate]');
test('上游身份（RoutineMiku/daily-miku/gitee）不出现在任何代码或配置里', () => {
  const problems = [];
  for (const file of collectFiles()) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    if (ALLOW_FILES.some((re) => re.test(rel))) continue;
    const raw = fs.readFileSync(file, 'utf8');
    const stripped = stripComments(raw, path.extname(file));
    for (const re of HARD_FORBIDDEN) {
      let m;
      const g = new RegExp(re.source, 'gi');
      while ((m = g.exec(stripped))) {
        problems.push(`${rel}:${lineOf(stripped, m.index)} ${re}`);
        break;
      }
    }
    if (/RoutineMiku/i.test(stripped)) {
      const lines = stripped.split('\n')
        .map((l, i) => ({ l, i: i + 1 }))
        .filter((x) => /RoutineMiku/i.test(x.l))
        .filter((x) => !ALLOW_PHRASES.some((re) => re.test(x.l)));
      for (const x of lines) problems.push(`${rel}:${x.i} RoutineMiku（非署名短语）`);
    }
  }
  assert(!problems.length, `发现上游身份残留（应在署名位置之外清除）：\n      ${problems.slice(0, 20).join('\n      ')}`);
});

test('裸「ApkStart」不出现在剥离注释后的代码字符串里（署名短语除外）', () => {
  const problems = [];
  const bareApk = /(?<![A-Za-z])ApkStart(?![A-Za-z])/; // 不匹配 zApkStart
  for (const file of collectFiles()) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    if (ALLOW_FILES.some((re) => re.test(rel))) continue;
    const stripped = stripComments(fs.readFileSync(file, 'utf8'), path.extname(file));
    const lines = stripped.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const m = bareApk.exec(lines[i]);
      if (!m) continue;
      const line = lines[i];
      if (ALLOW_PHRASES.some((re) => re.test(line))) continue;
      problems.push(`${rel}:${i + 1} ${line.trim().slice(0, 110)}`);
    }
  }
  assert(!problems.length, `裸 ApkStart 残留（应为 zApkStart 或署名短语）：\n      ${problems.slice(0, 20).join('\n      ')}`);
});

test('资产前缀白名单/运行时整包正则全部来自 brand.js（抽查三个历史泄漏点）', () => {
  const brand = require('../src/core/brand');
  assert(brand.ASSET_PREFIX === 'zApkStart-', 'ASSET_PREFIX');
  const sources = fs.readFileSync(path.join(ROOT, 'src/core/sources.js'), 'utf8');
  assert(sources.includes('brand.ASSET_WHITELIST_REGEX'), 'sources.js 白名单应来自 brand');
  const provision = fs.readFileSync(path.join(ROOT, 'src/core/provision.js'), 'utf8');
  assert(provision.includes('brand.RUNTIME_PACK_REGEX'), 'provision.js 运行时整包正则应来自 brand');
  const updater = fs.readFileSync(path.join(ROOT, 'src/core/updater.js'), 'utf8');
  assert(/archOk/.test(updater), 'updater 应按架构挑资产');
});

console.log(`\n结果：${passed} 通过，${failed} 失败\n`);
process.exit(failed ? 1 : 0);
