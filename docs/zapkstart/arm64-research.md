# Native ARM64 Android engine on Windows — research notes

Status (2026-11-24): **research only — nothing in this document ships in the product.**
zApkStart on ARM64 hosts runs the x64 engine only behind the explicit "try anyway" opt-in
(see `docs/zapkstart/design.md` §Technical Plan). This note records what a genuinely native
ARM64 path would require, and the go/no-go gates before any engineering starts.

**Re-scope (2026-11-24, `docs/zapkstart/wsa-backend.md`):** WSA is now the *recommended*
no-emulation ARM64 answer — an opt-in, detect-only backend (`wsa`, adb transport to
`127.0.0.1:5855`) drives the community-continued Windows Subsystem for Android as a native
ARM64 Android 13 subsystem. The mainline-QEMU gates below stay, re-scoped as the
**fully-open-source alternative**: redroid-in-WSL2-ARM64 is documented alongside as the second
open route (same adb-endpoint backend, near-zero backend-code delta, expert setup, no Microsoft
dependency). Nothing here reopens the QEMU gates in the product (`arch.js tier` untouched).

## Why the obvious paths fail today

| Path | Verdict | Evidence |
| --- | --- | --- |
| Google Android Emulator, ARM64 Windows build | Does not exist | `dl.google.com/android/repository/repository2-3.xml` lists `emulator-windows_x64-*.zip` only, with explicit `<host-os>` tags (checked 2026-11-23). macOS has `darwin_aarch64`; Windows does not. |
| Google's emulator images on mainline QEMU (`qemu-system-aarch64`) | Not bootable today | Google's images are ranchu/goldfish targets: they need the emulator's QEMU fork — the `-M ranchu` machine, goldfish address-space/sync/PSTORE devices, the `kernel-ranchu` the provisioning code references (`provision.js:982`), and the host-side OpenGL pipe (OpenglEsTranslator → goldfish gralloc/HWC). Mainline QEMU has partial goldfish devices (pipe/tty/rtc/battery/nand/timer) but no ranchu machine and no host GL path. Booting Play images on mainline is ongoing Linaro research. |
| QEMU Windows-ARM64 binaries from a trusted source | No maintained first-party build | QEMU's official Windows channel (weilnetz, which upstream apkstart uses) publishes `qemu-w64-setup-*.exe` — x64 hosts only. MSYS2 `clangarm64` builds are unofficial and unpinned. |
| Android-x86 on ARM64 host | N/A | Android-x86 publishes x86/x86_64 only. |
| x64 engine under Windows-on-ARM x64 emulation | Runs, unusable | WHPX on ARM64 virtualizes ARM64 guests; AEHD is x86_64-only. The x64 `qemu-system-x86_64` therefore falls back to TCG — and TCG's own x64 JIT is itself translated by Prism. The app's boot timeout (600 s) and retry ladder model this as "no hypervisor", not as "no platform". |
| arm64-v8a Google Play system images | Exist, host-agnostic, unusable without a host | `sys-img/google_apis_playstore/sys-img2-3.xml` serves `arm64-v8a-34_r14.zip` (verified HTTP 200) — but for Google's emulator hosts. |

## Go/no-go gates

Engineering on a native ARM64 backend starts only when **all three** hold:

1. **Machine**: a mainline QEMU release ships a ranchu-compatible machine type (or a maintained
   fork with ranchu + goldfish devices publishes signed Windows-ARM64 builds).
2. **Binaries**: a reputable, pinned source of `qemu-system-aarch64` for Windows ARM64 exists
   (mainline release artifact, MSYS2 clangarm64 pin, or self-built from the QEMU source tree with
   a documented toolchain).
3. **Boot proof**: one Google Play arm64 image (`arm64-v8a-34_r14.zip`) — or an AOSP/GSI arm64
   alternative with a documented boot chain — boots to the lock screen under software rendering on
   an ARM64 Windows host in a manual spike.

## Spike plan (manual, out-of-tree; never shipped)

1. On an ARM64 Windows 11 machine (physical, not VM), obtain QEMU: `pacman -S mingw-w64-clang-aarch64-qemu`
   in an MSYS2 CLANGARM64 environment, or build from source.
2. Download `arm64-v8a-34_r14.zip`, extract, and inspect the image's kernel (`kernel-ranchu`) and
   ramdisk; check whether it boots at all with `-M virt` and a mainline ARM64 kernel; then attempt
   the ranchu device set if the build has it.
3. Record: kernel panic point, missing device errors, graphics path (SwiftShader/guest GL), boot time.
4. If the guest reaches the launcher: benchmark cold boot and one app launch; compare against the
   x64-under-emulation baseline.

## If the gates pass someday

Promote this file to a real backend design: arch-keyed AVD namespace (`zapkstart-arm64.avd` so
x86_64 and arm64 snapshots never collide — snapshots are machine-type-bound), arch-keyed runtime
manifest (`arch.js runtimePlan()` already returns the slot for it: `nativeEngine`), provisioning
source for the chosen QEMU build, and honest GPU expectations. Until then, `arch.js` reports
`nativeEngine: 'research'` and the UI says exactly that.

## Sources

* Google SDK repository index (emulator + platform-tools, host-os tags):
  <https://dl.google.com/android/repository/repository2-3.xml>
* Google Play system image index (arm64-v8a availability):
  <https://dl.google.com/android/repository/sys-img/google_apis_playstore/sys-img2-3.xml>
* QEMU ARM system emulator docs: <https://www.qemu.org/docs/master/system/target-arm.html>
* Linaro's Android-on-QEMU / Arm enablement notes:
  <https://linaro.atlassian.net/wiki/spaces/QEMU/pages/29464068097>
* Google issue tracker — custom arm64 emulator / kernel-ranchu:
  <https://issuetracker.google.com/issues/219764014>
