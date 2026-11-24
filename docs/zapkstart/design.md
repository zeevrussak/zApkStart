# zApkStart — fork design: identity, EN/HE + RTL, ARM64

* **Author:** Ze'ev Russak (@zeevrussak)
* **Status:** In Review (EGM draft — synthesized from `docs/zapkstart/concepts_brief.md`)
* **Date:** 2026-11-23

--------------------------------------------------------------------------------

## Overview

zApkStart is a fork of RoutineMiku/apkstart v0.6.4 (MIT) that (1) takes a distinct, properly-attributed product identity with its own update feed, (2) localizes every user-visible string into English and Hebrew with full right-to-left support — including the error and diagnostic strings the main process sends to the screen, and the emulated Android's own system language — and (3) ships a native Windows-ARM64 Electron shell with honest, arch-aware runtime behavior, given that Google publishes no ARM64 Android emulator for Windows.

Everything else about upstream stays: the architecture (Electron main + preload + vanilla-JS renderer over `src/core/*` CommonJS modules), the zero-runtime-dependency philosophy, the QEMU-based self-managed runtime, quickboot snapshots, the updater model, and `npm test` as the CI gate.

## The Problem

Upstream ApkStart is Chinese-first and Windows-x64-only, branded and update-bound to its author:

1. **Identity**: the product name, appId, AUMIDs, registry keys, release-asset names, MSIX Store identity (upstream's literal Partner Center publisher), and update sources (GitHub `RoutineMiku` + Gitee `daily-miku`) all point at upstream. A fork that renames only the README would still auto-install upstream builds over itself — `sources.js` queries both release sources concurrently and takes the higher version, so upstream's Gitee releases would win the version race and silently replace the fork.
2. **Language**: ~71 files carry user-visible Chinese — not only `src/ui` but ~600 quoted-string lines across ~40 `src/core/*` modules whose `Error` messages, progress text, autodebug problem titles/hints, and doctor reports reach the screen through IPC. The renderer also regex-matches fragments of those translated strings (`app.js friendlyInstallErrorText` matches `/空间不足/` from `adb.js`), so translation without an error-code contract breaks error guidance. Upstream additionally forces the emulated Android to zh-CN with a bundled Pinyin IME, and defaults guest DNS to Ali/Tencent servers.
3. **Platform**: on Windows ARM64, `process.arch` reports the binary's arch (`x64`), so an x64 build self-identifies as x64 and walks a recovery ladder whose remediation hints (enable WHPX / install AEHD) are impossible on ARM64; the x64 engine under Windows emulation is software-translation-on-software-translation (TCG inside Prism) — functional at best, unusable for real apps. Google's SDK index offers no Windows-ARM64 emulator at all (verified 2026-11-23), and mainline QEMU cannot boot Google's ranchu/goldfish images (no `-M ranchu`, no host GL pipe).

The fork resolves each with a distinct identity and severed update path, a three-surface localization architecture (UI chrome, main-process surfaces, core IPC strings) on top of an error-code contract, and an ARM64 story that is honest by design.

## Goals

* The fork installs, updates, and uninstalls as **zApkStart** — own appId `com.zapkstart.app`, AUMID `zApkStart`, PROGID/registry names, `%APPDATA%\zapkstart` data dir, `zApkStart-*` release assets — and can never download an upstream build (Gitee source deleted; GitHub source = `zeevrussak/zApkStart`).
* Upstream attribution is visible and correct: upstream `LICENSE` byte-for-byte, `NOTICE.md`, fork README (EN) + `README.he.md`, citation block with upstream URL @ v0.6.4 and divergence list, About page credit; zero upstream social assets (WeChat/Douyin QR, WeChat article, committed `dist.lnk`).
* The entire product surface — installer, splash, shell, main window, tray, notifications, dialogs, settings, manual, and every core-module error/progress/diagnostic string — renders in **English** (base) or **Hebrew**, user-selectable (`ui.locale`: `auto|en|he|zh-CN`, OS-detected default), with RTL layout that passes a screenshot pass on six screens.
* The emulated Android's system locale follows the same setting (Hebrew host → `he-IL` guest; `he-IL` is a native RTL Android locale); the Pinyin IME installs only for zh; Ali/Tencent DNS is opt-in.
* The Electron shell ships native **arm64** builds (NSIS + portable zip), produced by CI cross-compilation and verified to be true ARM64 PEs; the updater picks update assets by binary arch.
* On an ARM64 host the app states its capability tier plainly: shell native; Android engine unavailable natively; an explicit opt-in ("try anyway") runs the x64 engine under Windows emulation with a single attempt, no retry ladder, and no impossible remediation hints.
* `npm test` stays green with rewritten identity tripwires and new tests: locale key parity, `data-i18n` coverage, Han-leak scanner, RTL CSS allowlist, arch runtime plan, identity-string gate.

## Non-Goals

* Native ARM64 Android engine — documented as out-of-tree research with go/no-go gates in `docs/zapkstart/arm64-research.md`; no shipped UI toggle.
* Pixel-perfect RTL mirroring (acceptance bar: usable RTL, enumerated fixes, screenshot pass).
* Migrating data from upstream ApkStart installs (clean break; documented incompatibility).
* Microsoft Store publishing (MSIX identity neutralized to fork values; Store listing is a Partner Center action).
* Linux/FydeOS: inherited code kept but declared unsupported; not maintained.
* zh-CN as a QA'd locale: ships as an extraction byproduct with en fallback, outside the test matrix.
* Translating Chinese code comments (kept for upstream cherry-pick readability).

## Open Questions

* **Hebrew quality review**: HE strings are authored for this fork; a native-speaker pass over `he.js` + `README.he.md` + the Hebrew manual is wanted before wide distribution (maintainer can review).
* **App icon**: a distinct zApkStart icon should be rendered via the existing `build/logo.html` → `build/render-logo.js` → `build/build-icons.js` pipeline; if the pipeline fights back, fall back to a programmatically drawn icon (`src/core/png.js` already draws icons) — either way the upstream logo is replaced, not re-labeled.
* **electron-builder NSIS-on-arm64**: builder 26.18 supports arm64 NSIS, but this is verified empirically at build time; the zip target is the guaranteed fallback artifact for the arm64 lane.

## Critical User Journeys (CUJs)

### CUJ 1: Hebrew-speaking user installs and uses zApkStart

* **Given**: A Windows 11 x64 PC with Hebrew UI locale; `zApkStart-<v>-Setup.exe` downloaded from the fork's releases.
* **When**: The user runs the installer, launches zApkStart, installs an APK, and hits a disk-space error during another install.
* **Then**: The NSIS wizard shows Hebrew (language selector); the app UI is Hebrew with `dir=rtl`; the guest Android boots `he-IL`; the disk-space error renders as a composed Hebrew message from an error code; tray, notifications, and dialogs are Hebrew; toggling UI language to English switches everything without restart, and the tray rebuilds.

### CUJ 2: User on a Windows 11 ARM64 PC

* **Given**: An ARM64 Windows 11 machine; the fork's arm64 setup or portable build.
* **When**: The app starts and the user opens the runtime page.
* **Then**: Doctor/preflight report the native arch correctly (PowerShell probe, not `process.arch`), state the tier ("shell is native; the Android engine has no ARM64 build from Google"), and offer an explicit opt-in to attempt the x64 engine under emulation — one attempt, retry ladder disabled, expectations stated; declining leaves the app usable for management features without pretending the engine will work.

### CUJ 3: Fork self-update

* **Given**: An installed zApkStart of any flavor (x64 NSIS, x64 portable, arm64 NSIS/portable).
* **When**: The updater checks for releases.
* **Then**: It queries only `zeevrussak/zApkStart` releases, accepts only `zApkStart-*` assets, picks the asset matching its own binary arch, and the ~runtime bundle asset (`zApkStart-runtime-<tag>.zip`) is found by the provisioning path for first-boot runtime downloads.

### CUJ 4: Maintainer builds and verifies from source

* **Given**: The x64 dev box (no ARM64 hardware).
* **When**: `npm ci && npm test`, then `npx electron-builder --win nsis --arm64` (and the portable zip target).
* **Then**: Tests green; arm64 artifacts produced; a pure-Node PE check reads `Machine == 0xAA64`; an rcedit round-trip preserves the header; `dist/` greps clean of `RoutineMiku`/`ApkStart` identity strings outside the attribution allowlist.

## Technical Plan (Architecture)

Three new seams, everything else modified in place.

**1. `src/core/brand.js` — single identity constant module.** Exports `PRODUCT`, `APP_ID`, `AUMID_PREFIX`, `ASSET_PREFIX` (`zApkStart-`), `RUNTIME_PACK_REGEX`, `USER_AGENT`, `OWNER_GH`, `REPO`, `RELEASE_WEB/API`. All identity-bearing consumers derive from it (sources, updater, download UA, provision runtime-pack discovery, pack/incremental/msix output names, release workflow generation) so the rename can never drift apart again.

**2. `src/core/arch.js` — host-arch truth + runtime plan.** Detects the *machine* arch via a native probe (PowerShell `Win32_Processor.Architecture` — preflight already shells out to PowerShell; `process.arch` remains only as the binary's arch). Exports `runtimePlan()`:

```text
runtimePlan(hostArch, settings) =>
  x64   → { tier: 'supported',   imageAbi: 'x86_64',  qemuExe: 'qemu-system-x86_64.exe',
            accel: ['aehd','whpx','software'], assetSuffix: 'win64',  engineDefault: 'google-emulator' }
  arm64 → { tier: 'shell-native',
            imageAbi: 'x86_64',            # x64 engine under Windows emulation, opt-in only
            qemuExe: 'qemu-system-x86_64.exe',
            accel: ['software'],           # no WHPX/AEHD possible for x64 guests
            assetSuffix: 'win64',          # x64 runtime binaries, honestly labeled
            engineDefault: 'gate',         # capability gate; opt-in allowEmulatedEngine
            nativeEngine: 'research' }     # see docs/zapkstart/arm64-research.md
```

Consumers: `provision.js` (SYSIMG constants, `paths().qemuExe`, sysimg URL filters, AEHD gating), `emulator.js` (`imageChoice()` stops hardcoding `abi:'x86_64'`), `doctor.js`/`preflight.js` (capability gate + corrected remediation copy + arch-correct VC++ redist check), `layers.js`/`slim-runtime.js` (strip lists keyed by backend with a fail-loud guard), `updater.js` (asset pick by binary arch). The emulator URL filter `/windows_x64/` **stays on every host** — the ARM64 default deliberately runs the x64 engine.

**3. `src/core/i18n.js` + `src/core/locales/{en,he,zh-CN}.js` — one catalog, all surfaces.** CommonJS data modules (no fetch: CSP + `file://` make JSON fetch unreliable) delivered to the renderer through the preload bridge; `t(key, params)` in the main process and core modules (locale from `store`, `ui.locale` group — a *new* top-level settings group; `engine.locale` remains the guest Android locale); `data-i18n` attributes for static HTML with one bootstrap pass; `dir`/`lang` set on each document root from the resolved locale (Hebrew → `rtl`); tray/menu rebuilt on switch. Static HTML: `index.html`, `splash.html`, `shell.html`, per-locale manuals.

Error contract: core modules stop emitting prose-only errors that the renderer regex-matches. `friendlyInstallError`-class producers return `{ code, params, raw }`; the renderer composes localized guidance from the code. Core `t()` keeps human-readable messages flowing through existing IPC paths (log lines, toasts, doctor/autodebug reports).

```text
locale flow
  store.getSettings().ui.locale ('auto'|'en'|'he'|'zh-CN')
      │ resolve('auto') → OS UI language (Electron app.getLocale())
      ▼
  i18n.resolve() ──► main-process strings (tray, dialogs, notifications, core t())
      │ preload bridge (window.apkstart.i18n: table + locale + change event)
      ▼
  renderer bootstrap ──► document.dir/lang, data-i18n pass, t() in app.js/shell/splash
      │                      app.js error composition from {code,params}
      ▼
  guest Android: engine maps locale → `-change-locale` (he→he-IL), IME only for zh
```

**ARM64 tiering in the UI.** Doctor/preflight render the capability matrix; `runtime.allowEmulatedEngine` (settings) records the explicit opt-in. The opt-in path provisions the x64 runtime (which downloads the same `zApkStart-runtime-*.zip` bundle from the fork's releases), runs **one** boot attempt with the retry ladder disabled, and shows the expectation banner ("functional at best; minutes-long cold boot; unsuitable for games"). Default remediation copy on ARM64 never suggests WHPX/AEHD.

**Release shape.** Fork releases publish: `zApkStart-<tag>-win64-portable.zip`, `zApkStart-<tag>-win64-arm64-portable.zip` (runtime-less), `zApkStart-<v>-Setup.exe` (x64), `zApkStart-<v>-arm64-Setup.exe`, and `zApkStart-runtime-<tag>.zip` (x64 engine bundle, downloaded on first boot by every flavor). The 100 MiB Gitee-derived size gate is gone with Gitee.

**Docs and attribution layout** (per structural review): replaced `README.md` (EN, citation block + divergence list + capability matrix), `README.he.md`, `NOTICE.md`, add-only root `SITEMAP.md`, fork artifacts under `docs/zapkstart/`, manual sources under `docs/manual/{topics.json,en.md,he.md}` with `build-manual-html.py` extended `--locale` (topic-id-derived stable anchors; `manual.js` resolves per locale; in-app opens the right file).

**Data-path clean break**: `%APPDATA%\zapkstart` (was `%APPDATA%\apkstart`), `%USERPROFILE%\zApkStartShared` ↔ `/sdcard/zApkStartShared`, `zapkstart.avd`/`zapkstart.ini`, marker files `.zapkstart-ready`/`.zapkstart-force-full`, temp `zapkstart-bundle`. No migration; README documents incompatibility with upstream installs.

## Alternatives Considered

### Alternative A: Tracking fork (keep upstream merge-ability)

* **Pros**: upstream fixes arrive by merge.
* **Cons**: the i18n refactor rewrites string literals in the three largest files plus ~40 modules; line-level merges become hand-conflict resolution forever; the catalog design would be constrained by upstream's literal-first style.
* **Reason for rejection**: Rejected by author: hard fork declared; `upstream` remote retained for cherry-picking only.

### Alternative B: Freeze upstream data paths (`ApkStart` dirs, `apkstart.avd`)

* **Pros**: zero migration cost for hypothetical upstream-to-fork migrants.
* **Cons**: fork and upstream would share settings, runtime, AVDs, and the Android-visible shared folder on one machine — cross-contamination worse than the migration it avoids; and the fork has no existing users.
* **Reason for rejection**: Rejected by author: clean-break rename, incompatibility documented.

### Alternative C: x64-only builds; declare ARM64 unsupported outright

* **Pros**: smallest engineering surface; avoids shipping an engine tier nobody validated on hardware.
* **Cons**: fails the maintainer's explicit requirement for Windows 11 ARM64; the shell *can* be native and honest capability reporting has value on its own.
* **Reason for rejection**: Rejected by author: adopted partially — the engine layer is unsupported and says so; the shell ships native arm64 with the opt-in attempt.

### Alternative D: Ship a flag-gated `qemu-system-aarch64` native engine toggle

* **Pros**: would be genuinely native if it worked.
* **Cons**: ranchu machine absent from mainline QEMU, no maintained Windows-ARM64 QEMU distribution (Weil builds are x64-only), no host-side GL pipe for goldfish graphics, zero precedent in this codebase (the existing system-QEMU seam boots Android-x86 x86_64 ISOs); shipping it manufactures false hope and a fourth runtime mode with multiplicative doctor/preflight surface.
* **Reason for rejection**: Rejected by author: out-of-tree research doc with go/no-go gates instead (`docs/zapkstart/arm64-research.md`).

### Alternative E: Default "slow but works" x64-engine-on-ARM64

* **Pros**: one less settings state.
* **Cons**: TCG-inside-Prism is not "slow", it is non-functional for real apps; the upstream recovery ladder would re-enter the doomed profile for 10-minute windows and its remediation hints are impossible on ARM64.
* **Reason for rejection**: Rejected by author: explicit opt-in with ladder disabled and expectation banner instead.

### Alternative F: Full logical-property CSS rewrite for RTL

* **Pros**: maximum mirroring fidelity.
* **Cons**: days of diff noise across untouched declarations for invisible parity; flexbox/grid already mirrors via `dir`.
* **Reason for rejection**: Rejected by author: targeted fixes (~37 physical-property sites, grep-measured) with an allowlist-enforcing static test + screenshot pass.

### Alternative G: Drop zh-CN entirely

* **Pros**: one fewer locale in the key-parity test.
* **Cons**: the zh catalog falls out of the EN extraction nearly free; dropping it buys nothing under the hard-fork posture.
* **Reason for rejection**: Rejected by author: keep as untested byproduct with en fallback.

## Non-Functional Requirements

* **Security/privacy**: no new network endpoints beyond `zeevrussak/zApkStart` (GitHub) and existing dl.google.com SDK sources; the DNS default change *removes* a third-party default (Ali/Tencent) — now opt-in. No secrets added.
* **Rollout/rollback**: the fork has no users yet; the identity rename is free now and expensive after release (post-release renames would need migration — recorded in NOTICE.md as a constraint). Upstream data dirs are never touched by the fork.
* **Performance**: no runtime hot paths change; i18n lookup is a plain object read; the guest-locale change costs one cold boot on first switch (upstream's existing snapshot-invalidation seam).
* **Honesty budget**: every ARM64-facing string states what is verified (shell) vs. not (engine on this hardware); the README carries the same matrix.

## Additional Resources

* `docs/zapkstart/concepts_brief.md` — six-lens goldfish synthesis (predecessor doc; alternatives and file-level inventory live there and in `review.md`).
* Verified SDK index facts (2026-11-23): `repository2-3.xml` (emulator windows x64-only, platform-tools win x64), `sys-img/google_apis_playstore/sys-img2-3.xml` (arm64-v8a-34_r14.zip present, host-agnostic, HTTP 200).
* Upstream seams reused: `emulator.js:459-468` (`hw.cpu.arch` ABI mapping), `provision.js` system-QEMU + override-URL settings, `engine.js` guest-locale + snapshot-invalidation machinery, `preflight.js` PowerShell shell-out.

## Future Improvements

* **The idea**: if the ARM64 research gates ever pass (ranchu in mainline QEMU + maintained WoA build + image boots under software GL), promote `arm64-research.md` into a real backend design with an `-M virt`/ranchu device set, `-machine virt` + `virtio-gpu` decision, and an arch-keyed AVD namespace (`zapkstart-arm64.avd`) so x86_64 and arm64 snapshots never collide.

--------------------------------------------------------------------------------

## Detailed Implementation Plan

Ordering constraints: identity (1) before ARM64 release work (5); error codes (3a) before core-string translation (3c). Commit sequence follows the numbering.

### Phase 1 — Identity and attribution

#### 1. `src/core/brand.js` (Create)

* **Type / Scope**: Core constants module (CJS, header-commented, no electron import).
* **Proposed changes**: `PRODUCT='zApkStart'`, `APP_ID='com.zapkstart.app'`, `AUMID_PREFIX='zApkStart'`, `ASSET_PREFIX='zApkStart-'`, `RUNTIME_PACK_REGEX`, `USER_AGENT='zApkStart/<v> (Windows)'`, `OWNER_GH='zeevrussak'`, `REPO='apkstart'`, release API/web URLs, data-dir names.

#### 2. `src/core/sources.js` (Modify)

* **Type / Scope**: Update-source manager.
* **Proposed changes**: import brand constants; delete `OWNER_GITEE`, `SOURCES.gitee`, mirror-list wiring stays (GitHub-only mirrors); `fetchReleases()` returns GitHub-only; whitelist `^zApkStart`; synthetic asset names from brand; UA from brand; rate-limit strings via `t()` (Phase 3).

#### 3. `src/core/updater.js` (Modify)

* **Proposed changes**: owner/repo/releasesUrl from brand; asset pick arch-aware (binary `process.arch` → `-arm64-` assets); marker files `.zapkstart-ready`/`.zapkstart-force-full`; user-facing strings via `t()`.

#### 4. `src/core/download.js` (Modify)

* **Proposed changes**: UA from brand.

#### 5. `src/core/provision.js` (Modify)

* **Proposed changes**: `ghReleaseApi/Page` → fork (Gitee fields deleted); runtime-pack regex from brand; error strings via `t()` (Phase 3); arch parameterization in Phase 5.

#### 6. `package.json` (Modify)

* **Proposed changes**: `name zapkstart`, `productName zApkStart`, `version 0.6.4-zk.1` (semver prerelease; MSIX/pe four-segment derivation strips the `-zk.1`), EN description, `author` maintainer + `contributors: ["RoutineMiku"]`, repository/homepage/bugs → fork; delete `build:appx` script; `test` script extended with the new suites.

#### 7. `electron-builder.yml` (Modify)

* **Proposed changes**: `appId com.zapkstart.app`, `productName zApkStart`, copyright "zApkStart contributors"; `files` += `@napi-rs/lzma-win32-arm64-msvc/**`; `electronLanguages: [zh-CN, zh-TW, en-US, he]`; `win.target`: nsis x64 + nsis arm64 + zip arm64 with `${arch}` artifact names; `nsis.installerLanguages: [english, hebrew]`, `displayLanguageSelector: true`; `appx` section **deleted**; comment pinning `extraResources` runtime as x64-content-by-necessity; linux block kept with an "unsupported in fork" comment.

#### 8. `src/main.js` (Modify)

* **Proposed changes**: `APP_AUMID = AUMID_PREFIX` from brand; per-app AUMIDs via `installer.js`; login-item name; help link → fork README; tray/notification/dialog strings via `t()` (Phase 3).

#### 9. `src/core/assoc.js` (Modify) — PROGID `zApkStart.apk`, `HKCU\Software\zApkStart`, localized display strings.
#### 10. `src/core/installer.js` (Modify) — AUMID prefix from brand; Start-Menu folder `zApkStart`; shortcut description `t()`; temp dir `zapkstart-bundle`.
#### 11. `src/core/leftovers.js` (Modify) — cleanup regexes/names track brand (`zApkStart.exe`, `Programs\zApkStart`, `^zApkStart/` temp files, `zapkstart` snapshot dir).
#### 12. `src/core/store.js` (Modify) — `DATA_DIR %APPDATA%\zapkstart`, `sharedDir %USERPROFILE%\zApkStartShared`, `deviceSharedDir /sdcard/zApkStartShared`, `AVD` name constant, `DEFAULT_SETTINGS` += `ui: { locale: 'auto' }` and `runtime.allowEmulatedEngine: false`; `fastDns` default **false**.
#### 13. `src/core/emulator.js` (Modify) — `AVD_NAME/SNAPSHOT_NAME 'zapkstart'`, `avd.ini.displayname` (Phase 5 for imageChoice).
#### 14. `src/core/engine.js` (Modify) — `'apkstart.avd'` literal → shared constant (Phase 3 for guest locale).
#### 15. `src/core/sharer.js` (Modify) — shared-dir names follow store constants; strings via `t()`.
#### 16. `src/core/windowctl.js`, `src/core/win/agent.ps1`, `src/core/win/priority.ps1` (Modify) — window title, `-Avd` default, temp-file names track brand.
#### 17. `build/pack.js` (Modify) — output names/exe/rcedit strings from brand; `KEEP_LOCALES` += `he`; electron-dist path stays x64 with a comment.
#### 18. `build/incremental.js` (Modify) — asset names from brand.
#### 19. `build/msix.js` (Modify) — defaults neutralized (`PLACEHOLDER_PUBLISHER`), fork display name defaults, env-only override contract kept; `ProcessorArchitecture` stays `x64`.
#### 20. `build/installer.nsh` (Modify) — `zApkStart.lnk`, `taskkill /IM zApkStart.exe`, `LangString` EN/HE for DetailPrint + shortcut description.
#### 21. `build/slim-runtime.js` + `src/core/layers.js` (Modify) — strip lists keyed by backend selector; fail-loud guard if the standalone `qemu/` dir ever appears in a strip candidate.
#### 22. `.github/workflows/release.yml` (Modify) — asset names `zApkStart-*`; Gitee sync step deleted; **new arm64 job** (x64 runner, `--win nsis --arm64` + zip target, PE-header gate) and the x64 runtime bundle published as `zApkStart-runtime-<tag>.zip`.
#### 23. `.github/workflows/backfill-release-notes.yml` (Delete); `tools/publish-gitee.js` (Delete); `tools/backfill-gitee-notes.js` (Delete); `tools/store-open.ps1` (Delete); `dist.lnk` (Delete); `.github/release-notes-v*.md` (Delete — upstream release notes).
#### 24. `NOTICE.md` (Create) — fork identity, upstream URL @ v0.6.4, upstream copyright preserved, fork modification copyright, divergence pointer, no-impersonation statement.
#### 25. `README.md` (Replace) + `README.he.md` (Create) — fork README with language switcher, fork-of line, feature summary, capability matrix (x64 supported / ARM64 tiers), build instructions, citation block (upstream repo @ v0.6.4, MIT, divergence list), license section.
#### 26. `SITEMAP.md` (Create) — add-only registry: fork-managed docs vs inherited upstream docs.
#### 27. `src/ui/index.html` (Modify) — About tab: remove WeChat/Douyin QR images and links; localized attribution block ("based on ApkStart by RoutineMiku, MIT"); identity strings (Phase 3).
#### 28. `src/ui/assets/wechat-qr.jpg`, `douyin-qr.jpg` (Delete); `build/logo.html` (Modify) + icon regeneration — distinct zApkStart logo via existing render pipeline (fallback: programmatic draw via `src/core/png.js`); `docs/images/brand.png` unused by fork README.

### Phase 2 — Arch seam and ARM64 behavior

#### 29. `src/core/arch.js` (Create)

* **Proposed changes**: `hostArch()` (PowerShell `Win32_Processor.Architecture`, cached; `process.arch` fallback labeled binary-arch), `runtimePlan()` per the architecture section, `isEmulatedEngineAllowed(settings)`.

#### 30. `src/core/provision.js` (Modify) — SYSIMG/qemuExe/sysimg filters from `runtimePlan()`; AEHD branch x64-only; arm64 default gate (no provisioning until opt-in); VC redist detection arch-aware (`doctor.js` sibling change).
#### 31. `src/core/emulator.js` (Modify) — `imageChoice()` from plan; accel ladder skipped when `tier !== 'supported'` (single attempt, banner); strings via `t()`.
#### 32. `src/core/doctor.js` (Modify) — capability gate + corrected remediation copy per tier; VC++ check `VC\Runtimes\<arch>` + `vc_redist.<arch>.exe` branch; report header via `t()`.
#### 33. `src/core/preflight.js` (Modify) — arch fixture from `arch.js`; action labels via `t()`; ARM64 verdict copy.
#### 34. `src/core/drivers.js` (Modify) — arch field from `arch.js`; ARM64 profiles exclude WHPX/AEHD advice.
#### 35. `scripts/check-pe-arch.js` (Create) — pure-Node PE reader (`e_lfanew` → `Machine == 0xAA64`) for the CI arm64 gate; rcedit round-trip re-check.

### Phase 3 — Localization architecture

#### 36. `src/core/i18n.js` (Create)

* **Proposed changes**: `resolve(locale)`, `t(key, params)` with `{placeholder}` interpolation, fallback chain he/en→en→key, `dirFor(locale)` (`rtl` for he), OS-detect for `auto`; no electron import.

#### 37. `src/core/locales/en.js`, `he.js`, `zh-CN.js` (Create)

* **Proposed changes**: flat key→string tables; identical key sets enforced by test; params as `{name}` placeholders; zh authored by extraction from upstream strings.

#### 38. `src/core/store.js` (Modify) — `ui.locale` validation/coercion in settings normalization (mirrors existing group validation).
#### 39. `src/preload.js`, `src/splash-preload.js` (Modify) — expose `i18n: table, locale, dir, onChange` through the existing bridge shape.
#### 40. Core error-code contract — `src/core/adb.js`, `src/core/provision.js`, `src/core/installer.js` (Modify)

* **Proposed changes**: `friendlyInstallError`/`guardDisk`/installer pipeline return `{code, params, raw}`; renderer stops regex-matching prose (`app.js:509-527` matchers deleted, composition from codes).

#### 41. Core-string extraction pass — `adb.js`, `autodebug.js`, `doctor.js`, `download.js`, `emulator.js`, `engine.js`, `gpupref.js`, `incremental.js`, `installer.js`, `leftovers.js`, `manual.js`, `notify.js`, `preflight.js`, `provision.js`, `sources.js`, `updater.js`, `userdata.js`, `store.js` (Modify)

* **Proposed changes**: every quoted user-visible Han string becomes `t('module.key')`; keys grouped `module.*`; en + he + zh authored; comments untouched; existing Chinese-asserting tests get explicit locale pins (`test/engine-test.js:232-241`, `test/preflight-test.js` labels).

#### 42. Renderer extraction pass — `src/ui/app.js`, `index.html`, `shell.html/js`, `splash.html/js` (Modify)

* **Proposed changes**: `data-i18n` sweep on static HTML + bootstrap pass; `t()` for the ~141 toast calls, 74 textContent assignments, 12 innerHTML builders, `relTime()` locale-aware; `menu.style.left` RTL flip; `unicode-bidi: plaintext` on mixed-content surfaces (paths, package names, log lines); About/manual/download-source strings.

#### 43. `src/main.js` localization (Modify) — tray labels, update dialog, notifications, boot tips, window titles via `t()`; tray rebuild on locale change (existing rebuild hook).
#### 44. `src/ui/style.css`, `theme.css`, `shell.css`, `splash.css` (Modify) — logical-property conversion for the ~37 physical sites; deliberate LTR allowlist (caption-button `padding-right:148px`, `style.css:54`); no mirrored stylesheets.
#### 45. `build/installer.nsh` (Modify) — LangString EN/HE (see 20).
#### 46. `electron-builder.yml` + `build/pack.js` locale lists (Modify) — `he` added in both filters (same commit).
#### 47. `test/i18n-test.js` (Create) — key-set parity en/he/zh, placeholder parity, non-empty values, fallback resolution, `dirFor`, Han-leak scanner (src/main.js, src/ui/*.js, src/core/*.js with allowlist file), `data-i18n` coverage parse of the four HTML files.
#### 48. `test/rtl-css-test.js` (Create) — physical `left/right` property allowlist enforcement.
#### 49. `test/identity-gate-test.js` (Create) — repo-wide grep gate: no `RoutineMiku|ApkStart|daily-miku` literals outside the attribution allowlist (LICENSE, NOTICE.md, READMEs, docs/zapkstart, `locales/zh-CN.js`, upstream-inherited docs listed in SITEMAP.md).

### Phase 4 — Guest Android locale + network defaults

#### 50. `src/core/engine.js` (Modify) — guest locale map from `ui.locale` (`he→he-IL`, `en→en-US`, `zh-CN→zh-CN`, `auto→host`); PinyinIME gate `locale === 'zh-CN'`; reuse `_ensureSystemLocale` snapshot-invalidation path (one-time marker per locale change); log strings via `t()`.
#### 51. `src/core/store.js` (Modify) — `fastDns` default `false` (setting retained); settings UI label via `t()`.

### Phase 5 — Manual pipeline

#### 52. `docs/manual/topics.json` (Create) — canonical topic-id → per-locale heading map; `build-manual-html.py` extended `--locale en|he|zh-CN` emitting `manual.html` (zh, path unchanged), `manual.en.html`, `manual.he.html` (`dir="rtl"`); stable topic-id anchors.
#### 53. `docs/manual/en.md`, `he.md` (Create) — EN translation of `docs/USER-MANUAL.md` content (fork-flavored: zApkStart names, ARM64 capability section, no upstream socials); HE translation.
#### 54. `src/core/manual.js` (Modify) — per-locale titles/anchors via topics.json; `openManual(locale)` picks the file; strings via `t()`.
#### 55. `src/main.js` (Modify) — manual window opens the locale-correct file; `test/manual-test.js` extended to validate anchors in all three outputs.

### Phase 6 — Tests and CI

#### 56. Existing test updates — `test/auto-test.js` (AUMID/AVD/gitee assertions → fork values), `test/engine-test.js` (`:152` qemu exe name parameterized, `:198-208` SOURCES shape, `:222-228` AVD arch cases, `:232-241` locale pin), `test/preflight-test.js` (arch fixture + arm64 case + label pins), `test/settings-categories-test.js` (`:121` storage keys), `test/manual-test.js` (three locales), `test/resources-test.js`/`standalone-test.js` (temp names).
#### 57. `test/arch-test.js` (Create) — `runtimePlan()` per arch, probe caching/fallback, gate behavior (opt-in respected, ladder disabled).
#### 58. `.github/workflows/ci.yml` (Modify) — run the new suites (they ride `npm test`); add the arm64 cross-build job (x64 runner): `npm ci`, `npx electron-builder --win nsis --arm64 --dir` verification build + `node scripts/check-pe-arch.js` gate.

### Verification Plan

* **Unit/build**: `npm ci` (with `ELECTRON_SKIP_BINARY_DOWNLOAD=1` in CI for speed); `npm test` green — 16 existing suites (with rewritten tripwires) + 6 new (`i18n`, `rtl-css`, `identity-gate`, `arch`, manual-anchor extension, PE gate run in CI only).
* **Cross-build**: on the x64 dev box — `npx electron-builder --win nsis --arm64 --dir` (or zip fallback) → `node scripts/check-pe-arch.js dist/...` asserts `0xAA64`; rcedit round-trip re-verified; `dist` tree identity grep clean.
* **Manual QA list** (x64 dev box, real Electron): EN/HE switch across main/empty/settings/welcome/manual/toast screens; RTL screenshots; tray rebuild; NSIS wizard in both languages; guest Android shows `he-IL` after locale switch (one cold boot); updater against a fork release.
* **Explicitly unverifiable here** (documented in README capability matrix + this design): real ARM64 hardware engine boot/performance, WHPX-on-ARM64, he-RTL system chrome on ARM64, MSIX arm64 store submission, qemu-aarch64 native engine (research).

*Drafted with EGM*
