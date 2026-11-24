'use strict';
// installer / zh-CN — src/core/installer.js 的用户可见文案（原文抽取，契约见 src/core/i18n.js）
module.exports = {
  // 拆分安装包解析
  bundle_no_apk_parts: '这个安装包里没有找到 APK 分片（可能不是 .apks/.xapk）',
  bundle_base_parse_failed: '拆分包的 base APK 解析失败',

  // 兼容镜像与运行时编排
  compat_image_downloading: '首次安装 ARM 应用：正在下载兼容镜像（约 1.5GB，只需一次）…',
  compat_image_download_failed: '兼容镜像下载失败，请检查网络后重试',
  switching_compat_image: '正在切换到兼容镜像并重启运行时…',
  compat_runtime_unavailable: '切换兼容镜像后运行时不可用',
  restoring_app: '正在恢复已装应用 {label}…',
  parsing_apk: '正在解析 APK…',
  apk_identified: '已识别 {label}（{package}）',
  preparing_runtime: '正在准备安卓运行时…',
  runtime_unavailable: '运行时不可用',
  arm_switching: '这个应用只有 ARM 库，正在切换到兼容镜像…',
  arm_switching_retry: '这个应用只有 ARM 库，正在切换到兼容镜像后重装…',
  arm_switch_no_translation: '当前运行时未启用 ARM 翻译层，正在自动切换兼容镜像后重试…',
  abi_retried_still_failed: '已切换到 Android 14 兼容镜像并重启运行时，但 {label} 仍然安装失败（{raw}）。请检查磁盘空间与网络后重试；若一直失败，到「设置 → 诊断与修复」导出诊断报告反馈。',

  // 安装流水线进度
  updating_app: '正在更新应用…',
  installing_app: '正在安装应用…',
  compat_switched_reinstalling: '已切换兼容镜像，正在重新安装…',
  creating_shortcut: '正在创建桌面快捷方式…',
  shortcut_create_failed: '快捷方式创建失败：{reason}',
  shortcut_create_failed_generic: '创建快捷方式失败',
  install_done: '{label} 安装完成',

  // 安装完成后的软警告
  warn_min_sdk: '此应用要求 Android {sdk}+，高于当前运行时，可能无法正常运行。',
  warn_icon_placeholder: '应用图标无法解析（可能是特殊格式的自适应图标），快捷方式暂时使用占位图标。',
  warn_icon_webp_failed: '应用图标（WebP）解码失败，快捷方式暂时使用占位图标。',

  // 启动编排（onLog 进度与错误）
  display_adapt_skipped: '显示适配跳过：{reason}',
  net_ready: '虚拟机网络就绪（{ip}）',
  wifi_reconnecting: '虚拟机连不上 Wi-Fi，正在尝试重新连接…',
  net_restored: '虚拟机网络已恢复（{ip}）',
  wifi_reconnect_failed: '自动重连 Wi-Fi 失败：{reason}',
  net_not_ready: '虚拟机网络还没就绪，先启动应用（联网页面可能稍后才加载出来）',
  reinstalling_from_backup: '应用文件缺失（快照与数据不一致），正在用本地备份自动重装…',
  auto_install_failed: '自动安装失败：{reason}',
  launch_retry: '应用启动后退出（第 {attempt} 次），正在自动重试…',
  reset_and_retry: '应用连续退出，正在重置应用数据后重试…',
  app_unstable: '应用启动后立即退出，已自动重试并重置应用数据仍未成功',

  // ---- WSA 的 ABI 方向（docs/zapkstart/wsa-backend.md）----
  wsa_x86_only: '{label} 只带了 x86 原生库，而这台设备跑的是 ARM 安卓（WSA）。请找这个应用的 ARM 兼容版本；这个 APK 在这里装不了。',
  wsa_arm_translation: '{label} 需要支持 ARM 的 WSA 构建（WSABuilds 的 ARM-enabled 变体）。当前这个 WSA 构建跑不动它的原生库。',
};
