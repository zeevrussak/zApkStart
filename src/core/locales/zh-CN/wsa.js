'use strict';
// wsa / zh-CN — Chinese catalog for src/core/backends/wsa.js + backends/index.js
// (contract: src/core/i18n.js; docs/zapkstart/wsa-backend.md wording rules)
module.exports = {
  // Backend identity (settings page describe())
  backend_label: 'Windows Subsystem for Android（WSA）',
  backend_summary: '在原生 ARM64 的 Android 13 子系统里用 WSA 自己的 freeform 窗口跑应用（没有 CPU 模拟）。只经 adb 驱动：x86-only 应用和依赖 Play 认证的应用跑不了；VM 始终归你管理。',

  // probe / check
  not_installed: '这台电脑上没有安装 Windows Subsystem for Android',
  adb_missing: '缺 adb：点「一键部署」自动下载',

  // ensure() state machine
  connecting: '正在通过 adb 连接 WSA（{serial}）…',
  starting_vm: 'WSA 还没有响应，正在拉起子系统…',
  connect_wait: '仍在等待 WSA 的 adb 端点…（{sec} 秒）',
  port_fallback: '默认端口没有应答，改试 {port} 端口一次…',
  port_saved: 'WSA 在 {port} 端口应答了，已保存，之后启动直接用它',
  connected: '已连上 WSA（{serial}）',
  unauthorized: 'WSA 在等调试授权：打开 WSA 设置，启用 adb，并在「允许 USB 调试？」弹窗里点允许',
  adb_toggle_needed: 'WSA 已在运行，但它的 adb 端点拒绝连接：打开 Windows Subsystem for Android 应用 → 开发人员设置 → 打开「开发人员模式」和「IP 地址」（adb），然后重试',

  // backends/index.js fallback log
  fallback_builtin: '引擎模式选择了 WSA，但没有探测到 WSA 包；回落到自带运行时',

  // status() / usage / dataInfo
  not_connected: 'WSA 尚未连接。打开任意一个已安装的应用即可唤醒子系统',
  managed_by_wsa: '存储与进程由 Windows Subsystem for Android 管理，zApkStart 只经 adb 驱动它，不掌握这些数字',
};
