'use strict';
/* zApkStart 开机动画脚本：接收主进程的进度更新，控制淡出 */

const api = window.zapkstartSplash;
if (!api) { /* preload 未注入时静默退出 */ }

const $ = (id) => document.getElementById(id);

/* ---------------- 界面语言（i18n） ---------------- */
let t = (key) => key;
function applyStatic() {
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
}
(async () => {
  if (!api || !api.i18n) { applyStatic(); return; }
  try {
    const st = await api.i18n.state();
    t = st.t;
    document.documentElement.dir = st.dir;
    document.documentElement.lang = st.locale;
  } catch (_) { /* 桥不可用时保持兜底 */ }
  applyStatic();
})();

// 版本号
api?.version?.().then((v) => { if ($('ver')) $('ver').textContent = v || ''; }).catch(() => {});

// 首次安装标记 + 组件是否随包自带
Promise.all([
  api?.isFirstRun?.().catch(() => false),
  api?.bundled?.().catch(() => false),
]).then(([first, bundled]) => {
  if (!first || !$('firstRun')) return;
  $('firstRun').hidden = false;
  // 内置运行时（完整版安装包 / 微软商店 MSIX 版）：一个字都不该提「下载」。
  // 用户抱怨的就是「装了 850MB 还在下镜像」，实际那只是把包里的压缩镜像
  // 展开到用户目录，不需要联网。
  if (bundled) {
    if ($('firstRunTitle')) $('firstRunTitle').textContent = t('ui.splash_firstrun_bundled_title');
    if ($('firstRunList')) {
      $('firstRunList').innerHTML = [
        t('ui.splash_firstrun_bundled_1'),
        t('ui.splash_firstrun_bundled_2'),
        t('ui.splash_firstrun_bundled_3'),
        t('ui.splash_firstrun_bundled_4'),
      ].map((x) => '<li>${x}</li>').join('');
    }
  }
}).catch(() => {});

// 进度更新
api?.onProgress?.((p) => {
  if (!p) return;
  if (p.percent != null && $('progressBar')) {
    $('progressBar').style.width = Math.min(100, Math.max(0, p.percent)) + '%';
  }
  if (p.message && $('status')) {
    $('status').textContent = p.message;
  }
});

// 完成 → 淡出
api?.onDone?.(() => {
  const splash = $('splash');
  if (splash) {
    splash.classList.add('out');
    setTimeout(() => { api?.close?.(); }, 520);
  }
});
