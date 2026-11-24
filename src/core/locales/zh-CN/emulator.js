'use strict';
// emulator / zh-CN — src/core/emulator.js 的用户可见文案（原文抽取，契约见 src/core/i18n.js）
module.exports = {
  // describeExitCode()
  exit_ok: '正常退出',
  exit_arg_env_error: '启动参数或环境错误',
  exit_access_violation: '0xC0000005 访问冲突，渲染后端崩溃',
  exit_stack_overflow: '0xC00000FD 栈溢出',
  exit_dll_missing: '0xC0000135 依赖 DLL 加载失败（原因待查，见内置手册 6.8）',
  exit_access_denied: '0xC0000022 拒绝访问（驱动或权限问题）',
  exit_arch_mismatch: '0xC000007B 镜像位数不匹配或 DLL 损坏',

  // killOrphanProcesses()
  kill_orphans: '清理 {count} 个残留模拟器进程',

  // ensureAvd()
  tag_compat: 'Google Play (ARM 兼容)',

  // ensureDataPartition()
  userdata_grown: 'userdata 扩容：文件 {from} → {to}，文件系统 {fsFrom} → {fsTo}',
  userdata_grow_failed: '扩容 userdata 失败（继续用现有分区）：{msg}',
  userdata_rebuilt: '已重建 userdata：{gb}GB ext4（4K block，支持 FBE）',
  userdata_rebuild_failed: '重建 userdata 失败：{msg}',
  err_qemuimg: 'qemu-img {op} 失败: {detail}',
  err_resize2fs_missing: '缺少 resize2fs.exe',
  err_resize2fs: 'resize2fs 失败: {detail}',

  // spawnOnce()
  emu_exited: '运行时已退出（code={code}{meaning}）',

  // resizeDataPartition()
  resize_overlay_error: '安卓正在用快速启动的差量盘，就地扩容改不到它（目标 {gb} GB）。需要「重置安卓数据」后按新容量重建 /data —— 已装应用和存档会被清空，请先确认。',
  resize_fs_shortfall: '镜像已扩到 {want} GB，但文件系统只到 {actual} GB（resize2fs 没成功）。可以再点一次「立即扩容」，或清理磁盘后重试。',

  // start()
  prev_emu_exited: '上一次的模拟器已经退出，重新开机…',
  err_no_engine: '未安装运行时引擎，请先在「运行时」页完成部署',
  err_no_sysimg: '系统镜像未就绪，请先在「运行时」页下载 Android 系统镜像',
  disk_full_avd: '磁盘空间不足：安卓数据目录（{dir}）所在磁盘只剩 {free} GB，运行时至少要 {need} GB 可用。请在「设置 → 系统集成 → 安卓数据目录」把它改到空间充足的盘（例如 D:），或先清理磁盘。你的应用与存档不会被自动删除。',
  disk_full_root: '运行时目录（{dir}）所在磁盘只剩 {free} GB，连日志和临时文件都写不下。请清理磁盘，或把「运行时数据目录」也换到别的盘。',
  driver_load_failed_log: '驱动加载失败：{msg}',
  driver_load_failed_ui: '驱动加载失败（已忽略，按默认参数启动）：{msg}',
  drivers_applied: '已应用驱动：{names}',
  drivers_none: '未匹配到任何驱动，按默认参数启动',
  drivers_errors: '有 {count} 个驱动文件没加载成功（设置 → 驱动 里能看到原因）',
  driver_gpu_fixed: '驱动把渲染后端固定为 {gpu}',
  variant_driver_tcg: '{gpu} / 驱动要求软件模拟',
  driver_tcg_notice: '驱动要求关闭硬件加速（走软件模拟）',
  vulkan_retry_notice: '上次 host 渲染崩溃疑似 Vulkan 导致，本次以 -feature -Vulkan 重试硬件加速',
  bad_gpu_switch: '上次 {gpu} 渲染后端启动即崩溃，本次改用 {next} 先试',
  boot_attempt: '启动运行时（第 {i}/{total} 次：{label}）…',
  disk_full_stop: '磁盘空间不足，已停止重试（不会动你的应用与存档）。',
  retry_next: '{title}，自动换一组参数重试…',
  booting_progress: '正在开机… {sec}s',
  boot_ready: '运行时就绪（{sec}s，{label}）',
  net_missing_notice: '⚠ 安卓虚拟机暂时没连上网（Wi-Fi 未关联或没拿到地址）。需要联网的应用打开后可能一直黑屏：稍后重开应用即可；若持续无网，可在「设置 → 修复网络」重连（不会删除已装应用）。',
  boot_timeout: '开机超时（可能是首次引导较慢或硬件加速未生效）',
  err_boot_exhausted: '运行时多次尝试仍未能启动（{title}）。\n{hint}\n\n已尝试：{attempts}\n诊断报告：{report}',

  // 快照
  snapshot_skip_space: '跳过快照保存：磁盘剩余 {free}GB < 需要 {need}GB',
  snapshot_invalidate_unauth: '关机时 guest 未授权/未就绪：将作废快照，下次冷启动重新注入调试授权',
  snapshot_skip_unauth: '跳过快照保存：guest 未授权或未开机完成（避免存入未授权的毒快照）',
};
