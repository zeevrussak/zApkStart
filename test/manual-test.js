'use strict';
/**
 * 内置手册映射测试（0.6.4）
 *
 * 重点守两件事：
 *  1) 每个章节锚点都必须真的存在于随包分发的 src/ui/manual.html；
 *  2) 自动检测 / 安装报错 / 用户手点三路入口都落到同一个正确章节。
 */
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.error(`  ✗ ${name}\n    ${e.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || '断言失败');
}

const ROOT = path.join(__dirname, '..');
const manual = require(path.join(ROOT, 'src/core/manual'));
const html = fs.readFileSync(path.join(ROOT, 'src/ui/manual.html'), 'utf8');

console.log('\n[内置手册 · 锚点]');
test('每个主题的锚点都存在于随包 HTML', () => {
  for (const topic of Object.values(manual.TOPICS)) {
    assert(html.includes(`id="${topic.anchor}"`), `${topic.id} 的锚点 ${topic.anchor} 在手册里不存在`);
  }
});

test('手册正文包含 0.6.4 版本号与声音章节', () => {
  assert(html.includes('v0.6.4'), '手册应标注 v0.6.4');
  assert(html.includes('应用没有声音'), '手册应有声音排障章节');
  assert(html.includes('内置使用手册与自动教程'), '手册应说明自动教程');
});

test('手册有 6.8 商店版 DLL 加载失败章节，且纠正一刀切误判', () => {
  assert(html.includes('商店版启动失败'), '手册应有 6.8 章节');
  assert(/不等于.*VC\+\+|不等于.*运行库|不等于.*杀毒/.test(html.replace(/<[^>]+>/g, '')),
    '6.8 应明确 0xC0000135 不等于一定缺 VC++');
});

console.log('\n[内置手册 · 自动检测问题 → 章节]');
test('硬件加速问题定位到 6.1', () => {
  const t = manual.topicForIssue({ code: 'accel.softwareEmulation', title: '当前没有硬件加速' });
  assert(t.id === 'accel', `应定位到 accel，实际 ${t.id}`);
});

test('adb 未授权定位到 6.4', () => {
  const t = manual.topicForIssue({ code: 'device.unauthorized', title: '安卓设备未授权调试' });
  assert(t.id === 'adb', `应定位到 adb，实际 ${t.id}`);
});

test('声音开关与服务停止都定位到 6.7', () => {
  assert(manual.topicForIssue({ code: 'audio.disabled' }).id === 'sound', '声音开关应到 6.7');
  assert(manual.topicForIssue({ code: 'audio.windowsServiceStopped' }).id === 'sound', '音频服务应到 6.7');
});

test('麦克风定位到麦克风章节，声音/麦克风不会串到同一节', () => {
  assert(manual.topicForIssue({ code: 'audio.microphoneDisabled' }).id === 'mic', '麦克风应到 mic 章节');
  const micTopic = manual.resolve({ issue: 'audio.microphoneDisabled' });
  // zApkStart：锚点改为 topic-id（章节号刻意不进 id，重排序不会破坏锚点）
  assert(micTopic.anchor === 'troubleshoot-mic', `锚点应为 troubleshoot-mic，实际 ${micTopic.anchor}`);
  assert(micTopic.anchor !== manual.TOPICS.sound.anchor, '声音/麦克风不得共用锚点');
});

test('DLL / VC++ 诊断问题定位到 6.8', () => {
  assert(manual.topicForIssue({ code: 'DLL', title: '运行时依赖 DLL 加载失败' }).id === 'dll', 'DLL 分类应到 6.8');
  assert(manual.topicForIssue({ code: 'vcRedist', title: '缺少 VC++ 运行库' }).id === 'dll', 'VC++ 实测项应到 6.8');
  const t = manual.topicForIssue({ code: 'runtime.bootFailed', title: '启动失败', detail: '0xC0000135 emulator exit' });
  assert(t.id === 'dll', `带 0xC0000135 的启动失败应到 6.8，实际 ${t.id}`);
});

test('启动失败带 ARM 日志时优先定位到 6.3', () => {
  const t = manual.topicForIssue({
    code: 'runtime.bootFailed',
    title: '安卓运行时上次启动失败',
    detail: 'DoBadTrampoline libndk_translation',
  });
  assert(t.id === 'arm', `应定位到 arm，实际 ${t.id}`);
});

test('反模拟 / 安全校验导致的启动退出也定位到 6.3', () => {
  for (const detail of ['emulator detected', 'SafetyNet attest failed', '反调试 hook detected']) {
    const t = manual.topicForIssue({ code: 'runtime.bootFailed', title: '应用启动退出', detail });
    assert(t.id === 'arm', `${detail} 应定位到 arm，实际 ${t.id}`);
  }
  assert(manual.topicForError('play integrity failed 主动退出').id === 'arm', '原始报错也应到 arm');
});

test('普通启动失败定位到 6.5', () => {
  const t = manual.topicForIssue({ code: 'runtime.bootFailed', title: '启动失败', detail: 'cannot lock AVD' });
  assert(t.id === 'startup', `应定位到 startup，实际 ${t.id}`);
});

console.log('\n[内置手册 · 安装报错 → 章节]');
test('NO_MATCHING_ABIS 定位到 ARM 章节', () => {
  assert(manual.topicForError('INSTALL_FAILED_NO_MATCHING_ABIS').id === 'arm', '应到 ARM 章节');
});

test('其它 INSTALL_FAILED 定位到安装章节', () => {
  assert(manual.topicForError('INSTALL_FAILED_INSUFFICIENT_STORAGE').id === 'install', '应到安装章节');
});

test('adb 与声音的原始报错分别定位', () => {
  assert(manual.topicForError('ADB_UNAUTHORIZED').id === 'adb', 'adb 报错应到 6.4');
  assert(manual.topicForError('audio disabled -no-audio').id === 'sound', '声音报错应到 6.7');
});

test('0xC0000135 原始报错定位到 6.8 而非安装章节', () => {
  assert(manual.topicForError('emulator exit 3221225781').id === 'dll', '十进制退出码应到 6.8');
  assert(manual.topicForError('0xC0000135 STATUS_DLL_NOT_FOUND').id === 'dll', '十六进制退出码应到 6.8');
});

console.log('\n[内置手册 · 统一入口]');
test('resolve 接受字符串 / issue / topic 三种形状', () => {
  assert(manual.resolve('INSTALL_FAILED_NO_MATCHING_ABIS').id === 'arm', '字符串应能识别');
  assert(manual.resolve({ issue: 'audio.disabled' }).id === 'sound', 'issue code 应能识别');
  assert(manual.resolve({ topic: 'overview', reason: 'toolbar' }).anchor, 'topic 应能识别');
});

test('未知输入回目录页，不抛异常', () => {
  const r = manual.resolve({});
  assert(r.id === 'overview' && r.anchor, '应回目录页');
});

console.log('\n[内置手册 · 接线检查]');
test('主进程注册了 manual:open，preload 暴露了 openManual', () => {
  const main = fs.readFileSync(path.join(ROOT, 'src', 'main.js'), 'utf8');
  const preload = fs.readFileSync(path.join(ROOT, 'src', 'preload.js'), 'utf8');
  assert(/ipcMain\.handle\('manual:open'/.test(main), '主进程未注册 manual:open');
  assert(/openManual:\s*\(payload\)/.test(preload), 'preload 未暴露 openManual');
  assert(/new BrowserWindow\([\s\S]*manual\.html/.test(main), '主进程未创建手册窗口');
});

test('标题栏 / 关于页都有手册入口', () => {
  const html = fs.readFileSync(path.join(ROOT, 'src', 'ui', 'index.html'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'src', 'ui', 'app.js'), 'utf8');
  assert(/id="btnManual"/.test(html), '标题栏缺少手册按钮');
  assert(/id="btnOpenManual"/.test(html), '关于页缺少手册按钮');
  assert(/\$\('btnManual'\)\?\.addEventListener/.test(js), '标题栏按钮未绑定');
  assert(/\$\('btnOpenManual'\)\?\.addEventListener/.test(js), '关于页按钮未绑定');
});

test('安装失败与修复失败都会自动打开对应教程', () => {
  const js = fs.readFileSync(path.join(ROOT, 'src', 'ui', 'app.js'), 'utf8');
  assert(/openManualForError\(raw, 'install-failed'\)/.test(js), '安装失败未自动开教程');
  assert(/function failFix\([\s\S]*openManualForIssue\(issue, 'fix-failed'\)/.test(js), '修复失败未自动开教程');
  assert(/case 'audioService'/.test(js) && /case 'audio':/.test(js), '声音修复动作未接入');
  assert(/case 'microphone':/.test(js), '麦克风修复动作未接入');
});

test('诊断条目带教程按钮', () => {
  const js = fs.readFileSync(path.join(ROOT, 'src', 'ui', 'app.js'), 'utf8');
  assert(/class="dbg-help"/.test(js), '自动检测条目缺少教程按钮');
  assert(/class="ec-help"/.test(js), '自检条目缺少教程按钮');
});

test('0xC0000135 不再被一刀切成杀毒删 DLL / 缺 VC++', () => {
  // 文案已抽取进 i18n 目录（契约见 src/core/i18n.js）：模块源码与 zh-CN 目录一起查 ——
  // 禁止的旧归因文案在哪一层都不允许回来；要求的「待定位」措辞在 zh-CN 目录里。
  const doctor = fs.readFileSync(path.join(ROOT, 'src', 'core', 'doctor.js'), 'utf8')
    + fs.readFileSync(path.join(ROOT, 'src', 'core', 'locales', 'zh-CN', 'doctor.js'), 'utf8');
  const emu = fs.readFileSync(path.join(ROOT, 'src', 'core', 'emulator.js'), 'utf8')
    + fs.readFileSync(path.join(ROOT, 'src', 'core', 'locales', 'zh-CN', 'emulator.js'), 'utf8');
  assert(!/title: '运行时组件被杀毒软件删除或缺少 VC\+\+ 运行库'/.test(doctor), 'doctor 仍在静态归因杀毒/VC++');
  assert(!/缺少 DLL（VC\+\+ 运行库 \/ 运行时组件被杀毒删除）/.test(emu), 'emulator 退出码描述仍在一刀切');
  assert(/原因待查/.test(emu) && /具体原因待定位/.test(doctor), '应标明原因待定位');
});

console.log('\n[内置手册 · 多语言源与锚点契约]');
/**
 * Phase 5（docs/zapkstart/design.md）：三个语言（zh-CN/en/he）共用同一套
 * topic-id 锚点。锚点 id 全部来自 docs/manual/topics.json；生成侧由
 * docs/build-manual-html.py 按「标题原文 -> topic-id」匹配并落到
 * docs/manual/anchors.json，测试在这里复验（不重复实现推导规则）。
 */
const DOCS = path.join(ROOT, 'docs');
const topicsFile = path.join(DOCS, 'manual', 'topics.json');
const anchorsFile = path.join(DOCS, 'manual', 'anchors.json');
const MANUAL_SOURCES = {
  'zh-CN': path.join(DOCS, 'manual', 'zh.md'),
  en: path.join(DOCS, 'manual', 'en.md'),
  he: path.join(DOCS, 'manual', 'he.md'),
};
/** topics.json 的字段名（zh 而非 zh-CN）与 build-manual-html.py 的 LOCALES[locale].field 一致 */
const TOPIC_FIELD = { 'zh-CN': 'zh', en: 'en', he: 'he' };

function mdHeadings(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const out = [];
  let fence = false;
  for (const line of lines) {
    if (line.startsWith('```')) { fence = !fence; continue; }
    if (fence) continue;
    const m = /^#{1,4}\s+(.+)$/.exec(line);
    if (m) out.push(m[1].trim());
  }
  return out;
}

test('多语言手册源（topics.json / en.md / he.md）都存在', () => {
  assert(fs.existsSync(topicsFile), '缺少 docs/manual/topics.json');
  assert(fs.existsSync(MANUAL_SOURCES.en), '缺少 docs/manual/en.md');
  assert(fs.existsSync(MANUAL_SOURCES.he), '缺少 docs/manual/he.md');
});

let topics = null;
/** topics.json 里 `_` 开头的键是元数据（与 build-manual-html.py 的过滤规则一致） */
const topicEntries = () => Object.entries(topics).filter(([k]) => !k.startsWith('_'));

test('topics.json 的 id 全部是 ASCII kebab-case（锚点契约要求冻结）', () => {
  topics = JSON.parse(fs.readFileSync(topicsFile, 'utf8'));
  const bad = [...topicEntries()].filter(([k]) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(k));
  assert(!bad.length, `非 kebab-case 的 topic-id: ${bad.map(([k]) => k).join(', ')}`);
});

test('topics.json 每个条目都有 zh/en/he 三字段（zh 允许 null）', () => {
  for (const [id, locs] of topicEntries()) {
    assert(locs && typeof locs === 'object', `${id} 不是对象`);
    assert(typeof locs.en === 'string' && locs.en.trim(), `${id} 缺 en 标题`);
    assert(typeof locs.he === 'string' && locs.he.trim(), `${id} 缺 he 标题`);
    assert(locs.zh === null || (typeof locs.zh === 'string' && locs.zh.trim()), `${id} 的 zh 必须是字符串或 null`);
  }
});

test('topics.json 覆盖三份 Markdown 源的全部标题', () => {
  for (const [locale, file] of Object.entries(MANUAL_SOURCES)) {
    const values = new Set([...topicEntries()].map(([, l]) => l[TOPIC_FIELD[locale]]).filter(Boolean));
    const headings = mdHeadings(file);
    const missing = headings.filter((h) => !values.has(h));
    assert(!missing.length, `${locale} 源有 ${missing.length} 个标题不在 topics.json 里: ${missing.slice(0, 5).join(' | ')}`);
    // 反向：topics 里登记的标题必须真的出现在源文件里（防陈旧条目）
    const headingSet = new Set(headings);
    const stale = [...values].filter((v) => !headingSet.has(v));
    assert(!stale.length, `topics.json 里 ${locale} 的这些标题在源文件里找不到: ${stale.slice(0, 5).join(' | ')}`);
  }
});

test('anchors.json 覆盖每个语言的全部标题，且 id 集合跨语言一致', () => {
  assert(fs.existsSync(anchorsFile), `缺少 ${anchorsFile} —— 先跑一遍 python docs/build-manual-html.py（任一语言都会刷新它）`);
  const anchors = JSON.parse(fs.readFileSync(anchorsFile, 'utf8'));
  const topicIds = new Set([...topicEntries()].map(([k]) => k));
  const idSets = {};
  for (const locale of Object.keys(MANUAL_SOURCES)) {
    assert(anchors[locale] && typeof anchors[locale] === 'object', `anchors.json 缺 ${locale}`);
    const headingSet = new Set(mdHeadings(MANUAL_SOURCES[locale]));
    const keySet = new Set(Object.keys(anchors[locale]));
    for (const [text, id] of Object.entries(anchors[locale])) {
      assert(topicIds.has(id), `anchors.json 里 ${locale} 的 ${id} 不在 topics.json keys 里`);
      const expect = topics[id] && topics[id][TOPIC_FIELD[locale]];
      assert(expect === text, `anchors.json[${locale}][${JSON.stringify(text)}] 应等于 topics.json[${id}][${TOPIC_FIELD[locale]}]`);
    }
    const missing = [...headingSet].filter((h) => !keySet.has(h));
    assert(!missing.length, `anchors.json 的 ${locale} 没覆盖全部标题，缺: ${missing.slice(0, 5).join(' | ')}`);
    idSets[locale] = new Set(Object.values(anchors[locale]));
  }
  // en 与 he 完全一致；zh = en 去掉 zh 源没有的标题（目前只有 arm64）
  const setEq = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
  assert(setEq(idSets.en, idSets.he), 'en 与 he 的锚点 id 集合不一致 —— 锚点契约被破坏');
  const zhExpected = new Set([...topicEntries()].filter(([, l]) => l.zh).map(([k]) => k));
  assert(setEq(idSets['zh-CN'], zhExpected), 'zh-CN 锚点集合应等于 topics.json 里 zh 非 null 的全部 id');
});

test('生成的三份 HTML 锚点一致（he 为 RTL；构建产物存在时才检查）', () => {
  const anchors = JSON.parse(fs.readFileSync(anchorsFile, 'utf8'));
  const htmlFiles = {
    'zh-CN': path.join(ROOT, 'src', 'ui', 'manual.html'),
    en: path.join(ROOT, 'src', 'ui', 'manual.en.html'),
    he: path.join(ROOT, 'src', 'ui', 'manual.he.html'),
  };
  for (const [locale, file] of Object.entries(htmlFiles)) {
    if (!fs.existsSync(file)) continue; // 生成物：没跑过该语言的构建就跳过
    const text = fs.readFileSync(file, 'utf8');
    if (locale === 'he') {
      assert(/<html[^>]*lang="he"[^>]*dir="rtl"/.test(text), 'he 版必须在 <html> 上带 lang="he" dir="rtl"');
    }
    for (const id of Object.values(anchors[locale])) {
      assert(text.includes(`id="${id}"`), `${file} 缺锚点 id="${id}"`);
    }
  }
  // 抽查跨语言同 id：同一个 topic-id 在三份产物里都指向各自的同一章节
  for (const probe of ['troubleshoot-sound', 'install', 'setup']) {
    for (const file of Object.values(htmlFiles)) {
      if (!fs.existsSync(file)) continue;
      assert(fs.readFileSync(file, 'utf8').includes(`id="${probe}"`), `${file} 缺 id="${probe}"`);
    }
  }
});

test('en/he 手册是 fork 风味（zApkStart、无 Gitee、有 ARM64 章节）', () => {
  const en = fs.readFileSync(MANUAL_SOURCES.en, 'utf8');
  const he = fs.readFileSync(MANUAL_SOURCES.he, 'utf8');
  for (const [name, text] of [['en.md', en], ['he.md', he]]) {
    assert(!/gitee\.com|daily-miku/i.test(text), `${name} 不应再引用 Gitee（fork 只从自己的 GitHub Releases 分发）`);
    assert(!/\bWeChat\b|微信/.test(text), `${name} 不应保留 WeChat 内容`);
    assert(text.includes('zApkStart'), `${name} 应使用 zApkStart 名称`);
    assert(/^## Windows ARM64$/m.test(text), `${name} 应有 Windows ARM64 章节`);
    assert(/zApkStartShared/.test(text), `${name} 应写 fork 的共享目录名`);
  }
});

console.log(`\n内置手册测试：${passed} 通过，${failed} 失败\n`);
process.exitCode = failed ? 1 : 0;
