'use strict';
/**
 * RTL 物理属性门：src/ui 下的样式表不允许用物理方向属性（left/right），
 * 一律改用逻辑属性（inset-inline-start / margin-inline / text-align: start …），
 * 否则 Hebrew（dir=rtl）下布局不镜像。
 *
 * 允许清单（RTL_EXEMPT）：每条都是「文件 + 行内容正则 + 原因」。新加豁免必须
 * 写明原因 —— Windows 标题栏按钮侧（caption buttons）永远在物理右侧，是
 * 设计文档里点名的 LTR 例外。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CSS_FILES = ['src/ui/style.css', 'src/ui/theme.css', 'src/ui/shell.css', 'src/ui/splash.css'];

const RTL_EXEMPT = [
  { file: 'src/ui/style.css', re: /padding-right:\s*148px/, why: 'Windows caption buttons reserve space on the physical right in both directions' },
  { file: 'src/ui/style.css', re: /-webkit-app-region/, why: 'drag regions are physical' },
];

const FORBIDDEN = [
  [/\bleft\s*:/, 'left:'],
  [/\bright\s*:/, 'right:'],
  [/\bmargin-left\b/, 'margin-left'],
  [/\bmargin-right\b/, 'margin-right'],
  [/\bpadding-left\b/, 'padding-left'],
  [/\bpadding-right\b/, 'padding-right'],
  [/\bborder-left\b/, 'border-left'],
  [/\bborder-right\b/, 'border-right'],
  [/text-align\s*:\s*(left|right)\b/, 'text-align: left/right'],
];

let passed = 0;
let failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}\n    ${e.message}`); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || '断言失败'); }

console.log('\n[rtl-css]');
test('UI 样式表没有未豁免的物理方向属性', () => {
  const problems = [];
  for (const rel of CSS_FILES) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) { problems.push(`${rel} 不存在`); continue; }
    // 剥注释，避免把说明文字里的 "left/right" 当违规
    const text = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ');
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (const [re, label] of FORBIDDEN) {
        if (!re.test(lines[i])) continue;
        const exempt = RTL_EXEMPT.some((x) => x.file === rel && x.re.test(lines[i]));
        if (!exempt) problems.push(`${rel}:${i + 1} ${label} → ${lines[i].trim().slice(0, 90)}`);
      }
    }
  }
  assert(!problems.length, `物理方向属性残留（改逻辑属性或加豁免）：\n      ${problems.slice(0, 20).join('\n      ')}`);
});

test('豁免清单里的条目仍然真实存在（防豁免腐化）', () => {
  for (const x of RTL_EXEMPT) {
    const file = path.join(ROOT, x.file);
    if (!fs.existsSync(file)) continue; // 文件不存在时上面的用例已报
    const text = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ');
    assert(x.re.test(text), `豁免条目已失效（请从 RTL_EXEMPT 移除）：${x.file} / ${x.re}`);
  }
});

test('index.html 在 ready 后能按 locale 设置 dir（存在引导调用）', () => {
  // 静态检查：渲染层引导代码里应出现 documentElement.dir 的设置动作
  const app = fs.readFileSync(path.join(ROOT, 'src/ui/app.js'), 'utf8');
  assert(/documentElement\.dir\s*=/.test(app), 'app.js 应包含 documentElement.dir = … 的 RTL 引导');
});

console.log(`\n结果：${passed} 通过，${failed} 失败\n`);
process.exit(failed ? 1 : 0);
