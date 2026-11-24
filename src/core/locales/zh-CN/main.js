'use strict';
// main / zh-CN — src/main.js 的用户可见文案（原样抽取自上游中文文案）
module.exports = {
  // ---- 方向切换 / 壳窗口提示 ----
  switch_landscape_log: '切换到横屏：正在重启安卓运行时…',
  switch_portrait_log: '切换回竖屏：正在重启安卓运行时…',
  switching_landscape: '正在切换到横屏（重启安卓环境，约 40 秒，只需一次）…',
  switching_portrait: '正在切换回竖屏（重启安卓环境，约 40 秒，只需一次）…',
  switching_for_landscape: '正在为《{label}》切换到横屏（重启安卓环境，约 40 秒，只需一次）…',
  switching_for_portrait: '正在为《{label}》切换到竖屏（重启安卓环境，约 40 秒，只需一次）…',
  tip_switching_landscape_short: '正在切换到横屏…',
  tip_switching_portrait_short: '正在切换到竖屏…',
  tip_opening_app: '正在打开应用…',
  boot_runtime_tip: '正在启动安卓运行时…',
  fallback_embed_toast: '模拟器原生窗口没能显示，本次临时用内置窗口接管画面',
  orientation_log_follow: '(跟随应用)',
  mark_orientation_mismatch: 'orientation mismatch (panel={cur}, want={want}) 重启校正',
  mark_app_up: 'app up (提前接画面)',

  // ---- 部署 / 下载进度 ----
  foreign_bundle_log: '运行时目录指向别的安装包（{current}），改用随包内置运行时 {bundled}',
  autodeploy_cooldown: 'autoDeploy 冷却中（上次失败于 {time}），跳过自动重试',
  autodeploy_skip_bundled: 'autoDeploy 跳过：运行时随包内置（{dir}），无需联网',
  autodeploy_skip_bundled_extract: 'autoDeploy 跳过：运行时随包内置（{dir}），无需联网，镜像将在首次启动时本地展开',
  autodeploy_skip_diag: 'autoDeploy 跳过联网下载：运行时目录随包内置（{dir}），交给诊断流程',
  dl_runtime_pack: '正在从 GitHub 下载运行时…',
  dl_runtime_pack_incomplete: '运行时整包不完整，改用官方源补齐…',
  dl_runtime_pack_fail: 'GitHub 运行时不可用（{err}），改用官方源…',
  dl_adb: '正在准备 adb…',
  dl_emulator: '正在准备 Android 运行时…',
  dl_sysimg: '正在准备 Android 系统镜像…',
  toast_autodeploy_done: '运行时已自动准备完成',
  powershell_start_failed: '无法启动 PowerShell',

  // ---- 商店版手动开启引导 ----
  msix_accel_hint: '商店版无法自行提权。请手动开启一次：按 Win+R → 输入 optionalfeatures → 勾选「Windows 虚拟机监控程序平台」（HypervisorPlatform，WHPX 真正需要的那个），确定后重启电脑。',

  // ---- 通知 ----
  still_running_title: 'zApkStart 仍在后台运行',
  still_running_body: '点击托盘图标可重新打开；右键托盘可退出。',
  notify_installed_title: '安装完成',
  notify_installed_body: '{label} 已安装',
  notify_installed_shortcut: '{label} 已安装，桌面快捷方式已创建',
  notify_install_failed_title: '安装失败',
  autodebug_new_issues_notify_title: '自动检测发现新问题',
  autodebug_new_issues_notify_body: '{text}。打开 zApkStart 的「设置 → 诊断与修复」可以一键处理。',
  notify_sw_emu_title: '正在以软件模拟运行（很慢）',
  notify_sw_emu_store: '开启「Windows 虚拟机监控程序平台」后重启一次，速度可提升 5~10 倍。设置 → 环境自检 → 修复 会直接打开该窗口。',
  notify_sw_emu_installer: '设置 → 环境自检 → 修复 可一键开启（需管理员授权），之后重启一次。',
  notify_data_resized_title: '数据分区已调整',
  notify_data_resized_body: '安卓可用空间约 {gb} GB',
  notify_data_resized_restarted: '安卓可用空间约 {gb} GB（运行时已重启）',
  notify_up_to_date_body: 'zApkStart v{version}',
  notify_low_disk_title: '磁盘空间不足',
  notify_low_disk_body: '只剩 {gb} GB。请到「设置 → 系统集成」把安卓数据目录/运行时目录改到其他盘，或先清理磁盘。',
  notify_shortcuts_fixed_title: '快捷方式已补齐',

  // ---- 手册窗口 ----
  manual_window_title: 'zApkStart 使用手册 · {title}',

  // ---- 自动检测提醒 ----
  autodebug_new_issues_toast: '自动检测发现新问题：{text}（设置 → 诊断与修复）',

  // ---- 托盘菜单 ----
  tray_open: '打开 zApkStart',
  tray_manual: '使用手册',
  tray_no_apps: '还没有安装应用',
  tray_close_current: '关闭当前应用',
  tray_close_current_label: '关闭当前应用（{label}）',
  tray_rotate_to_portrait: '切回竖屏（需重启运行时）',
  tray_rotate_to_landscape: '切换横屏（需重启运行时）',
  tray_display_exit_fullscreen: '切回竖屏窗口',
  tray_display_fullscreen: '全屏（自适应屏幕）',
  tray_rebuild_shortcuts: '重建桌面/开始菜单快捷方式',
  tray_sync_shared: '同步共享目录',
  tray_settings: '设置',
  tray_update_available: '发现新版本 {tag}',
  tray_check_update: '检查更新',
  tray_quit: '退出',
  tray_tooltip: 'zApkStart — 安卓应用运行器',

  // ---- 更新对话框 / 更新流程 ----
  update_dialog_title: '发现新版本',
  update_dialog_message: 'zApkStart {tag} 已发布，当前版本 v{current}。现在更新吗？',
  update_now: '立即更新',
  update_later: '稍后',
  update_up_to_date_notify: '已是最新版本',
  update_busy_error: '正在更新中',
  update_store_error: '商店版更新由 Microsoft Store 负责，已打开商店的「下载和更新」',
  update_no_update_error: '已经是最新版本',
  update_no_asset_error: '该版本没有可直接安装的包，已打开 GitHub 发布页',
  update_dl_prepare: '准备下载…',
  update_dl_apply: '正在替换程序并重启…',
  update_resume_apply: '正在完成上次未完成的更新…',

  // ---- 安装并发 ----
  install_same_file_toast: '这个 APK 正在安装中，请稍等…',
  install_busy_error: '正在安装中',
  install_other_toast: '已有安装任务在进行，请等它装完。',
  install_other_error: '已有安装任务在进行',

  // ---- 启动 / 关闭应用 ----
  launch_queued: 'launch queued {pkg}（等待 {other} 启动完成）',
  preattach_ok: 'pre-attach detached ok（第 {n} 次）',
  launch_failed_toast: '启动失败：{err}',
  stop_no_app_error: '没有正在运行的应用',

  // ---- 对话框 / 文件选择 ----
  dialog_pick_data_dir: '选择数据存放目录',
  dialog_pick_apk: '选择要安装的 APK',
  dialog_filter_android_apps: 'Android 应用',
  dialog_pick_driver: '选择驱动文件（.json）',
  dialog_filter_driver_json: '驱动 JSON',
  dialog_export_driver: '导出本机驱动模板',
  dialog_pick_iso: '选择 Android-x86 / Bliss OS 系统镜像',
  dialog_filter_sysimg: '系统镜像',
  dialog_pick_vdisk: '选择已安装 Android 的虚拟磁盘',
  dialog_filter_vdisk: '虚拟磁盘',
  dialog_default_confirm_title: '确认',
  btn_cancel: '取消',
  btn_ok: '确定',

  // ---- 杂项错误 / 日志 ----
  app_not_found: '应用不存在',
  err_missing_pkg: '缺少包名',
  err_empty_dir: '目录不能为空',
  err_missing_driver_id: '缺少驱动 id',
  err_unknown_setting: '未知设置项 {key}',
  err_invalid_capacity: '目标容量不合法',
  driver_imported_log: '已导入驱动：{name} v{version}',
  preflight_applied_log: '体检自动配置：{engine} driver={driver}',
  agent_scope_empty_log: 'agent scope 为空：不压制任何窗口（避免误伤其他软件）',
  dispose_skip_log: '另一个实例已接管运行时，跳过停止（否则会误杀它的模拟器）',
  console_smoke_shot_failed: '[smoke] 截图失败',
  attach_shell_closed_log: 'attach detached: 壳窗口已关闭（第 {n} 轮）',
  attach_failed_log: 'attach detached #{n} 失败: {err}',
  attach_fallback_log: 'attach detached: 重试全部失败，临时退回嵌入模式',
  resources_unavailable_note: '运行时未就绪，暂时读不到资源分配',

  // ---- 自检问题清单（doctor:selfCheck） ----
  issue_vcredist_title: '缺少 VC++ 运行库（x64）',
  issue_vcredist_hint: '实测系统缺少微软 VC++ 2015-2022（x64），安卓运行时依赖它。可一键安装；若装完仍报 0xC0000135，见内置手册 6.8——商店版还可能是子进程 DLL 路径问题。',
  issue_accel_store_title: '需要开启「Windows 虚拟机监控程序平台」',
  issue_accel_store_hint: '没有它只能跑纯软件模拟，开机会慢到几分钟。{msix}（商店版无法代你提权，需要你手动操作一次，之后重启。）',
  issue_accel_title: '未启用硬件加速',
  issue_accel_hint: '{note}点右侧「修复」会自动开启（需要管理员授权，可能要重启一次）；失败时会自动改装 AEHD 驱动。',
  sw_fallback_note: '将回退软件模拟（能跑但很慢）。',
  issue_disk_title: '运行时磁盘空间紧张',
  issue_disk_hint: '「{dir}」所在盘仅剩 {mb} MB，运行时与镜像可能撑爆硬盘。',
  issue_path_title: '运行时目录含中文/特殊字符',
  issue_path_hint: '部分运行时组件对中文路径敏感，可能引发启动失败。建议改到纯英文目录。',
  issue_adb_title: 'adb 工具链缺失',
  issue_adb_hint: '无法连接安卓运行时。',
  issue_emulator_title: '运行时引擎未安装',
  issue_emulator_hint: '需要先部署运行时引擎（约 440MB）。',
  issue_sysimg_title: '系统镜像未就绪',
  issue_sysimg_hint: '需要先下载 Android 系统镜像（约 1.5GB）。',
  issue_lock_title: '检测到上次残留的锁文件',
  issue_lock_hint: '可能导致下一次启动被判定为「AVD 已被占用」。',

  // ---- 清理运行时缓存 ----
  cleanup_btn: '清理 {n} 项',
  cleanup_dialog_title: '确认清理运行时缓存',
  cleanup_dialog_message: '将释放约 {mb} MB',
  cleanup_detail_with_snapshots: '会先停止运行时，再删除旧镜像、当前 AVD 的快速启动快照、锁文件和非活动 AVD 的缓存。已安装的应用本身保留（只清快照），此操作不可撤销，建议先导出诊断报告。',
  cleanup_detail_no_snapshots: '只删除旧镜像、旧快照、锁文件和非活动 AVD 的缓存，已安装的应用会保留。此操作不可撤销，建议先导出诊断报告。',

  // ---- 硬件加速 / 驱动提权 ----
  aehd_not_ready: 'AEHD 驱动包未就绪',
  uac_cancelled_driver: '已取消管理员授权（需要点「是」才能安装驱动）',
  driver_install_failed: '驱动安装失败（退出码 {code}）',
  accel_already_note: '硬件加速已可用，无需额外操作',
  accel_whpx_requested_note: '已请求开启「Windows 虚拟机监控程序平台」，重启电脑后硬件加速才会生效',
  accel_whpx_enabled_note: '已开启「Windows 虚拟机监控程序平台」，重启电脑后生效',
  uac_cancelled_accel: '你取消了管理员授权，硬件加速没有改动。可以再点一次「修复」，或手动开启「Windows 虚拟机监控程序平台」。',
  aehd_prepare_failed: 'AEHD 驱动包准备失败',
  accel_aehd_enabled_note: 'AEHD 硬件加速已启用',

  // ---- 低磁盘提示 ----
  toast_low_disk: '磁盘只剩 {gb} GB，安卓可能无法启动（设置 → 系统集成 可换盘）',

  // ---- 每应用路由（WSA 底座，docs/zapkstart/wsa-backend.md）----
  route_mismatch_builtin_on_wsa: '{app} 装在自带运行时里。切回自带运行时打开，或为 WSA 重装一次 —— 它的数据不会跟着迁移。',
  route_mismatch_wsa_on_builtin: '{app} 装在 WSA 里。把引擎切到 WSA 打开，或在自带运行时里重装一次 —— 它的数据不会跟着迁移。',
  wsa_launch_ok: '{app} 已在 WSA 里启动（{ms}ms）：应用打开在它自己的 WSA 窗口中',
  uninstall_remote_only: '本地记录已卸载。应用本体还在另一个引擎上 —— 切换引擎后再卸载一次才能删掉它。',

};
