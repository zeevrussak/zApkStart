'use strict';
// autodebug / zh-CN — 由 i18n 抽取流程填充（设计见 docs/zapkstart/design.md §Phase 3）
module.exports = {
  // ---- 分类（设置页分组导航） ----
  category_runtime: '运行时',
  category_runtime_hint: '安卓虚拟机进程、启动阶段、快照与残留锁',
  category_device: '设备连接',
  category_device_hint: 'adb 授权状态、设备是否在线',
  category_storage: '存储',
  category_storage_hint: '磁盘余量、数据分区、共享目录',
  category_settings: '设置',
  category_settings_hint: '配置之间的冲突与互相抵消',
  category_network: '网络',
  category_network_hint: '安卓网络与下载源连通性',
  category_logs: '日志',
  category_logs_hint: '运行日志里的错误',

  // ---- 运行时 ----
  boot_failed_title: '安卓运行时上次启动失败',
  boot_failed_hint: '运行时的真实报错已经拿到，按这条原因处理通常一次就能恢复。',
  stuck_boot_title: '安卓开机卡在引导阶段',
  stuck_boot_hint: '已经引导超过 2 分半还没进系统。常见原因是快速启动快照损坏，重启运行时（会走一次冷启动）通常能解决。',
  stuck_boot_detail: '阶段：{phase}',
  stale_locks_title: '检测到 {count} 个上次残留的锁文件',
  stale_locks_hint: '锁文件没清会让下一次启动被判定为「AVD 已被占用」而直接失败。可以一键清掉。',
  orphan_processes_title: '有 {count} 个残留的模拟器进程',
  orphan_processes_hint: '上次没有正常关机的安卓进程还占着资源与 AVD 锁，会让下次开机失败。可以一键清理（不会动已装应用与存档）。',
  stale_snapshot_title: '快速启动快照已损坏',
  stale_snapshot_hint: '快照文件还在但校验不通过，每次开机都要额外冷启动一次。删掉它会用一次冷启动换回磁盘空间。',

  // ---- 设备连接 ----
  unauthorized_title: '安卓设备未授权调试',
  unauthorized_hint: '安卓侧弹过「允许 USB 调试吗」但没被确认，adb 一直连不上。重启运行时（走一次冷启动）会重新弹出确认框，确认后即恢复。',
  offline_title: '安卓设备处于 offline 状态',
  offline_hint: 'adb 能看到设备但连不上，通常是虚拟机还在引导或 adb 服务没握手成功。等一会儿仍不恢复就重启运行时。',
  missing_device_title: '运行时在跑，但 adb 没看到设备',
  missing_device_hint: '安卓进程活着、adb 却看不到设备，多半是 adb 服务端口被别的程序占了，或者引导还没完成。',

  // ---- 存储 ----
  disk_critical_title: '运行时所在磁盘快满了',
  disk_critical_hint: '剩余空间不足 2 GB，装应用和写快照都会失败。点「一键清理」回收旧镜像、旧快照和日志。',
  disk_low_title: '运行时所在磁盘空间偏紧',
  disk_low_hint: '剩余不足 8 GB，快照和系统镜像还需要空间。建议先清理一次可回收文件。',
  remaining_mb: '剩余 {mb} MB',
  data_needs_reset_title: '数据分区扩容没有真正生效',
  data_needs_reset_hint: '快速启动用的差量盘挡着就地扩容，guest 里看到的还是旧容量。需要「重置安卓数据」后按新容量重建（会清掉已装应用）。',
  data_mismatch_title: '安卓数据分区比配置的小',
  data_mismatch_hint: '安卓里实际可用容量小于设置里写的值，装大游戏会提示存储空间不足。',
  data_size_detail: '配置 {configured} GB · 实际 {actual} GB',
  shared_broken_title: '共享目录不可用',
  shared_broken_hint: '文件互通用的本机目录不存在或没有写权限，安卓里保存的文件同步不过去。',

  // ---- 设置 ----
  orientation_conflict_title: '屏幕方向策略与当前面板方向相反',
  orientation_conflict_hint_portrait: '策略要求竖屏，但面板现在是横屏，安卓只会给应用一条窄画面加两侧黑边。把面板方向改成与策略一致即可。',
  orientation_conflict_hint_landscape: '策略要求横屏，但面板现在是竖屏，看剧/游戏会是一条竖着的窄画面。把面板方向改成与策略一致即可。',
  detached_fullscreen_title: '原生窗口模式下的「启动时自动全屏」不会生效',
  detached_fullscreen_hint: '原生窗口由模拟器自己开窗，全屏由它自己决定，不受这里的开关控制。想铺满屏幕可在窗口里按 F11，或把窗口承载方式改成嵌入模式。',
  snapshot_off_low_disk_title: '磁盘偏紧，快速启动快照已关闭',
  snapshot_off_low_disk_hint: '当前磁盘余量不到 4 GB，快照又被关掉：打开应用会走一次完整冷启动（十几秒）。磁盘够的话建议重新打开快照。',

  // ---- 声音 ----
  audio_disabled_title: '安卓应用声音已在设置里关闭',
  audio_disabled_hint: '安卓声音开关被关掉了，所以只有 zApkStart 里的应用没声音。点「处理」重新打开，并重启一次运行时即可。',
  audio_service_stopped_title: 'Windows 音频服务（Audiosrv）未运行',
  audio_service_stopped_hint: '这会连系统其它软件一起没声音。到 services.msc 启动 Windows Audio 并设为自动，或在管理员 PowerShell 里执行 net start Audiosrv。',
  microphone_disabled_title: '麦克风输入已在设置里关闭',
  microphone_disabled_hint: '应用里的语音、通话、录音会失败（查不到录音设备）。点「处理」重新打开并重启一次运行时即可；同时确认 Windows 的麦克风权限已允许桌面应用访问。',

  // ---- 网络 ----
  network_down_title: '安卓里没有网络',
  network_down_hint: '安卓侧解析或联网失败，视频/资讯类应用会一直转圈。可以用「修复网络」重置安卓数据解决（应用清单会保留）。',
  sources_down_title: '{count} 个下载源连不上',
  sources_down_hint: '更新检查会同时问多个源，有一个不通不影响使用；如果全都不通，请检查网络或代理。',

  // ---- 日志 ----
  logs_errors_title: '运行日志里有 {count} 条错误',
  logs_errors_hint: '最近一次运行留下了错误记录，展开诊断报告可以看到完整上下文。',

  // ---- 加速 ----
  software_emulation_title: '当前没有硬件加速',
  software_emulation_hint: '只能跑纯软件模拟，开机慢到几分钟、画面也容易掉帧。开启「Windows 虚拟机监控程序平台」后重启即可。',
};
