'use strict';
/**
 * 界面语言（i18n）核心。零依赖、不 import electron —— 主进程、core 模块与
 * 渲染层（经 preload 桥）都用这一个模块。
 *
 * 目录约定：src/core/locales/<locale>/<namespace>.js
 *   locale ∈ { en, he, zh-CN }；namespace = 字符串的「来源模块」（ui / main / adb /
 *   provision / …）。key 一律写成 `<ns>.<key>`，例如 t('adb.disk_full', { mb }).
 *   每个文件 `module.exports = { key: '文本', key2: '带 {param} 占位' }`。
 *
 * 解析顺序：显式选择（ui.locale 设置）> 操作系统语言 > en 兜底 > key 本身
 * （key 兜底让缺失在界面上可见，i18n-test 会把「任何 key 落到兜底」当失败）。
 *
 * RTL：he → dir rtl；其余 ltr。渲染层把 dir/lang 写到 documentElement 上。
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, 'locales');
const SUPPORTED = ['en', 'he', 'zh-CN'];
const RTL_LOCALES = new Set(['he']);
const FALLBACK = 'en';

let _cache = null;
function _resetCache() { _cache = null; }

function loadLocale(locale) {
  const dir = path.join(LOCALES_DIR, locale);
  const out = {};
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.js')); } catch (_) { /* 目录缺失 = 空表 */ }
  for (const f of files) {
    const ns = f.slice(0, -3);
    try { out[ns] = require(path.join(dir, f)); } catch (_) { /* 坏文件不影响其余 */ }
  }
  return out;
}

function tables() {
  if (_cache) return _cache;
  _cache = {};
  for (const l of SUPPORTED) _cache[l] = loadLocale(l);
  return _cache;
}

/**
 * 解析最终语言。
 * @param {string} pref settings.ui.locale：'auto' | 'en' | 'he' | 'zh-CN'
 * @param {string} [osLocale] 操作系统 UI 语言（Electron app.getLocale()，如 'he-IL'）
 */
function resolveLocale(pref, osLocale) {
  const want = String(pref || 'auto');
  if (want !== 'auto' && SUPPORTED.includes(want)) return want;
  const os = String(osLocale || '').toLowerCase();
  if (os.startsWith('he')) return 'he';
  if (os.startsWith('zh')) return 'zh-CN';
  return FALLBACK;
}

/** 文字方向：he → 'rtl'，其余 'ltr' */
function dirFor(locale) {
  return RTL_LOCALES.has(locale) ? 'rtl' : 'ltr';
}

function interpolate(str, params) {
  return String(str).replace(/\{(\w+)\}/g, (m, k) => (params && params[k] !== undefined ? String(params[k]) : m));
}

/**
 * 造一个 t()。主进程：makeT(settings.ui.locale, app.getLocale())；
 * 渲染层：经 preload 拿到整表后用同一实现（见 preload.js）。
 */
function makeT(pref, osLocale) {
  const want = resolveLocale(pref, osLocale);
  const all = tables();
  const chain = want === FALLBACK ? [FALLBACK] : [want, FALLBACK];
  return function t(key, params) {
    const dot = key.indexOf('.');
    const ns = dot > 0 ? key.slice(0, dot) : '';
    const k = dot > 0 ? key.slice(dot + 1) : key;
    for (const l of chain) {
      const tbl = all[l] && all[l][ns];
      const v = tbl && tbl[k];
      if (typeof v === 'string') return interpolate(v, params);
    }
    return key; // 缺失 → 返回 key（i18n-test 抓这种回归）
  };
}

/** 一次性给 preload / 启动逻辑用：最终语言 + 方向 */
function resolved(pref, osLocale) {
  const r = resolveLocale(pref, osLocale);
  return { locale: r, dir: dirFor(r) };
}

// ---- 进程级「当前 t」 ----
// core 模块不该各自绑语言（设置随时可改），也不该依赖 electron —— 所以 main.js
// 在启动和语言切换时调用 setActiveT()，core 模块一律 `const { t } = require('./i18n')`。
// 测试里显式 setActiveT('zh-CN') 即可钉住语言（上游测试断言的是中文文案）。
let _active = null;
let _activeCtx = { pref: 'auto', osLocale: '' };

function setActiveT(pref, osLocale) {
  _activeCtx = { pref: pref || 'auto', osLocale: osLocale || '' };
  _active = makeT(_activeCtx.pref, _activeCtx.osLocale);
  return _active;
}

/** 进程级 t()：未 setActiveT 时按 auto/en 兜底（缺失 key 原样返回） */
function t(key, params) {
  if (!_active) _active = makeT('auto', '');
  return _active(key, params);
}

/** 当前生效的最终语言（main 已 setActiveT 后才有意义；否则 auto 解析） */
function activeResolved() {
  return resolved(_activeCtx.pref, _activeCtx.osLocale);
}

module.exports = { makeT, resolveLocale, dirFor, resolved, t, setActiveT, activeResolved, SUPPORTED, _resetCache };
