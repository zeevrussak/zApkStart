'use strict';
// adb / zh-CN — src/core/adb.js 的用户可见文案（原文抽取，契约见 src/core/i18n.js）
module.exports = {
  // pm install 失败原因（friendlyInstallError）
  install_abi_mismatch: '安装失败：这个应用只提供 ARM 原生库（多数国产应用如此），当前系统镜像没有 ARM 转译层。zApkStart 会自动切换到内置新版翻译层的兼容镜像并重试。',
  install_older_sdk: '安装失败：应用要求的 Android 版本高于当前运行时（需更高系统镜像）。',
  install_no_certificates: '安装失败：APK 没有有效签名，无法安装。',
  install_cert_mismatch: '安装失败：与已安装版本签名不一致，请先卸载旧版再装。',
  install_version_downgrade: '安装失败：设备上已安装更高版本，不能降级覆盖。',
  install_no_space: '安装失败：运行时磁盘空间不足，请清理后重试。',
  install_invalid_apk: '安装失败：APK 文件损坏或不完整（可能下载未完成），请重新获取。',
  install_invalid_uri: '安装失败：APK 路径含特殊字符，请把文件移到纯英文路径后重试。',
  install_already_exists: '安装失败：已存在同名应用且签名不同，请先卸载。',
  install_update_incompatible: '安装失败：与已安装版本签名不一致，请先卸载旧版。',
  install_deprecated_sdk: '安装失败：这是面向很老 Android 版本的应用（targetSdk 过低），Android 14 默认禁止安装。zApkStart 会自动用官方绕过参数重试。',
  install_test_only: '安装失败：这是仅供测试的应用包，已自动加上测试包参数重试。',
  install_missing_shared_library: '安装失败：应用依赖的设备特性（如特定厂商库）在当前运行时不存在。',
  install_user_restriction: '安装失败：系统限制了安装，请重启运行时后重试。',
  install_conflicting_provider: '安装失败：与已有应用的 ContentProvider 冲突，请卸载冲突应用。',
  install_internal_error: '安装失败：系统内部错误（常见于存储空间不足或开机未完成），请重启运行时后重试。',
  install_unknown: '安装失败：{raw}',
  install_no_clear_reason: '安装失败，未获得明确原因',

  // 启动失败原因（friendlyLaunchError）
  default_app_name: '应用',
  launch_anti_emulator: '{pkg} 检测到模拟器 / 转译环境后主动退出（反模拟、反调试或安全校验），属于应用自身限制，不是故障；zApkStart 无法绕过，详见内置手册 6.3。',
  launch_abi_crash: '{pkg} 启动后崩溃：应用与 ARM 翻译层不兼容（常见于反调试 / 反模拟检测或 native hook 冲突）。若运行时尚未启用兼容镜像会自动切换重试一次；已启用仍崩溃则属于应用兼容性限制，不是故障，详见内置手册 6.3。',
  launch_missing_lib: '{pkg} 启动后崩溃：缺少设备原生库（应用可能只提供 ARM 版本）。若运行时尚未启用 ARM 翻译层会自动切换兼容镜像重试；已启用仍崩溃多为应用限制，详见内置手册 6.3。',
  launch_java_crash: '{pkg} 启动即崩溃（应用内部异常，可能与模拟器环境或缺少 Google 服务有关）。',
  launch_security: '{pkg} 启动失败：系统拒绝了启动请求（权限或签名问题）。',
  launch_generic: '{pkg} 未能启动：{raw}',
  launch_no_process: '{pkg} 未能启动（进程未存活）',

  // adb 调用与常驻输入通道
  exec_failed: 'adb {args} 失败: {raw}',
  input_session_start_failed: 'adb shell 启动失败',
  input_session_exited: 'adb shell 已退出',
  input_invalid_command: '非法的输入命令',
  input_timeout: 'input 命令超时',
  input_closed: '输入通道已关闭',

  // 安装 / 输入法编排
  apk_not_found: 'APK 不存在: {path}',
  no_split_parts: '没有可安装的分片 APK',
  split_install_failed: '拆分 APK 安装失败',
  app_still_loading: '（应用仍在加载中）',
  ime_apk_missing: '输入法 APK 缺失',
  ime_not_registered: '输入法包未注册',
};
