# zApkStart — polite fork of ApkStart (EN/HE, RTL, ARM64-aware)

* **Author:** Ze'ev Russak (@zeevrussak)
* **Date:** 2026-11-23
* **Status:** EGM concepts brief — synthesized from six goldfish lens reviews (comprehension, structural, zoom-out, design-critic, codebase-details complete; implementation-readiness pending, merged at draft).

## Overview

zApkStart is a properly-attributed fork of [RoutineMiku/apkstart](https://github.com/RoutineMiku/apkstart) (MIT, v0.6.4 — a Windows Electron app that double-click-installs APKs and runs each app in its own window on a self-managed QEMU-based Android runtime). The fork exists for three reasons:

1. **Own identity, full credit.** The fork runs as *zApkStart*: its own appId, AUMIDs, registry keys, release assets, and update feed (zeevrussak/zApkStart) — never impersonating the original and never pulling users back to upstream builds. Upstream is credited in README, NOTICE.md, and the About page; the upstream MIT LICENSE is preserved verbatim.
2. **The whole product speaks English and Hebrew.** Upstream's UI is Chinese in ~71 files (app UI, tray, notifications, installer, and error/diagnostic strings that reach the screen through IPC). The fork localizes every user-visible string into English (base) and Hebrew (full RTL), keeps zh-CN as an untested bundled byproduct, and fixes two upstream defaults that are wrong for an international audience: the emulated Android is forced to Chinese (guest locale now follows the chosen UI language), and guest DNS defaults to Ali/Tencent servers (now opt-in).
3. **Honest Windows 11 ARM64 support.** The Electron shell ships a native arm64 build. The Android engine cannot be native: Google publishes Windows emulator binaries for x64 only, and mainline QEMU cannot boot Google's ranchu/goldfish images. So on ARM64 the fork reports a clear capability matrix (native shell; engine unavailable natively; an explicit opt-in "try the x64 engine under Windows emulation" mode with expectations set and the broken auto-retry ladder disabled) and documents the native-engine research path out-of-tree with go/no-go gates.

Target user: the fork maintainer and Hebrew/English-speaking Windows users who want Android apps as desktop windows.

## Analysis

Findings below are deduplicated across the six lenses; each was verified against the code by at least one reviewer, and the load-bearing ones (guest zh-CN forcing, DNS defaults, third asset-prefix site, AUMID, `process.arch` limits, SDK index facts) were re-verified directly by the elephant.

### Identity (feasible; plan must cover every site or it silently breaks)

- The upstream repo identity is hardcoded in **more places than the concept named**: `sources.js` (owner constants, UA, synthetic asset names, `/^ApkStart/i` whitelist), `updater.js` (owner/repo/releasesUrl), `provision.js` (`ghReleaseApi`, runtime-pack regex `/^ApkStart-runtime-.*\.zip$/i` at line 578), `download.js` UA, `main.js` AUMID (`RoutineMiku.ApkStart`, line 364) and per-app shortcut AUMIDs (`installer.js:399`), `assoc.js` PROGID/registry keys, `installer.js` Start-Menu folder and shortcut descriptions, `leftovers.js` cleanup regexes, `installer.nsh` (`taskkill /IM ApkStart.exe`), `pack.js` (does **not** read productName — six literal copies of the name), `msix.js` (publisher constants), `electron-builder.yml` (`appId com.apkstart.win`, MSIX identity/publisher belonging to upstream's Partner Center), `release.yml` (asset names + Gitee sync step), plus `README.md`, About tab (WeChat/Douyin QR images), splash footer, manual download-sources section, and committed junk (`dist.lnk`).
- **The Gitee second source is a P0, not a cleanup item.** `fetchReleases()` queries GitHub and Gitee concurrently and takes whichever reports the higher version. Upstream's Gitee releases (v0.7+) will win and the fork will auto-install upstream's Chinese ApkStart build as a "zApkStart update". Gitee must be severed (sources, provision runtime-pack fallback, tools/publish-gitee.js, release.yml sync step), not renamed.
- The update-asset contract is one system: `sources.js` whitelist + synthetic names, `provision.js:578` runtime-pack regex, `updater.js`/`incremental.js` matching, and `release.yml` CI names. Renaming any subset bricks self-update. All four regex sites plus CI must move in one change, driven by a single brand constant.
- Test tripwires assert upstream literals (`test/auto-test.js` asserts `RoutineMiku.ApkStart` AUMIDs, `gitee.com/daily-miku/...` URLs, `apkstart.avd` names). They are regression protection and must be rewritten to the fork's values, not deleted.
- Data paths: `store.js` `%USERPROFILE%\ApkStart\data` / `%APPDATA%\apkstart`, `ApkStartShared` folders, `apkstart.avd` (+ a duplicate literal at `engine.js:1369`). Decision taken below (clean break).

### i18n + RTL (feasible; it is a three-surface project, not string replacement)

- Real string surface: `main.js` 788 Han-bearing lines (tray labels, notifications, IPC error strings), `ui/app.js` 598, `ui/index.html` 363, `manual.html` 201 (generated), splash/shell, `installer.nsh`, `gpupref.js` labels — **and ~600 more quoted-string lines across ~40 `src/core/*` modules** (provision, engine, autodebug, emulator, preflight, adb, doctor, installer, incremental, updater, sources…) whose `Error` messages, progress text, autodebug problem titles/hints, and doctor reports reach the screen through IPC. Translating only `src/ui` leaves a Hebrew user with Chinese error dialogs — unacceptable for this fork.
- No i18n machinery exists anywhere; all four HTML roots are `lang="zh-CN"` with no `dir` attribute; no locale setting exists (`engine.locale` is the **guest Android** locale — a different thing; a UI locale key must not collide with it).
- RTL: styles are overwhelmingly flexbox/grid (~25 physical `left/right` hits in `style.css`), so a root `dir` switch does most of the mirroring; bounded work remains (context-menu `menu.style.left` math, titlebar ordering, `unicode-bidi: plaintext` for mixed Hebrew/package-name text, screenshot pass). Mirrored per-locale stylesheets are rejected (drift trap).
- Packaging: `electronLanguages` lacks `he` (Hebrew `Intl` behavior degrades without it); `appx.languages` lacks `he-IL`; NSIS has no `installerLanguages`/language selector.
- The in-app manual is generated from `docs/USER-MANUAL.md` by `build-manual-html.py`; anchors are Chinese-heading slugs consumed by `manual.js` TOPICS and asserted by `manual-test.js`. Localizing the manual without decoupling anchors breaks the fault-code→tutorial pipeline in every non-zh locale.
- The Hebrew manual is a translation project (507-line source), not an extraction byproduct — a separate deliverable so the i18n milestone can close.

### ARM64 (the constrained pillar; honesty is the design)

Verified facts (live dl.google.com index, 2026-11-23):
- Emulator SDK: `emulator-windows_x64-*.zip` only, explicit `<host-os>` tags; **no Windows ARM64 build exists**.
- Platform-tools: `platform-tools_r37.0.3-win.zip`, x64 payload (runs under Windows-on-ARM x64 emulation).
- Google Play arm64-v8a system images exist and are host-agnostic (`arm64-v8a-34_r14.zip`, HTTP 200 verified) — but they are ranchu/goldfish images for Google's emulator QEMU fork.
- Mainline QEMU has partial goldfish devices but **no `-M ranchu` machine** and no host-side OpenGL pipe; QEMU's official Windows builds are x64 (`qemu-w64-setup-*`). Booting Play images on mainline QEMU is ongoing Linaro research, not a capability.
- Consequence for x64-engine-under-WoA: no WHPX/AEHD (neither accelerates x64 guests on ARM64 hosts) → TCG software emulation of an x86_64 guest *inside* Prism x64 emulation. The app's own recovery ladder (600 s boot timeout, GPU→accel→memory retries, "enable VirtualMachinePlatform / install AEHD" hints) is factually wrong on ARM64 — both remedies are impossible there.
- `process.arch` reports the *binary's* arch: an x64 build on ARM64 Windows self-identifies as x64, so every existing arch probe silently misses WoA. Host-arch detection needs a native probe (`Win32_Processor.Architecture`, preflight already runs PowerShell).

## Goals vs. Non-Goals

**In-scope goals:**

1. Fork identity: zApkStart branding everywhere user-visible; own appId (`com.zapkstart.app`), AUMID (`zApkStart`), PROGID/registry names, release asset prefix `zApkStart-`; updater/updater-runtime/release CI retargeted to zeevrussak/zApkStart; **Gitee removed**; MSIX Store identity replaced with neutral fork values (Store publishing itself is out of scope); upstream social assets removed; About page credits upstream.
2. Attribution: upstream `LICENSE` byte-for-byte untouched; new `NOTICE.md` (fork identity, upstream URL @ v0.6.4, upstream copyright preserved, fork modification copyright, divergence pointer); README.md replaced (English, with citation block and divergence list) + full Hebrew parallel `README.he.md`; add-only root `SITEMAP.md`; EGM artifacts under `docs/zapkstart/`.
3. Localization: string catalog (`src/core/i18n.js` + `src/core/locales/{en,he,zh-CN}.js`, CJS modules delivered through the preload bridge — CSP + `file://` makes `fetch('*.json')` unreliable) covering **all** user-visible strings including core-module errors/diagnostics/autodebug/doctor. Architecture decision: the renderer currently **regex-matches translated core text** (`app.js friendlyInstallErrorText` matches `/空间不足/` fragments emitted by `adb.js`), so core errors first become structured `{code, params}` + raw system message, and the renderer composes localized guidance from codes; core-side strings go through `t()` with locale from `store` (tests pin the locale explicitly instead of asserting Chinese). `data-i18n` for static HTML; `t()` for JS; tray/menu rebuild on switch (native menus don't reflow); UI locale setting `ui.locale` (`auto|en|he|zh-CN`, OS-detect default, a **new top-level settings group** — `engine.locale` is the guest Android locale and must not collide); guest Android locale follows the same setting (`he→he-IL`: Hebrew is a native Android RTL locale; PinyinIME only when zh); `fastDns` default off (Ali/Tencent DNS opt-in); `he` in **both** locale filters (`electron-builder.yml electronLanguages` and `build/pack.js KEEP_LOCALES`); `he-IL` in `appx.languages`; NSIS `installerLanguages: [english, hebrew]` + selector; no-leak CI checker that fails when raw CJK reaches a non-zh surface, and a CSS physical-property allowlist test (`style.css` caption-button reservation stays LTR deliberately).
4. RTL: root `dir` plumbing per locale; logical-property fixes where flexbox/grid can't mirror; context-menu math flip; `unicode-bidi: plaintext` on mixed-content surfaces; screenshot-driven fix pass over every screen. Acceptance bar: usable RTL, not pixel-perfect.
5. Manual: `docs/manual/{en.md,he.md}` + `topics.json` stable topic-id anchors; builder extended `--locale`; `manual.js` resolves titles/anchors per locale; in-app manual opens the right locale; `manual-test.js` validates all locales.
6. ARM64: native arm64 Electron build target (electron-builder `--win nsis --arm64` + zip target, `@napi-rs/lzma-win32-arm64-msvc` shipped, artifact names carry `${arch}`, pack.js stays x64-only); native host-arch probe (`arch.js` single `runtimePlan()` consumed by provision/emulator/doctor/preflight); the per-arch change is the **sysimg/qemu/imageChoice parameter set** — `PLAY_SYSIMG.abi`, `paths().qemuExe`, `resolveSysimgUrl` filters, `emulator.js imageChoice()` — while the emulator URL filter `/windows_x64/` **stays** on every host because the ARM64 default deliberately runs Google's x64 engine under Windows emulation; strip lists in `layers.js`/`slim-runtime.js` are keyed by backend selector with a fail-loud guard (today's rules are already dir-scoped to `emulator/qemu/windows-x86_64` and cannot touch a standalone `qemu/` dir); updater asset pick is arch-aware by binary arch (an x64 build on WoA correctly picks x64 assets); on ARM64 hosts: capability gate in doctor/preflight with honest copy, opt-in "try x64 engine under emulation" mode (single attempt, retry ladder disabled, expectation banner, no impossible AEHD/WHPX remediation hints), and an in-app ARM64 notice stating which tier the user is on; release CI gains an arm64 lane (cross-built on an x64 runner, PE-header gate `Machine == 0xAA64` via pure-Node read, no dumpbin dependency). Fork releases must publish the x64 runtime bundle themselves (`zApkStart-runtime-<tag>.zip`); arm64 artifacts ship runtime-less and download on first boot.
7. Tests: rewrite identity tripwires; add `i18n-test.js`, `arch-test.js`, asset-prefix consistency test, manual anchor test; keep `npm test` green.

**Out-of-scope non-goals:**

- Native ARM64 Android engine (shipped): documented as out-of-tree research with go/no-go gates (`docs/zapkstart/arm64-research.md`): gate 1 = `-M ranchu` in mainline QEMU; gate 2 = maintained QEMU WoA Windows build; gate 3 = a Play image boots to lock screen under software GL. No UI toggle until all three pass.
- Full pixel-perfect RTL mirroring.
- Migrating data from upstream ApkStart installs (clean break — see decision below).
- Microsoft Store publishing (MSIX identity neutralized so nothing impersonates upstream; actual Store listing is a Partner Center action outside this repo).
- Linux/FydeOS targets: kept as inherited code, declared unsupported in the README; not maintained.
- Keeping zh-CN as a QA'd locale (it ships as an extraction byproduct with en fallback, explicitly outside the EN/HE test matrix).
- Chinese code comments (left untouched — preserves cherry-pick readability from upstream).

## Alternatives Weighed

- **Tracking fork (keep upstream merges)** — rejected: the i18n refactor touches string literals in the three largest files; line-level merges are fiction afterwards. Hard fork declared; `upstream` remote kept for cherry-picking only.
- **Freeze data paths (`ApkStart` dirs) to avoid migration** (zoom-out) — rejected: it makes fork and upstream share settings, runtime, AVDs, and the shared folder on one machine — worse confusion than a clean break, and this fork has no existing users. Data dirs rename (`%APPDATA%\zapkstart`, `%USERPROFILE%\zApkStartShared`, `zapkstart.avd`), no migration, release-note the incompatibility.
- **x64-only builds, ARM64 declared unsupported** (zoom-out/design-critic) — rejected as the whole story: the maintainer's requirement is explicit ARM64 support. Adopted *partially* as the engine-layer truth: the engine is unsupported on ARM64 and says so; the shell still ships native.
- **Ship a flag-gated `qemu-system-aarch64` native path in the UI** — rejected (design-critic + zoom-out): ranchu machine missing in mainline QEMU, no WoA QEMU distribution, no graphics pipe, zero precedent in this codebase; shipping an unproven toggle manufactures false hope. Becomes the gated research doc instead.
- **"Slow but works" default x64-engine-on-ARM64** — rejected: it is not slow, it is non-functional (TCG under Prism + broken recovery ladder + impossible remediation hints). Becomes an explicit opt-in attempt with the ladder disabled and expectations stated.
- **Full logical-property CSS rewrite for RTL** — rejected: days of diff noise for invisible parity; targeted fixes + screenshots instead.
- **Dropping zh-CN** — rejected: the zh dictionary falls out of the EN extraction nearly free; dropping it only pays merge-tax under a posture that no longer exists.
- **sed-style in-place string replacement across files** — rejected: catalog + key-based lookup is the only approach that supports runtime switching, RTL, and the CI leak gate.

## Key Decisions & Staging for Next Steps

1. Brand constant first: `src/core/brand.js` (productName, appId, AUMID prefix, asset prefix `zApkStart-`, runtime-pack regex, UA) consumed by sources/provision/updater/download/pack/leftovers/installer/assoc/release.yml generation; one commit moves all four regex sites + CI names together.
2. Identity retarget (AUMIDs, PROGID, registry, Start-Menu, About de-branding, MSIX neutral values, package.json metadata + `contributors: ["RoutineMiku"]`), data-dir clean break, `dist.lnk` deleted, QR assets removed.
3. i18n scaffolding (loader, locales, settings `ui.locale`, preload bridge, tray rebuild) → mechanical extraction pass per surface (static HTML → renderer JS → main process → core IPC strings → installer) → RTL pass → packaging locale lists → CI leak gate.
4. Manual pipeline decoupling (topics.json anchors) before translation; EN then HE.
5. ARM64: `arch.js` native probe → sysimg/qemu/imageChoice parameterization (x64 emulator filter unchanged) → electron-builder arm64 targets + lzma arm64 prebuild → arch-aware updater assets + release CI arm64 lane publishing the runtime bundle → doctor/preflight capability gate + opt-in emulated-engine mode with ladder disabled.
6. Testing decisions: pure-Node static tests only (key-set parity across en/he/zh, `data-i18n` coverage by HTML attribute parse, Han-leak scanner with an allowlist, CSS physical-property allowlist) — no jsdom; DOM behaviors (dir flip, runtime switch, tray rebuild, RTL screenshots of main/empty/settings/welcome/manual/toast screens) are a named manual-QA list. Hebrew strings are authored for this fork and flagged for human review. Existing Chinese-asserting tests (`engine-test`, `preflight-test`, `settings-categories-test`, `manual-test`) get explicit locale pins or rewritten assertions in the same commit as the change that breaks them; `test/auto-test.js` AUMID/AVD/gitee tripwires are rewritten to fork values, never deleted.
7. Verify: `npm test` green with rewritten tripwires; arm64 cross-build produced on the x64 dev box and PE header checked (`Machine == 0xAA64`) plus an rcedit round-trip gate; dist tree greps clean of upstream identity strings; runtime boot on real ARM64 hardware (emulated-engine performance/graphics, WHPX-on-ARM64, he-RTL system chrome, MSIX arm64 store submission) remains explicitly unverifiable here and is documented as such.
8. Version policy: fork versions are semver prereleases on the upstream base — `<upstream>-zk.<n>` (e.g. `0.6.4-zk.1`; the `-zk.<n>` part strips cleanly from four-segment versions). About shows the fork version plus the upstream base; fork versions are never version-compared against upstream releases (the two update channels no longer share a namespace).

Carried into `/egm-draft` as Priority 1 intake. Alternatives above are copied into the design's Alternatives Considered.

Carried into `/egm-draft` as Priority 1 intake. Alternatives above are copied into the design's Alternatives Considered.
