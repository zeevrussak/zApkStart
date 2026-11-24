# NOTICE

**zApkStart** is a fork of **ApkStart**, developed and maintained by **RoutineMiku**.

* Upstream project: <https://github.com/RoutineMiku/apkstart>
* Fork point: upstream repository `main` branch, commit `7e2c5503` (after release v0.6.4)
* Upstream license: MIT — see [`LICENSE`](LICENSE). The upstream copyright notice is preserved
  verbatim in that file and must not be removed.
* Fork modifications: © 2026 zApkStart contributors (Ze'ev Russak and successors), released under
  the same MIT license.

## Relationship to the original

* zApkStart is an independent project. It is **not** published by RoutineMiku, is **not** listed on
  the Microsoft Store under the original product's identity, and does not use the original's
  distribution channels.
* zApkStart updates itself exclusively from its own releases
  (<https://github.com/zeevrussak/zApkStart/releases>). It will never install an upstream ApkStart
  release, and upstream ApkStart will never install zApkStart.
* Installed data directories differ from upstream (`%APPDATA%\zapkstart`, `%USERPROFILE%\zApkStartShared`,
  AVD `zapkstart.avd`). The two products can be installed side by side but do not share settings,
  runtime components, installed Android apps, or snapshots.
* What changed: fork identity/branding; full English + Hebrew localization with RTL (upstream UI is
  Chinese); guest Android language follows the UI language instead of being forced to Chinese;
  Chinese Ali/Tencent DNS default disabled (opt-in); Gitee mirror removed; Windows ARM64 shell
  support with explicit capability reporting; docs re-authored for the fork. The full divergence
  list lives in [`docs/zapkstart/design.md`](docs/zapkstart/design.md) and the design history in
  [`docs/zapkstart/`](docs/zapkstart/).

## Third-party components at runtime

Distribution packages contain zApkStart's own code and the Electron runtime. Android system images,
QEMU, platform-tools (adb), and hypervisor drivers are not distributed in the repository; they are
downloaded by the user's machine from official sources on first run, under their own licenses
(Android SDK terms, QEMU GPL, respective driver licenses). See upstream `README` runtime notes and
[`docs/zapkstart/design.md`](docs/zapkstart/design.md) for the component sources.

## Trademarks

"ApkStart" and its logo belong to the upstream project. zApkStart uses its own name and logo; the
upstream name appears only for attribution.
