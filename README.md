# zApkStart

English | [עברית](README.he.md)

**zApkStart is a fork of [ApkStart](https://github.com/RoutineMiku/apkstart) by RoutineMiku** — a
Windows app that runs Android apps like native desktop software: double-click an `.apk` to install
it, and each app gets its own window, taskbar identity, and Start-menu entry, on a self-managed
Android runtime (QEMU + Google Play system image) that needs no other emulator and no virtual
network adapters.

The fork adds three things the original does not have:

1. **English and Hebrew, fully.** The original UI is Chinese. zApkStart localizes everything the
   user can see — installer, splash, main window, tray, notifications, settings, manual, and every
   error and diagnostic message — into English and Hebrew, with complete right-to-left layout in
   Hebrew. The Android guest's system language follows the chosen UI language (Hebrew guests boot
   `he-IL`); the bundled Chinese IME installs only when Chinese is selected.
2. **Honest Windows 11 ARM64 support.** The app ships native ARM64 builds. The Android engine
   cannot be native today — Google publishes Windows emulator binaries for x64 only — so on ARM64
   the app says exactly what works and what does not (matrix below), and any attempt to run the x64
   engine under Windows' own emulation is a single explicit opt-in, not a default.
3. **Independent identity and updates.** zApkStart installs and updates as its own product from
   [its own releases](https://github.com/zeevrussak/zApkStart/releases) and never pulls builds from
   the original project. Upstream is credited in [NOTICE.md](NOTICE.md) and inside the app.

## Capability matrix by CPU

| Host | Shell (this app) | Android engine | Notes |
| --- | --- | --- | --- |
| Windows 10/11 x64 | Native | Native (Google emulator/QEMU x64, AEHD or WHPX acceleration) | Full experience, same as upstream |
| Windows 11 ARM64 | Native (ARM64 build) | **Not available natively.** Google publishes no ARM64 emulator; the x64 engine under Windows emulation is software-translated twice and is not usable for real apps | The app reports this on first run; an explicit opt-in can attempt the x64 engine anyway (one try, expectations stated) |

A genuinely native ARM64 Android engine is documented — not shipped — in
[docs/zapkstart/arm64-research.md](docs/zapkstart/arm64-research.md).

## Downloads

Build from source (below) or grab artifacts from
[Releases](https://github.com/zeevrussak/zApkStart/releases). Release assets carry the `zApkStart-`
prefix: portable zips (x64 full/light, ARM64 light), NSIS installers, and the `zApkStart-runtime-*.zip`
bundle that first boot downloads automatically for runtime-less builds.

zApkStart is **not** the Microsoft Store app "ApkStart" and does not use its listing.

## Compatibility with upstream ApkStart

The two products can be installed side by side but share nothing: different data directories
(`%APPDATA%\zapkstart` vs upstream's `%APPDATA%\apkstart`), different shared folders, different
Android virtual devices. There is no migration from an upstream install. See [NOTICE.md](NOTICE.md).

## Building from source

```powershell
npm install          # deps (Electron runtime downloads here)
npm test             # unit + engine suites, pure Node
npm start            # first run: provisions the runtime (adb / emulator / Play image)
npm run pack         # portable build (x64)
npx electron-builder --win nsis --arm64 --config electron-builder.yml   # ARM64 cross-build
```

CI cross-builds the ARM64 NSIS installer and verifies the produced binary is a true ARM64 PE
(`scripts/check-pe-arch.js`).

## Documentation

* Design history and goldfish review records: [docs/zapkstart/](docs/zapkstart/)
* Attribution and fork/upstream separation: [NOTICE.md](NOTICE.md)

## Credits and citation

zApkStart exists because RoutineMiku built ApkStart. If you fork or redistribute this code, keep
the upstream notice with it.

* Upstream project: <https://github.com/RoutineMiku/apkstart> (MIT) — forked from `main` @
  commit `7e2c5503` (after v0.6.4)
* Upstream MIT license text and copyright: [LICENSE](LICENSE) (preserved verbatim)
* Fork modifications: © 2026 zApkStart contributors, same MIT license
* Full divergence list: [NOTICE.md](NOTICE.md) · [docs/zapkstart/design.md](docs/zapkstart/design.md)

## License

[MIT](LICENSE) — the upstream copyright notice is preserved untouched; fork modifications are
licensed identically.

Runtime components (Android system image, QEMU, platform-tools, drivers) are downloaded on first
run from official sources under their own licenses; nothing is redistributed in this repository.
