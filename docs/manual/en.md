# zApkStart User Manual and Troubleshooting Guide

> Version: v0.6.4 · Platforms: Windows 10/11 x64 & ARM64 · Updated: 2026-11-23
>
> zApkStart is a Windows app runner: **it installs Android apps like native Windows software — each app appears on the desktop and starts with a double-click.**
> This manual first teaches you how to use the app, then gives concrete, follow-along solutions organized by "symptom". Every step maps to a button or menu that really exists in the software.

---

## Contents

1. [1. zApkStart in 30 seconds](#intro)
2. [2. Installation and first launch](#setup)
3. [3. Everyday use](#usage)
4. [4. Three core concepts (the key to understanding errors)](#concepts)
5. [5. Do this first when something breaks: self-check and auto-detection](#checkup)
6. [6. Solutions to common problems](#faq)
   - [6.1 "Hardware acceleration is not enabled" / slow boot](#troubleshoot-accel)
   - [6.2 Install failures (INSTALL_FAILED_*)](#install)
   - [6.3 No ARM translation layer in the system image / ARM apps fail to install or crash](#troubleshoot-arm)
   - [6.4 adb unauthorized (allow USB debugging)](#troubleshoot-adb)
   - [6.5 Double-clicking the icon does nothing / endless spinner / a window with a rotate button](#troubleshoot-launch)
   - [6.6 Quick reference for other startup problems](#troubleshoot-boot)
   - [6.7 No sound in apps / sound is very quiet](#troubleshoot-sound)
   - [6.8 Store build fails to start / 0xC0000135 (DLL load failure)](#troubleshoot-dll)
   - [6.9 Apps can't use the microphone / voice calls and recording fail](#troubleshoot-mic)
   - [6.10 Discrete / integrated GPU rendering (graphics preference)](#troubleshoot-gpu)
7. [7. Command-line reference](#cli)
8. [8. Data and directories](#data-dirs)
9. [9. Getting help and giving feedback](#support)
- [Windows ARM64](#arm64)

---

## 1. zApkStart in 30 seconds

```
Desktop shortcut (a real app icon .lnk)
      │ double-click
      ▼
zApkStart.exe --launch <package>
      │ runtime not booted? → started automatically (Android 14 emulator, bundled or downloaded on first run)
      ▼
App opens via the launch entry the system resolves (not the hardcoded main Activity from the APK)
      ▼
Emulator window = app window (retitled title, custom icon, portrait ratio, fullscreen centered)
```

**What makes it different**

- 🖱️ **Double-click an .apk to install**: after the file association is registered, double-clicking an APK → auto-parse → install → desktop icon created.
- 🧩 **One desktop icon per app**: the icon is extracted offline from inside the APK; double-clicking the icon goes straight into the app.
- 🪟 **An app is just a window**: native rendering, fills the screen height and centers in fullscreen, window mode is draggable and resizable, and each app remembers its own size.
- 🔍 **Findable from Windows search**: desktop + Start menu (`Programs\zApkStart\`) dual shortcuts.
- 📁 **Shared data**: `%USERPROFILE%\zApkStartShared` ↔ Android's `/sdcard/zApkStartShared`, synced both ways.
- 🪶 **Bundles its own runtime**: depends on no emulator you may have installed — no MuMu / LDPlayer / WSA.

> Note: this is an early-stage open-source project, free and ad-free, maintained in spare time. Hitting problems is normal — this manual exists exactly for that.

---

## 2. Installation and first launch

### 2.1 Pick the build that fits you

zApkStart is distributed from its own GitHub releases only — it never pulls builds from the original ApkStart project:

- GitHub: `github.com/zeevrussak/zApkStart/releases`

| Build | File | When to pick it |
|---|---|---|
| **Store (MSIX)** | `zApkStart_<four-part version>_x64.msix` | Installed from a Microsoft Store listing. Bundles the full runtime, works offline after install, updates handled by the Store |
| **Full portable** | `zApkStart-v*-win64-full.zip` (~830 MB, ~1.3 GB unpacked) | Don't want to install or wait for downloads: unpack and run, runtime is fully inside the package |
| **Installer** | `zApkStart-v*-Setup.exe` (~1.3 GB) | Want desktop/Start-menu shortcuts and an uninstall entry |
| **Light portable** | `zApkStart-v*-win64-portable.zip` (96 MiB, ~227 MB unpacked) | Just want to try it first; downloads the runtime on first launch |
| **ARM64 light portable** | `zApkStart-v*-arm64-portable.zip` | Windows on ARM64 devices — see [Windows ARM64](#arm64) below |

> ⚠️ **Always use the newest build (currently 0.6.4)**. Old versions (0.5.x and earlier) either had no bundled runtime (every launch went looking for / downloading a 1.5 GB runtime) or defaulted to the embedded window — the classic cause of "very slow, won't open, a shell window with a spinning button shows up". If you are upgrading from an old version, make sure the desktop shortcut points at the new program directory.

### 2.2 What happens on first launch

1. **(Light portable only) download the runtime**: adb, Android Emulator, and the Android 14 system image; the official sources measure 10+ MB/s with 8-thread chunked download + resume. Full / Store builds skip this step.
2. **First image expansion**: the xz image is expanded to `%APPDATA%\zapkstart\system-images` (about 20 seconds, done once).
3. **First `/data` creation**: zApkStart generates its own ext4 user data with encryption and SELinux labels (the stock image only carries a 1 MB placeholder).
4. **Automatic boot**: afterwards, launching an app is a single `am start`; cold boot takes ~23 seconds, snapshot restore ~10 seconds.

> A slow first launch is normal — it is a one-time cost. Every launch after that is instant.

---

## 3. Everyday use

### 3.1 Installing apps

Pick any of three ways:

- **Double-click the APK file** (register the association first: Settings → System integration → associate .apk files);
- Pick "Install app" in the main window;
- Command line: `zApkStart.exe <path\to.apk>`.

Split packages (`.apks` / `.xapk`) are supported (via `install-multiple` automatically). Desktop + Start-menu shortcuts are created automatically after install.

### 3.2 Opening apps

Just double-click the desktop icon. All apps share one runtime, so **the second app starts almost instantly**.

### 3.3 Windows and display

| Action | How |
|---|---|
| Fullscreen / window toggle | `F11` or the tray right-click menu. Fullscreen only enlarges the window, it does not change the aspect ratio |
| Rotate portrait/landscape | `Ctrl+Alt+R` (global) or the title-bar rotate button; the orientation is remembered per app |
| Auto fullscreen | Settings → Display & windows → auto fullscreen (best combined with "force orientation") |
| Force landscape/portrait | Settings → Display & windows → screen orientation |

> Only the one transition where "the panel orientation differs from the app orientation" restarts the runtime (~40 seconds, the title bar shows a notice). Same-orientation apps launch instantly afterwards.

### 3.4 Keyboard shortcuts

| Keys | Effect |
|---|---|
| `F11` | Fullscreen / window mode toggle |
| `Ctrl+Alt+R` | Rotate the current app portrait/landscape |
| `Ctrl+R` | Rotate inside the shell window (in native window mode use `Ctrl+Alt+R`) |

### 3.5 File exchange (Windows ↔ Android)

`%USERPROFILE%\zApkStartShared` on the PC and `/sdcard/zApkStartShared` inside Android sync both ways within seconds.
Entry point: Settings → Integration & files → File exchange ("Sync now" or "Open folder").

### 3.6 Settings page guide

Since 0.6.0 the settings are split into eight categories with a search box on top (type keywords like "landscape", "memory", "proxy" — matches across categories):

| Category | Main contents |
|---|---|
| General & install | Runtime & environment, one-click setup, launch at boot, disk usage & cleanup |
| Display & windows | Display mode, auto fullscreen, screen orientation, tablet layout, window hosting |
| Input & controls | Mouse buttons, keyboard mapping |
| Performance & resources | Resource strategy, GPU preference (discrete/integrated), microphone, picture quality, data partition, system language, snapshots, boot warm-up |
| Network & downloads | Updates & download sources, accelerated mirrors, download threads, fast DNS |
| Diagnostics & repair | Machine self-check, driver/compatibility patches, auto-detection |
| Integration & files | Desktop & apps, file exchange, system integration |
| Updates & about | Software updates, about |
| Lab | Windows-native multi-window multi-instance (experimental), background retention |

> **Lab · Multi-instance (experimental)**: when enabled, launching a new app no longer force-closes the previous one — several apps can stay in the background, be switched back to, and keep their login state. Because the Android runtime still has only one emulator window, only one app's picture is on screen at any moment; this is not true side-by-side multi-window. It increases memory usage. Off by default — ignore it if you value stability.

> **Fast DNS**: zApkStart ships with fast DNS **off by default** (the guest Android then uses the host's DNS). If guest DNS resolution is slow — for example behind a VPN or a corporate network — enable it under Settings → Network & downloads; it points Android at fast public resolvers. Turn it off again if intranet name resolution misbehaves.

### 3.7 In-app updates

Settings → Updates & about → Check for updates, or tray right-click → Check for updates. The update pipeline probes the sources and picks the fastest one (GitHub and configured mirrors), downloads in parallel chunks, and switches sources automatically on failure. Updating never touches the runtime, installed apps, or snapshots.

New portable builds support **incremental updates**: every release also ships a "code manifest" and a small code-only package (a few MB, versus ~100 MB for the whole package). If your Electron shell version did not change, the update downloads only the small package, verifies files one by one, and replaces the program code in seconds. If the shell version changed, the manifest is missing, or any check fails, it automatically falls back to the full package, so an update cannot brick the program. Store builds are still updated by the Microsoft Store.

> Note: only users who install portable builds via "Check for updates" from GitHub get incremental updates; Microsoft Store installs go through the Store channel. Incremental updates have no effect on installed apps, Android data, the runtime, or snapshots.

---

## 4. Three core concepts (the key to understanding errors)

Most "weird problems" trace back to one of the three things below. One minute here makes all later troubleshooting easier.

### 4.1 Runtime / system image

zApkStart does not emulate an "empty Android" — it loads a **complete Android 14 system image** as the base.
0.6.3 has exactly **one universal image** (Google Play x86_64); both x86 and ARM apps run on it — no more separate "AOSP image / compatibility image" pair like older versions.

- Missing / corrupted image, or one incompatible with old user data → boot failure, stuck boot, restart loops.
- User data (`/data`) is a thin diff layer; the system image is shared machine-wide.

### 4.2 Hardware acceleration

The emulator needs CPU virtualization acceleration to run fast. On Windows there are exactly two options:

| Method | What it is | Who needs admin | Reboot after install? |
|---|---|---|---|
| **WHPX** | Windows' built-in "Windows Hypervisor Platform" feature | When enabling the feature | Yes |
| **AEHD** | Google's own kernel driver | When installing the driver | No |

**It runs without acceleration too** (pure software emulation, TCG) — boot just takes minutes and frames drop easily. That is "slow", not "broken". zApkStart falls back automatically and retries with up to 4 parameter combinations across "render backend → acceleration method → memory/cold boot".

> Don't confuse **VirtualMachinePlatform** (the WSL2 one) with the acceleration switch. The emulator wants **HypervisorPlatform**. With only the former enabled, `emulator -accel-check` still reports unavailable.

### 4.3 The ARM translation layer

The vast majority of Chinese-market Android apps ship **ARM native libraries** (arm64-v8a / armeabi-v7a) while the system image is **x86_64** — a "translation layer" is needed to feed ARM instructions to the x86 CPU. The 0.6.3 universal image bundles the new `ndk_translation` layer, so ARM apps normally install with no settings at all.

- On first encounter with an ARM app whose translation-layer components are not in place yet, zApkStart fetches them automatically, restarts the runtime and retries (see 6.3).
- Old images (API 30) have compatibility problems with the new layer (e.g. ByteDance apps hitting `DoBadTrampoline` SIGABRT); the Android 14 image fixes this.

---

## 5. Do this first when something breaks: self-check and auto-detection

Before digging through this manual, let the software check itself — it can auto-fix most problems.

### 5.1 Machine self-check · automatic configuration

Location: Settings → Diagnostics & repair → **Start self-check**

- What it checks: CPU virtualization (VT-x/SVM) enabled, Hyper-V / Hypervisor Platform availability, GPU / VRAM / driver, memory, OS version, `emulator -accel-check`, AEHD driver.
- Clicking "**Apply recommended configuration**" writes the safe items automatically: memory / cores / render resolution / picture quality / forced software emulation when no acceleration, and persists them as a machine driver profile that is applied automatically from then on.
- Results are graded: `ok` (fine) / `warn` (works but worth optimizing) / `bad` (won't run until fixed). Every item has a color and an explanation.

Only two things genuinely require you:

- **BIOS virtualization**: reboot into BIOS → enable Intel VT-x / AMD SVM → Enabled (the software cannot do this for you).
- **Windows features / acceleration driver**: see 6.1.

### 5.2 Auto-detection (automatic debug)

Location: Settings → Diagnostics & repair → "Auto-detection · smart diagnostics"

Every 10 minutes in the background it sweeps the machine, lists issues in six categories, and offers **one-click fixes** for each (restart runtime, clear locks, kill orphan processes, invalidate snapshots, clean disk, reset Android networking…), then re-checks automatically after fixing:

| Category | Problems covered |
|---|---|
| Runtime | the real reason the last boot failed, stuck boot, leftover lock files, orphan emulator processes, empty snapshot shells, no hardware acceleration |
| Device connection | adb unauthorized, offline, runtime running but adb sees no device |
| Storage | free disk, data partition config vs reality, shared folder not writable |
| Settings | screen orientation vs physical panel conflict, auto fullscreen not working in detached windows |
| Network/logs | no network on the Android side, unreachable download sources, errors in recent logs |

> Two principles: a probe that fails is never reported as a problem (if the status can't be read it says "unknown", never guesses); the same old issue does not nag repeatedly.

### 5.3 Exporting a diagnostic report

Location: Settings → Diagnostics & repair → **Export diagnostic report** (or the same-named button on the system integration page)

The report is plain text: machine configuration, the launch parameters actually chosen, logs, and diagnostic conclusions. Attach it when reporting a problem — it speeds things up enormously.

### 5.4 The built-in manual and automatic tutorials

Since 0.6.3 this manual is **embedded in the app**: the "?" button in the main window title bar and "Open user manual" under Settings → About both open it directly, searchable, scrollable, printable / savable as PDF. It auto-navigates to the section relevant to the current failure.

Auto-detection/repair also brings the tutorial to you:

- When auto-detection finds a problem, there is a "Tutorial" button next to the issue entry that jumps straight to the right section;
- For hardware acceleration, install failures, the ARM translation layer, adb authorization, no-sound and similar problems, **the matching tutorial pops up automatically after an automatic fix fails**, so you don't have to come looking here;
- The same tutorial auto-pops at most once per app run — it will not keep interrupting you.

> Manual entry point: the `?` button in the title bar. To temporarily stop auto-popups, disable notifications in the auto-detection settings; tutorials remain reachable from the issue entry's "Tutorial" button.

---

## 6. Solutions to common problems

### 6.1 "Hardware acceleration is not enabled" / slow boot

**Symptoms**: Settings/diagnostics say "no hardware acceleration right now" / "hardware acceleration unavailable"; boot takes minutes, frames drop.

**First, be clear**: this is usually "slow", not "won't open". zApkStart has already fallen back to software emulation. Acceleration is what you need for smoothness.

**Per build type:**

- **Installer / portable**: Settings → Diagnostics & repair → machine self-check → find "hardware acceleration not enabled" → click **Repair**. One UAC prompt, WHPX is enabled automatically; if that fails (unsupported system or you clicked No), it installs the AEHD driver instead.
- **Microsoft Store (MSIX) build**: Store apps **cannot elevate themselves**, so clicking "Repair" opens the "Turn Windows features on or off" dialog:
  1. Check **"Windows Hypervisor Platform" (HypervisorPlatform)**;
  2. Click OK and **reboot the PC** once.

  You can also run in an **administrator PowerShell**:

  ```powershell
  dism /online /enable-feature /featurename:HypervisorPlatform /all /norestart
  dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
  ```

> Two pitfalls: ① do not enable only VirtualMachinePlatform — that is not the acceleration the emulator wants; ② if VT-x/SVM is disabled in the BIOS, enable it first per 5.1, otherwise enabling the Windows feature does nothing.
> If your GPU driver is over 3 years old, update it from the vendor's website; but zApkStart never installs drivers itself (a wrong install makes things worse). Some old GPUs / integrated graphics need a compatibility patch: see Settings → Diagnostics & repair → Driver · compatibility patches.

---

### 6.2 Install failures (INSTALL_FAILED_*)

**Symptoms**: installing an app errors out; the message usually starts with "Install failed:" and ends with an `INSTALL_*` error code.

zApkStart translates the raw English errors. Match yours against this table:

| Code | Meaning | What to do |
|---|---|---|
| `INSTALL_FAILED_NO_MATCHING_ABIS` | The app ships ARM-only libraries and the current image has no ARM translation layer | **Usually handled automatically**: zApkStart switches images and retries. See [6.3](#troubleshoot-arm) |
| `INSTALL_FAILED_OLDER_SDK` | The app demands a newer Android | Needs a newer system image; current is Android 14 (API 34), rarely triggered |
| `INSTALL_PARSE_FAILED_NO_CERTIFICATES` | APK has no valid signature | APK is corrupt or unofficial; get the package again |
| `INSTALL_PARSE_FAILED_INCONSISTENT_CERTIFICATES` / `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | Signature differs from the installed version | Uninstall the old one first, then install |
| `INSTALL_FAILED_VERSION_DOWNGRADE` | A newer version is already installed | Cannot downgrade over it; install a higher version or uninstall first |
| `INSTALL_FAILED_INSUFFICIENT_STORAGE` | Runtime disk is full | Clean up disk, or move the runtime data directory to a drive with room (Settings → System integration) |
| `INSTALL_FAILED_INVALID_APK` | APK corrupt/incomplete | Possibly an unfinished download; download again |
| `INSTALL_FAILED_INVALID_URI` | APK path contains special characters / non-ASCII | Move the APK to a plain-ASCII path and install again |
| `INSTALL_FAILED_ALREADY_EXISTS` | Same name already present with a different signature | Uninstall first |
| `INSTALL_FAILED_DEPRECATED_SDK_VERSION` | App targets a very old Android | **Handled automatically**: zApkStart retries with the official bypass parameter |
| `INSTALL_FAILED_TEST_ONLY` | Test-only package | **Handled automatically**: retries with the test-package parameter |
| `INSTALL_FAILED_MISSING_SHARED_LIBRARY` | A required device feature / vendor library is absent | The app depends on a specific vendor environment an emulator cannot provide |
| `INSTALL_FAILED_USER_RESTRICTION` | System blocks installation | Restart the runtime and retry |
| `INSTALL_FAILED_CONFLICTING_PROVIDER` | ContentProvider conflicts with an installed app | Uninstall the conflicting app |
| `INSTALL_FAILED_INTERNAL_ERROR` | Internal system error (usually low space or boot not finished) | Restart the runtime, wait for boot to complete, retry |

> If you get raw English outside this table, export a diagnostic report per 5.3 and report it.

---

### 6.3 No ARM translation layer in the system image / ARM apps fail to install or crash

**Symptoms**: installing reports `INSTALL_FAILED_NO_MATCHING_ABIS` with text like "the app only ships ARM native libraries… the current system image has no ARM translation layer"; or the app installs but crashes instantly on launch, with `DoBadTrampoline`, `libndk_translation`, `UnsatisfiedLinkError`, `...so not found` in the logs.

**Background**: 0.6.3 uses **one universal Android 14 image** supporting both x86 and ARM, with the translation layer built in. Old versions required manually switching images; that "universal compatibility image (auto-managed)" switch now **exists only for old-configuration compatibility — normally you never touch it**.

**What zApkStart does automatically:**

1. If install reports `NO_MATCHING_ABIS`, it switches to the compatibility image → restarts the runtime → reinstalls previously installed apps from their local APK backups → retries the install (log: "switching to the compatibility image and restarting the runtime…").
2. If an app crashes at launch and the logs clearly point at the ARM translation layer (e.g. `DoBadTrampoline`), it automatically switches to the Android 14 compatibility image and retries (log: "ARM translation layer crash detected, switching compatibility image automatically…").

**What you need to do:**

- **Be patient**: switching images restarts the runtime — roughly 40 seconds to 1 minute — and you may see a progress notice.
- **Confirm the image is in place**: Settings → General & install → Runtime, check the "universal compatibility image (auto-managed)" status; if it shows not downloaded, click "Download compatibility image" (~1.5 GB), then **restart the runtime** for it to take effect.
- **Still crashing**: a few apps ship deeper anti-emulation checks (they hard-verify real sensors, baseband, etc.) and simply cannot run in an emulator; the app explains this in plain language — that is a limitation, not a defect.

**What about "a red 'Install failed' while the text says 'retrying after switching to the compatibility image'"?**

That was a display bug in old builds: the image file was on disk, but it got reused on a runtime whose translation layer was disabled, so the switch-and-retry was skipped and failure was reported while the text still claimed "retrying". **You are not on the latest code — upgrade to the latest 0.6.4 build** (fixed in the version this manual documents: the runtime's real translation capability is probed before install instead of just checking the file exists; `NO_MATCHING_ABIS` always triggers switch + restart + old-snapshot invalidation before reinstalling; a second failure is reported honestly instead of claiming "retrying"). Upgrade, then install the app again.

> Field-tested: Hongguo free short-drama (com.phoenix.read, arm64-v8a-only) installs, reaches its recommendation feed, and plays video normally on the Android 14 image + new translation layer. The runtime's `ro.product.cpu.abilist` = `x86_64,arm64-v8a` — the layer is active.

---

### 6.4 adb unauthorized (allow USB debugging)

**Symptoms**: diagnostics report "adb unauthorized" or "Android debugging authorization incomplete"; `adb devices` shows `unauthorized`; apps never start.

**The correct sequence:**

1. Look for an emulator window showing the **"Allow USB debugging?"** dialog — click **Allow** there, and check **"Always allow debugging from this computer"** so it never asks again.
2. If the window can't be clicked or never appears: Settings → Runtime → **Reset Android data / wipe Android data**, then retry (installed apps are wiped; the APK files remain and are reinstalled automatically; the system itself is unaffected).

> ⚠️ **Never delete `%USERPROFILE%\.android\adbkey`**. Field-tested: that is the exact wrong move. Android only writes a new public key when the `adb_keys` file does not exist; if you swap in a new private key while the system still stores the old public key, the two never match and authorization fails forever.

> Command-line check: zApkStart's adb server runs on **dedicated port 5044** (fully separated from your own 5037):
> ```powershell
> $env:ANDROID_ADB_SERVER_PORT = 5044
> adb devices    # you should see emulator-5554
> ```
> Do not manually `adb connect` to port 5555 — the Play image pops an "Allow USB debugging" prompt over the app, which looks like the program is broken.

---

### 6.5 Double-clicking the icon does nothing / endless spinner / a window with a rotate button

These problems almost always point at the **launch entry or window takeover**. Check in this order.

**① Make sure you run the new build**

- Check the head of `%APPDATA%\zApkStart\logs\app.log`: it should say `start v0.6.4`. If it shows `v0.5.x`, your desktop/Start-menu shortcut points at the old directory.
- Old versions (0.5.x) had no bundled runtime and defaulted to the embedded window → "very slow + shell window with a spinning button". Move to 0.6.4 and point the shortcut at the new `zApkStart.exe`.

**② Set expectations for boot time**

Cold boot ~23–48 seconds, orientation-change restart ~50 seconds — both normal. During that window clicking the icon looks like "nothing happens" while the machine boots in the background. **Do not click repeatedly**: multi-clicking lets a second instance take over the emulator, and the first instance's cleanup on exit can shut the emulator down, failing the launch (0.6.3 added `owner.pid` protection, but queueing still looks like nothing happens). Click once, wait for it to come up.

**③ Native window didn't take over → fell back to the embedded window with the rotate button**

If the log shows `attach failed`, `emu:0`, the window proxy failed to find the emulator window and the program fell back to embedded mode (the shell window with title bar + rotate button you are seeing).
- Launching from a directory junction / non-standard path tends to trigger this; 0.6.3 makes the proxy resolve the real path before matching. If it still happens, attach the log when reporting.

**④ Reset Android data (last resort)**

Settings → General & install → **Reset Android data** (double confirmation). Wipes installed apps and their data but keeps the system itself; the app manifest survives and apps reinstall automatically on launch. Use it for a corrupted data partition or any "won't open" caused by `/data` failing to mount.

---

### 6.6 Quick reference for other startup problems

zApkStart **already handles** most of these runtime errors automatically; the table says what it does and what is left for you. If the automatic handling doesn't help, export a diagnostic report per 5.3.

| Diagnostic title | Automatic handling | What you can still do |
|---|---|---|
| Hardware acceleration unavailable | Falls back to software emulation | Enable acceleration per 6.1 |
| Memory allocation failed | Lowers memory and core count | Close memory-hungry programs |
| Emulator port occupied | Picks a free port automatically | Exit other emulators (Nox/MuMu/BlueStacks) or reboot |
| Leftover lock files / "Running multiple emulators with the same AVD" | Clears AVD locks and retries | Make sure no other emulator uses the same runtime |
| System image missing/corrupt/incompatible with old data | Boots again with clean user data | Settings → Runtime: delete the image and re-download |
| Fast-boot snapshot corrupt | Discards the old snapshot, cold-boots | The next clean exit rebuilds it; or turn snapshots off |
| Runtime components deleted / VC++ runtime missing | — | Add zApkStart to the antivirus whitelist and unpack again; install the Microsoft VC++ 2015-2022 runtime |
| Not enough disk space | — | Move the runtime directory to a roomier drive; disable snapshots / shrink the data partition |
| Path contains non-ASCII / special characters | Switches to short paths automatically | Move zApkStart to a plain-ASCII directory (e.g. `C:\zApkStart`) |
| CPU lacks an instruction set (AVX/SSE4) | — | Usually a warning and boot still works; otherwise use a VT-x/AVX-capable machine or an older engine |
| Current runtime rejects this GPU mode | Re-picks a workable GPU mode per engine version | — |
| GPU / unknown error | Retries automatically with multiple parameter sets | Update GPU drivers; or write a compatibility patch; if it still fails, export a diagnostic report |

**Desktop icons show the zApkStart icon / blank icons**: Settings → System integration → **Rebuild shortcuts** (rewrites the desktop and Start-menu shortcuts from the current app manifest, fixing icons and taskbar identity together). Rebuild is also needed if a shortcut was moved and its path went stale.

---

### 6.7 No sound in apps / sound is very quiet

**Symptoms**: videos and notification sounds in Android apps are completely silent; or other Windows apps have sound while only zApkStart apps are silent.

**First separate the cases**: if the system itself has no sound, fix Windows audio first; only continue below when the rest of Windows has sound and zApkStart apps don't.

1. **Windows volume and output device**: click the taskbar volume icon; make sure nothing is muted, the volume isn't 0, and the output device is the headphones/speakers you are actually using. Open "Volume mixer" and check whether the zApkStart / Android runtime row is individually muted or at 0.
2. **In-app volume**: some apps set media volume to 0 on first entry — raise it in the app's own settings or the Android volume keys. Some apps (YouTube/Douyin-like) also disable autoplay sound inside the app.
3. **zApkStart's sound switch**: Settings → Performance & resources → **Android audio** must be checked. Auto-detection watches this; if it finds it off, it reports it under "Settings → Diagnostics & repair" and one click turns it back on. **You must restart the Android runtime after changing it** (the emulator only starts with `-no-audio` when both sound and microphone are off; changing it mid-run does not restore sound immediately).
4. **Windows audio service**: press `Win+R`, run `services.msc`, find **Windows Audio**, confirm the status is "Running" and startup type "Automatic". If disabled, right-click → start; auto-detection (0.6.3+) also finds and flags this. Administrator PowerShell can run `net start Audiosrv`.
5. **Bluetooth headphones / multiple outputs**: after switching to Bluetooth headphones Windows sometimes doesn't migrate running programs. Disconnect and reconnect the headset, or restart the Android runtime.
6. **Still silent**: export a diagnostic report under "Settings → Diagnostics & repair" and report it; the report includes the sound switch and audio service state, which pins down whether it's configuration, a system service, or the app itself.

> When the automatic fix fails, the app opens this section by itself. If you turned off auto-detection notifications, you can still get here via the issue entry's "Tutorial" button or the title-bar `?`.

---

### 6.8 Store build fails to start / 0xC0000135 (DLL load failure)

**Symptoms**: launching an app spins forever or exits immediately; the diagnostic report shows exit code `0xC0000135` (decimal `3221225781`). Most common with builds **installed from a Microsoft Store (MSIX) package**.

**First, correct a common misjudgment**: `0xC0000135` only means "some DLL failed to load". It does **not** automatically mean the VC++ runtime is missing, and it does **not** automatically mean antivirus deleted files. Three possibilities share this exit code — don't just reinstall the VC++ runtime over and over:

1. **The Store (MSIX) path restriction**: Store builds live in the read-only `C:\Program Files\WindowsApps\...` directory. When the Android runtime spawns `qemu` and friends from there, the children resolve DLLs by relative path and the container's path redirection / environment isolation can break that, so they exit with `0xC0000135`. This is Store-specific and no amount of VC++ reinstalling fixes it.
2. **Genuinely missing VC++ runtime**: the Android runtime (Qt6 / qemu) depends on Microsoft VC++ 2015-2022 (x64). If Settings → Diagnostics & repair explicitly reports "VC++ runtime missing (x64)", that one is **verified by checking the dll files actually exist**, and its one-click fix installs it.
3. **Antivirus quarantined runtime files**: dlls in the runtime directory quarantined/deleted also produce this code. Add zApkStart's install and runtime data directories to the antivirus whitelist, then reinstall once.

**Troubleshoot in this order**:

1. **Check whether diagnostics really report VC++**: if the settings page lists "VC++ runtime missing (x64)", click its one-click fix. Reboot after install and try again. Do **not** reinstall just because the exit code is `0xC0000135` — first confirm that item is actually reported.
2. **VC++ not reported, still failing → probably the Store path problem**: currently the most likely cause. Try in order:
   - Exit zApkStart completely (tray icon → exit) and reopen;
   - Check your antivirus' "controlled folder access / ransomware protection", whitelist zApkStart, and restart;
   - If it still fails, use the **portable build** (`zApkStart-win64-portable` from the fork's GitHub Releases) placed in a plain-ASCII directory (e.g. `C:\zApkStart`) — the portable build doesn't live under WindowsApps and bypasses this restriction entirely.
3. **Want the exact failing DLL name** (advanced): when reporting, the most valuable datum is which dll is actually missing. In Event Viewer → Windows logs → Application, find the zApkStart / emulator `Application Error` entry and read its `FaultingModuleName` field; or export a diagnostic report under "Settings → Diagnostics & repair" and attach it.
4. **What if adb also crashes**: if the event log separately shows `adb.exe` failing with `0xC0000409`, that is an independent issue (device connection anomaly), not the direct cause of the emulator exit; handle the launch per 1–3 above and mention the adb issue separately in your report.

> This section opens automatically: when a startup failure / repair failure is classified as a DLL-type problem, the app jumps straight here. You can always reach it manually via the issue entry's "Tutorial" button or the title-bar `?`.

---

### 6.9 Apps can't use the microphone / voice calls and recording fail

**Symptoms**: voice messages, calls, recording, scan-to-talk and the like fail in apps, with prompts like "no microphone / recording device unavailable".

1. **zApkStart's microphone switch**: Settings → Performance & resources → **Microphone input** must be checked. On by default; if it was turned off, auto-detection reports "microphone input disabled in settings" under "Settings → Diagnostics & repair", and one click re-enables it and restarts the runtime. **You must restart the Android runtime after changing it** (the switch decides whether the emulator exposes a recording device to Android).
2. **Windows microphone permission**: `Settings → Privacy & security → Microphone` — make sure both "let apps access your microphone" and "let desktop apps access your microphone" are on. Android runs inside a desktop app; with this off, the system level never yields a microphone.
3. **Confirm Windows can record**: record a clip with the built-in Voice Recorder to confirm the microphone itself and the input device (headset mic / camera mic / standalone mic) work and aren't muted.
4. **Right input device**: with several microphones connected, set the one you want as the default device under Windows "Sound settings → Input"; the emulator uses the system default input device.
5. **How sound and microphone interact**: only when **both** "Android audio" and "Microphone input" are off does the emulator shut down the whole audio subsystem to save CPU; as long as one is on, the other works normally.

> With the microphone off, apps just "find no recording device" — there is no loud error. Auto-detection proactively reports it; you can also reach this section manually from the title-bar `?`.

---

### 6.10 Discrete / integrated GPU rendering (graphics preference)

**Symptoms**: the machine has a discrete GPU but app graphics stutter and drop frames; or a laptop runs hot and drains battery and you'd rather use the integrated GPU.

zApkStart renders Android graphics with `-gpu host`, i.e. real hardware rendering through your actual GPU. Since 0.6.4 every GPU vendor (NVIDIA / AMD / Intel) defaults to host, instead of the old behavior that forced AMD/Intel down to software rendering — which amounted to throwing the GPU away. If host crashes on a given machine, it automatically degrades to a software backend; usage is unaffected.

**Picking which GPU**: on machines with both discrete and integrated GPUs, Windows sometimes assigns the emulator to the integrated one. Settings → Performance & resources → **GPU preference** pins it explicitly:

| Option | Fits |
|---|---|
| System default (recommended) | Let Windows choose by power/load; easiest on most machines |
| Prefer discrete GPU | Games, video, anything needing high frame rates; more heat and battery drain |
| Prefer integrated GPU | Light apps, idle sessions, laptop battery saving; lower performance |

- This works through Windows' "Graphics performance preference" (UserGpuPreferences) applied to the emulator process, **effective only on Windows 10 1803 and newer**; older systems ignore it automatically without affecting launch.
- It takes effect on the **next start of the Android runtime**; the settings page shows whether it is currently active.
- On old AMD drivers host occasionally crashes: update the GPU driver; if that doesn't help, enable the bundled AMD integrated-GPU swangle sample patch under "Settings → Diagnostics & repair → Driver · compatibility patches" to pin rendering to a steadier backend.

---

## 7. Command-line reference

```
zApkStart.exe                          open the main window
zApkStart.exe <path\to.apk>            install an APK
zApkStart.exe --launch <package>       launch an app directly (what the desktop shortcuts run)
```

---

## 8. Data and directories

| Purpose | Location |
|---|---|
| Runtime (adb / emulator / images) | bundled with the package, or `%APPDATA%\zapkstart\runtime` (light portable) |
| Expanded system image | `%APPDATA%\zapkstart\system-images` |
| AVD / installed apps / snapshots | `%APPDATA%\zapkstart\avd` |
| App icons | `%APPDATA%\zapkstart\icons\<package>.ico` |
| Settings & manifest | `%APPDATA%\zApkStart\settings.json` / `apps.json` |
| Run logs / diagnostic reports | `%APPDATA%\zApkStart\logs\` |
| Windows ↔ Android shared folder | `%USERPROFILE%\zApkStartShared` ↔ `/sdcard/zApkStartShared` |

> "Reset Android data" only clears the user-data layer; the system image and APK files are kept. Updating apps never loses the runtime, installed apps, or snapshots.
>
> Keep plenty of free space on the C: drive: image expansion + data partition + snapshots together can reach several GB. Low space causes install/boot failures.

---

## Windows ARM64

zApkStart ships a native ARM64 build of the app itself. What the Android engine can and cannot do is a hardware reality, and the app tells you about it honestly:

| Host | Shell (this app) | Android engine |
|---|---|---|
| Windows 10/11 x64 | Native | Native (Google emulator / QEMU x64, AEHD or WHPX acceleration) — full experience |
| Windows 11 ARM64 | Native (ARM64 build) | **Not available natively.** Google publishes no ARM64 emulator binaries; the x64 engine under Windows' own emulation is software-translated twice and is not usable for real apps |

- On ARM64, the app reports the situation on first run.
- Running the x64 engine under Windows emulation is an **explicit opt-in** (a single attempt, with expectations stated up front) — never a default.
- A genuinely native ARM64 Android engine is documented — not shipped — in `docs/zapkstart/arm64-research.md` in the repository.
- ARM64 devices should use the ARM64 light portable build; everything else in this manual (settings, diagnostics, updates) applies the same way.

---

## 9. Getting help and giving feedback

When reporting a problem, attach three things — they speed up diagnosis enormously:

1. **Diagnostic report**: Settings → Diagnostics & repair → Export diagnostic report;
2. **The last 20 lines of app.log**: `%APPDATA%\zApkStart\logs\app.log`;
3. **Your version and build type**, e.g. "Store build 0.6.4" or "full portable 0.6.4".

- GitHub: <https://github.com/zeevrussak/zApkStart> (Issues / Releases)

zApkStart is a fork of ApkStart by RoutineMiku — upstream is credited in NOTICE.md and inside the app.

---

*This manual matches v0.6.4 and is updated with each release. If the UI wording differs slightly from what is written here, the in-app text wins.*
