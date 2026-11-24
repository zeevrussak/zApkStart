'use strict';
// doctor / zh-CN — src/core/doctor.js 的用户可见文案（原文抽取，契约见 src/core/i18n.js）
module.exports = {
  // ARM64 统一口径（与 preflight 一致）
  arm64_accel_hint: 'ARM64 上无法用 WHPX/AEHD 加速 x64 引擎（Google 不提供 ARM64 引擎）。继续只会更慢或失败。',

  // planVariants()
  accel_hw: '硬件加速',
  accel_sw: '软件模拟',
  variant_sw_off: '关闭加速的软件模拟（慢，但兼容性最好）',
  variant_safe_cold: '保守冷启动（最小内存 + 清快照）',

  // diagnose() 规则文案
  diag_access_violation_title: '渲染后端崩溃（0xC0000005 访问冲突）',
  diag_access_violation_hint: '已自动改用更保守的渲染后端重试，并记住这个后端下次不再先试。若反复出现，请更新显卡驱动；或在设置 → 性能与资源里把画质调低、关闭远程桌面/虚拟机显卡直通后再试。',
  diag_gpu_init_title: '显卡渲染后端初始化失败',
  diag_gpu_init_hint: '已自动切换软件渲染重试。若仍失败，请更新显卡驱动，或关闭远程桌面/虚拟机显卡直通后再试。',
  diag_gpu_mode_title: '当前运行时不接受该 GPU 模式',
  diag_gpu_mode_hint: '已自动按运行时版本挑选可用的 GPU 模式重试（老版本用 swiftshader_indirect，新版本用 software）。',
  diag_accel_title: '硬件加速不可用',
  diag_accel_hint: '已自动回退软件模拟（首次启动会明显变慢）。想要流畅可用，请在「Windows 功能」勾选「虚拟机平台」，或安装 AEHD 驱动后重启。',
  diag_memory_title: '内存分配失败',
  diag_memory_hint: '已自动下调分配给 Android 的内存与核心数。请关闭占内存的程序后重试。',
  diag_port_busy_title: '模拟器端口被占用',
  diag_port_busy_hint: '已自动换用空闲端口。若反复出现，请退出夜神/MuMu/蓝叠等模拟器，或重启电脑。',
  diag_avd_lock_title: '上次运行残留了锁文件',
  diag_avd_lock_hint: '已自动清理 AVD 锁文件并重新拉起。',
  diag_image_title: '系统镜像缺失或损坏 / 与旧用户数据不兼容',
  diag_image_hint: '已自动用干净的用户数据重新开机。若仍失败，请在「运行时」里删除镜像后重新下载。',
  diag_dll_title: '运行时依赖 DLL 加载失败（具体原因待定位）',
  diag_dll_hint: '常见原因：商店版从只读目录启动子进程的路径限制、VC++ 运行库缺失、杀毒隔离了运行时文件。请打开内置手册 6.8 按步骤定位；不要只凭这一条就重装运行库。',
  diag_disk_full_title: '磁盘空间不足，无法启动安卓',
  diag_disk_full_hint: '请把运行时目录（设置 → 系统集成 → 运行时数据目录）改到空间充足的盘，或在设置里关掉「保留快速启动快照」/ 调小数据分区。安卓数据不会被自动清除。',
  diag_non_ascii_title: '安装路径含中文或特殊字符',
  diag_non_ascii_hint: '已自动改用 Windows 短路径。若仍失败，请把 {product} 移到纯英文目录（如 C:\\{product}）。',
  diag_avd_stale_title: '上一次运行没有正常退出，残留了锁文件',
  diag_avd_stale_hint: '{product} 会自动清掉残留锁并重试；若反复出现，请检查是否有别的模拟器正在用同一套运行时。',
  diag_cpu_feature_title: 'CPU 缺少运行时要求的指令集',
  diag_cpu_feature_hint: '这类提示在部分老 CPU 上只是警告、仍能开机；若确实起不来，请把「运行时」里的引擎更新到较旧兼容版本，或换一台支持 VT-x/AVX 的电脑。',
  diag_snapshot_title: '快速启动快照损坏',
  diag_snapshot_hint: '已自动丢弃旧快照走冷启动；下一次正常退出会重新生成快照。',
  diag_unknown_title: '运行时未能完成开机',
  diag_unknown_hint: '已自动按多种参数组合重试。可点「导出诊断报告」把日志发给作者定位。',

  // describeProfile()
  profile_summary: '自动：{mem}GB 内存 · {cores} 核 · {gpu} 渲染 · {accel} · {snap}{lite} · 端口 {port}',
  snap_on: '按需快照',
  snap_off: '冷启动',
  profile_lite: ' · 轻量容器',

  // writeReport()
  report_title: '{product} 诊断报告',
  report_generated_at: '生成时间：{time}',
  report_section_host: '== 本机 ==',
  report_section_profile: '== 自动配置 ==',
  report_section_diag: '== 诊断 ==',
  report_section_extra: '== 附加信息 ==',
  report_section_log: '== 运行时日志（末尾 300 行）==',

  // ---- WSA 分支（docs/zapkstart/wsa-backend.md）----
  wsa_diag_title: 'WSA 运行时诊断',
  wsa_diag_hint: 'WSA 上的失败通常在传输层：开发人员设置里的 ADB 开关没开、调试授权弹窗没人点，或者子系统被关掉了。打开任意一个已装应用即可唤醒 WSA。core-lane 构建没有 Google 服务（依赖 GMS 的应用跑不了）。',
  wsa_aehd_note: '在 x64 主机上，启用 WSA 会打开 Hyper-V，这会停用自带运行时的 AEHD 加速；两个引擎都仍然可用（QEMU 落到 WHPX 或软件模拟）。',
};
