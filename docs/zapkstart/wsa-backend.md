# WSA / external-adb-device backend

* **Author:** Ze'ev Russak (@zeevrussak)
* **Status:** Approved for implementation (EGM round 2: design-critic + codebase-details + implementation-readiness lenses, 2026-11-24)
* **Related:** `docs/zapkstart/design.md` (fork design), `docs/zapkstart/arm64-research.md` (native-engine gates), `docs/backend-roadmap.md` (upstream's 0.5.6 "WSA 不接" verdict — this document reverses it for the fork, with rationale)

## Overview

Add an **external-adb-device backend** to zApkStart. Its first instance is **WSA** (Windows Subsystem for Android, community builds): on Windows ARM64 hosts WSA runs native ARM64 Android 13 in a Hyper-V VM — no CPU emulation — at a quality tier the QEMU opt-in can never reach. The backend is deliberately shaped as a generic `adb connect <ip:port>` endpoint so redroid (WSL2-ARM64 container Android) and even a physical phone over TCP can slot in later with near-zero backend code.

**Detect-only, never bundle:** zApkStart never downloads or ships Microsoft's WSA binaries. It detects an installed WSA, links out (neutral wording, explicit click) to Microsoft's documentation and to the community continuation (MustardChef/WSABuilds), and otherwise operates the subsystem purely over adb.

**This reverses a documented upstream verdict.** v0.5.6 removed every third-party backend (WSA named explicitly) after "顺手接管" failures, and wrapped the removal in five enforcement layers: the backend registry ignores `engine.mode`, `store.js` rewrites `engine.mode` to `'builtin'` on every read, `standalone-test.js` asserts the registry shape by source, shipped UI copy promises "WSA are never used", and upstream docs/backend-roadmap.md (removed from this tree; visible in upstream history) recorded WSA as "❌ 不可行" (support ended; **Hyper-V conflicts with AEHD**; repack compliance). The fork reverses this deliberately: the anti-grab guarantee is **kept but narrowed** — WSA mode is opt-in by explicit settings selection, honored only when the package probe confirms the install, and never auto-selected.

## The Problem

On Windows ARM64 the fork ships a native shell whose only engine tier is an explicit opt-in into x64-engine-under-Windows-emulation — software-translated twice, unusable for real apps. Google publishes no Windows-ARM64 emulator binaries (issue 264614669, open for years); mainline QEMU cannot boot ranchu/goldfish images. Meanwhile WSA — which Microsoft built, shipped, then abandoned — is precisely a native-ARM64 Android with freeform app windows and an adb endpoint (`127.0.0.1:5855`), kept installable by an active community continuation. The fork's entire value pipeline (parse → install → resolve launcher → launch) is adb-first. The gap is not capability; it is a backend seam, per-app routing, and honest capability reporting.

## Goals

* Engine mode `wsa`: opt-in, detect-only, adb-transport-only. Apps installed into WSA launch in **WSA's own freeform windows** (no reparenting, no embedding, no snapshots, no panel rotation, no keymap hooks — WSA-native behaviors, documented in settings copy).
* Per-app `backend` field in `apps.json` (`builtin` default, read-time resolution — no migration); `--launch`/shortcuts/uninstall route by the app's backend; `engine.mode` gates the *engine selector*, not per-app routing.
* On ARM64 hosts with WSA detected, doctor/preflight promote "run apps via WSA" as the recommended tier (capabilities, not a new `tier` value — `arch.js` `tier` stays untouched so the QEMU gate cannot reopen).
* ABI-direction inversion: on WSA the compat-image machinery never fires; x86-only APKs fail with an ARM-device explanation, ARM-compatible APKs install natively.
* Localized EN/HE/zh-CN copy for every new surface; the "WSA are never used" promise is rewritten per mode.
* All logic verifiable on the x64 dev box via fake-transport unit tests; real-WSA behaviors listed as a manual checklist (see Verification).

## Non-Goals

* Bundling, downloading, or auto-installing WSA binaries (license and endorsement risk).
* Window management of WSA freeform windows: no titlebar, no bounds memory, no AUMID/taskbar identity switching (the visible window carries WSA's identity — stated in docs), no keymap/pointer hooks (shell window never focused; panel geometry assumptions don't hold on resizable windows).
* Display surgery on the guest: `wm size/density/rotation` mutate WSA's **subsystem-global** display shared with the user's own windows — suppressed in this mode.
* Play Services guarantees: core-lane WSA builds have no GMS; GMS-dependent apps surface a first-class caveat, not a compat-image promise.
* Auto-selection: WSA is never chosen because "it's there" — only by explicit settings action.

## Open Questions

* **Spike `wsa-start-adb-port` (needs a real WSA machine):** (1) does `explorer.exe shell:AppsFolder\MicrosoftCorporationII.WindowsSubsystemForAndroid_cw5n1h2txyewy!Microsoft.WindowsSubsystemForAndroid` boot the VM fast enough for a 90 s connect budget; (2) default adb port across current WSABuilds variants (5855 canonical, 5555 seen — try both once, persist the working port in `engine.wsaPort`); (3) first-run state of the Developer-settings ADB toggle (expected off → the persistent guidance state `needs:'wsa-adb-toggle'`).
* **GApps-lane health** (WSABuilds GApps builds crashing on Win11 after June 2025): settings copy must not promise Play.

## Technical Plan (Architecture)

The transport needs **zero new abstraction** — `AdbClient` is serial-neutral (`-s <serial>` on every exec; `connect()` auto-fires for any serial containing `:`) and the fork's dedicated adb server (port 5044) is the connection broker. The real seam is `src/core/backends/` — a `Backend` base class (`probe/check/ensure→{serial,client}/stop/windowTargets/caps/usage/dataInfo/dispose`) with a registry that today hard-forces `'builtin'`. `WsaBackend` extends it.

```text
settings.engine.mode: 'builtin' | 'wsa'     (store.js: exact-match allowlist;
                                             everything else still coerces)
        │
        ▼
backends/index.js create() ── mode==='wsa' AND probe.found ──▶ WsaBackend
        │                                                     else BuiltinBackend
        ▼
WsaBackend.ensure({onLog}) ─▶ { ok, serial:'127.0.0.1:<port>', client, engine:'wsa' }
        │   (syncSerial → runtime.emuSerial; mirror BuiltinBackend.syncSerial)
        │   state machine: not-installed │ vm-stopped → AUMID start → poll 90s
        │                │ adb-toggle-off → needs:'wsa-adb-toggle'
        │                │ booting(offline) → poll │ device → ready
        ▼
Runtime.client() ── every existing adb-only pipeline (installer, sharer,
                     screenshots, launch retry) keeps working unchanged
```

**Dispatch rules (the 6 Runtime branch points):** `_ensureInner` first line routes `backendId==='wsa'` to `backend.ensure`; `stop()` = `adb disconnect` only (**never** `emu kill`/console-port taskkill — the port-1 arithmetic would `taskkill` whatever listens on 5854); watchdog idle on wsa = disconnect, never VM shutdown; `adoptExisting`/`killOrphanEmulators`/prewarm-provisioner checks guarded by backendId; `status()` reports `{mode:'wsa', vmRunning, deviceOnline, ready}`.

**Backend-conditional installer behavior** (`abiDirectionFor(engine, meta, abilist)` — pure helper):
* builtin: existing ladder unchanged.
* wsa: `switchToCompat`/`ensureCompatImage` **never fire**; snapshot ops skipped; `NO_MATCHING_ABIS`/pre-switch on x86-only APK → `installer.wsa_x86_only` ("this device runs ARM Android; this APK is x86-only"); ARM apps install natively; if the WSA build lacks ARM translation → `installer.wsa_arm_translation` (point to ARM-enabled WSABuilds variants).
* Launch: `rt.engine==='wsa'` skips network wait/repair (existing `rt.engine` key already does this for free), display surgery (`resetDisplayOverrides`/`setOrientation`/`beforeStart`/`prepareForeground` display parts), and snapshot calls.

**Routing before `ensure()`:** `launchOne`/uninstall resolve `appBackend = store.getApp(pkg)?.backend || 'builtin'` **before** any `runtime.ensure()` — mismatch (`appBackend !== settings.engine.mode`) short-circuits with error copy + an explicit one-click "Reinstall for <other engine>" (APK backup already exists); **never** a silent reinstall (diverging data). `adb kill-server` on the shared 5044 server is gated while a wsa transport is active (it would wipe the WSA registration).

**Doctor/preflight:** wsa branch never renders accel/AVD/snapshot advice; adds (1) Developer-mode ADB toggle guidance for `needs:'wsa-adb-toggle'`, (2) "core lane = no Google services" caveat, (3) on x64 hosts: the **Hyper-V↔AEHD interaction** — enabling WSA turns on Hyper-V which disables AEHD for the builtin engine (doctor explains the cause; both engines remain usable, QEMU falls to WHPX/software). Preflight cards on ARM64: WSA found → "recommended: run apps via WSA" card; absent → guidance card with the neutral link.

**Link-out wording (legal):** neutral, never "recommended", never auto-opened: EN "Microsoft ended WSA support in March 2025; a community continuation exists (not affiliated with or endorsed by Microsoft): MustardChef/WSABuilds. Review its terms before installing." Links via `shell.openExternal` behind an explicit user click only.

**Settings UI:** engine segmented control (Bundled runtime / WSA) rendered only when `detectWsa()` reports found; switching warns that installed apps don't migrate and AEHD may be affected on x64; the `sub_runtime_only` promise text becomes mode-accurate in all three locales; selector never named `setEngineMode` (standalone-test bans it) — use `setEngineBackend`.

**Sharer:** v1 scoping — shared-state keys gain the serial (`<serial>:<relpath>`) so QEMU and WSA states don't cross-contaminate; sync works over the adb transport.

**autodebug:** skip orphan-emulator/snapshot/accel/orphan-classes on wsa mode; keep adb-state class (device offline, unauthorized).

**arm64 research note:** WSA is now the *recommended* no-emulation ARM64 answer; the mainline-QEMU research gates in `arm64-research.md` stay, re-scoped as the fully-open-source alternative (redroid-in-WSL2-ARM64 documented alongside as the second open route — same adb-endpoint backend, expert setup, no MS dependency).

## Alternatives Considered

### A: Strategy branches inside Runtime (no new backend class)

* **Pros**: no registry/test changes.
* **Cons**: ~21 guarded branch points across engine.js/main.js/installer.js; every future backend re-splits them.
* **Reason for rejection**: the `backends/` seam already exists with exactly the needed shape (CAPS included, `sharedHost` cap already present); 15 branch points vs one 300-line class.

### B: Transport-object abstraction inside AdbClient

* **Cons**: AdbClient is already transport-agnostic (`adb -s <serial>`); no protocol difference to abstract.
* **Reason for rejection**: pure churn.

### C: Keep upstream's "WSA 不接" verdict; ship only the Prism opt-in on ARM64

* **Pros**: zero engineering; matches upstream's documented stance (support ended; AEHD interaction; compliance).
* **Cons**: the fork's ARM64 tier stays unusable-in-practice; WSA is the only productized native no-emulation stack on this platform.
* **Reason for rejection**: rejected by author — the fork exists to make Windows ARM64 real; detect-only + link-out keeps the compliance concern manageable.

### D: redroid-in-WSL2-ARM64 as the first instance instead of WSA

* **Pros**: fully open source (no MS binaries question); native ARM64; adb endpoint identical.
* **Cons**: expert setup (custom WSL2 kernel with binder modules), software rendering, scrcpy-based display, no Play; immature on WSL2 6.6 (long-boot reports).
* **Reason for rejection**: real but not productized; keep as the documented second instance of the same backend (zero backend-code delta).

## Non-Functional Requirements

* **Safety**: `stop()` must never `taskkill` by derived port (5855-1) — disconnect-only; `adb kill-server` gated while external transports are live; watchdog never stops a user-managed VM.
* **Honesty**: every WSA-facing string states what works (native ARM64 apps, freeform windows) vs what doesn't (x86-only apps, GMS-dependent apps, Play certification).
* **Rollback**: additive apps.json field + opt-in mode + untouched `tier` ⇒ rollback = flip mode back to builtin; apps installed into WSA remain WSA-side, flagged `backend:'wsa'`, handled by the mismatch UX.

## Verification Plan

* **Unit (this box)**: `test/wsa-test.js` — probe-output parsing fixtures; state machine with injected fake probe/AdbClient (not-installed / vm-stopped→toggle-timeout / offline→device / unauthorized); serial sync identity (`runtime.client()` reuse); mode-coercion matrix (`wsa` survives, `mumu` coerced); `abiDirectionFor` truth table incl. compat-spy (no image download attempted); `routeForApp(app, mode)` four-combo table; doctor/preflight card assertions with `_setHostArchForTest`/`_setWsaProbeForTest`; locale key parity via `i18n-test`.
* **Gates**: identity / i18n (leak scan incl. new namespaces) / rtl-css / arch all green; `standalone-test` rewritten to assert the NEW invariants (mode honor w/ probe, wsa.js presence, coercion exact-match, selector naming) replacing the five old ones.
* **Manual (gated on a WSA machine — the `wsa-start-adb-port` spike)**: VM boot latency vs 90 s budget; AUMID start side-effect window; Developer-toggle first-run state; port discovery (5855/5555); install→launch→screenshot→freeform-window smoke; x64 WSA + AEHD interaction; GApps-lane behavior.
* **Unverifiable here, documented**: real ARM64 WSA hardware performance; Store/MSIX context.

## Detailed Implementation Order

1. **Phase 0** (pure-Node, ships alone): `arch.js detectWsa()` + `_setWsaProbeForTest`; `store.js` coercion exact-match (`wsa` allowed) + `engine.wsaPort` default; `test/wsa-test.js` phase-0 cases.
2. **Phase 1**: `backends/wsa.js` (probe/check/ensure state machine/stop=disconnect/caps={}/syncSerial); `backends/index.js` registry + conservative mode honor; `engine.js` 6 dispatch edits (`_ensureInner`, `stop`, `prewarm` gate, adopt/orphan guards, `status()`, watchdog idle→disconnect); kill-server gating; `test/wsa-test.js` phase-1 (fake transport).
3. **Phase 2**: installer.js app record `backend` field; `main.js` routing before ensure (`routeForApp` pure helper) + mismatch UX + prewarm/autoDeploy guards; sharer serial-scoped state.
4. **Phase 3**: installer ABI inversion (`abiDirectionFor`) + launch-path wsa skips; doctor wsa branch (+AEHD interaction note on x64); preflight cards; settings selector + copy rewrite (`sub_runtime_only` per mode) in all three locales; `ui/engine`+`installer`+`doctor`+`preflight` locale keys.
5. **Phase 4**: `standalone-test` rewrite (new invariants); `test/wsa-test.js` completion; full `npm test` + gates; `arm64-research.md` + README capability-matrix updates; this doc's spike checklist for a WSA machine.

*Drafted with EGM.*
