'use strict';
// preflight / zh-CN — src/core/preflight.js 的用户可见文案（原文抽取，契约见 src/core/i18n.js）
module.exports = {
  // recommendGpu() 的建议理由（同时进驱动 notes）
  gpu_why_no_accel: '没有可用的硬件加速，先用软件渲染保证画面能出来',
  gpu_why_unknown_gpu: '显卡型号读不到，交给自动降级链去试',
  gpu_why_small_vram: '显存很小，用 swangle 更稳',
  gpu_why_nvidia_host: 'NVIDIA 驱动成熟，host 直通通常最快',
  gpu_why_amd_host: 'AMD 显卡走 host 才能用上硬件加速；若崩溃会自动降级',
  gpu_why_intel_host: 'Intel 核显走 host 才能用上硬件加速；若崩溃会自动降级',
  gpu_why_auto: '交给自动降级链去试',

  // ---- 1. CPU 虚拟化（BIOS） ----
  vt_unsupported_title: '这颗 CPU 不支持硬件虚拟化',
  vt_unsupported_detail: '只能走软件模拟，速度会慢 5~10 倍。轻量应用还能用，大型游戏不建议。',
  vt_bios_off_title: 'CPU 虚拟化在 BIOS 里没开',
  vt_bios_off_detail: '重启进 BIOS/UEFI，把 Intel VT-x（Intel）或 SVM Mode（AMD）设为 Enabled，保存后回来重新体检。'
    + '联想/戴尔/华硕一般在 Advanced → CPU Configuration 里；品牌机可能叫 Virtualization Technology。',
  vt_bios_off_action: '需要重启进 BIOS，无法自动完成',
  vt_ok_title: 'CPU 虚拟化已在 BIOS 开启',
  vt_ok_detail: '{name} · {cores} 核 / {threads} 线程',
  vt_unknown_title: '读不到 CPU 虚拟化状态',
  vt_unknown_detail: '可能是主板/权限限制。若启动时提示没有硬件加速，请手动进 BIOS 确认 VT-x / SVM 已开启。',
  vt_unknown_action: '手动确认',

  // ---- 2. Windows 侧：WHPX / Hyper-V ----
  arm64_accel_hint: 'ARM64 上无法用 WHPX/AEHD 加速 x64 引擎（Google 不提供 ARM64 引擎）。继续只会更慢或失败。',
  arm64_whpx_on_title: 'ARM64 主机：虚拟机监控程序平台已启用，但对 x64 引擎无效',
  arm64_whpx_off_title: 'ARM64 主机：WHPX/AEHD 硬件加速不可用',
  whpx_ok_title: 'Windows 虚拟机监控程序平台已启用',
  whpx_ok_detail_running: 'Hypervisor 正在运行，WHPX 可用。',
  whpx_ok_detail_restart: '功能已启用；如果加速仍不可用，重启一次让 Hypervisor 起来。',
  whpx_off_title: '「虚拟机监控程序平台」没有启用',
  whpx_off_store_detail: '商店版不能自行改系统功能。按 Win+R → 输入 optionalfeatures → 勾选「Windows 虚拟机监控程序平台」（HypervisorPlatform）与「虚拟机平台」→ 确定 → 重启。',
  whpx_off_store_action: '打开「Windows 功能」窗口',
  whpx_off_installer_detail: '点下面的按钮会自动开启 HypervisorPlatform + VirtualMachinePlatform（需要管理员确认），完成后重启电脑。',
  whpx_off_installer_action: '一键开启（需管理员）',

  // ---- 3. 硬件加速当前是否真的能用 ----
  accel_ok_title: '硬件加速可用（{kind}）',
  accel_ok_detail: '启动会走硬件加速；下面的配置按这台机器的显卡与内存推荐。',
  accel_off_title: '当前没有可用的硬件加速',
  accel_off_detail_aehd: '可以装 AEHD 驱动（需管理员），或先开「虚拟机监控程序平台」后重启；两者都不行就只能软件模拟。',
  accel_off_detail_sw: '会先用软件模拟保证能跑；速度比硬件加速慢 5~10 倍。',
  accel_off_action: '安装 AEHD 驱动（需管理员）',

  // ---- 4. 显卡 ----
  gpu_unknown_title: '读不到显卡信息',
  gpu_unknown_detail: '可能是远程桌面 / 虚拟机 / 驱动异常。渲染后端交给自动降级链处理。',
  gpu_vram: '{gb} GB 显存',
  gpu_vram_integrated: '（核显，其余走共享内存）',
  gpu_vram_unknown: '显存未知',
  gpu_driver_seg: ' · 驱动 {version}',
  gpu_date_seg: '（{date}）',
  gpu_driver_old_title: '显卡驱动比较旧',
  gpu_driver_old_detail: '驱动日期 {date}（约 {years} 年前）。老驱动是「起来后黑屏 / 花屏」的常见原因，建议去厂商官网更新。',

  // ---- 5. 内存 / 系统版本 ----
  mem_unknown_title: '读不到物理内存',
  mem_low_title: '内存偏小（{gb} GB）',
  mem_low_detail: '安卓虚拟机最多只能分 2 GB、2 核，画质降到 540×960，并建议关掉浏览器标签页再开应用。',
  mem_ok_title: '物理内存 {gb} GB',
  os_old_title: 'Windows 版本较旧（build {build}）',
  os_old_detail: '{product} 最低支持 Windows 10 2004（build 19041）。更旧的系统上 emulator 可能直接退出。',

  // ---- 自动生成的驱动 ----
  driver_name: '本机自动配置（{gpu}）',
  driver_author: '{product} 体检',
  driver_description: '由「本机体检 · 自动配置」生成：{why}。{accel}',
  accel_available: '硬件加速可用。',
  accel_unavailable: '当前无硬件加速。',

  // ---- 汇总 ----
  list_sep: '、',
  summary_bad: '发现 {count} 项必须先处理（{titles}）',
  summary_warn: '有 {count} 项建议优化（{titles}）',
  summary_good: '这台机器可以直接跑硬件加速，配置已经是最优',

  // ---- WSA 卡片（docs/zapkstart/wsa-backend.md 措辞规则：中性、显式点击）----
  wsa_found_title: '检测到 WSA —— 这台机器上原生跑应用的实际途径',
  wsa_found_detail_arm64: 'Hyper-V 虚拟机里的原生 ARM64 Android 13 —— 没有 CPU 模拟。应用在 WSA 自己的 freeform 窗口里、经 adb 运行；x86-only 和依赖 Play 认证的应用跑不了（core-lane 构建没有 Google 服务）。',
  wsa_found_detail_x64: '已安装 WSA。注意：启用 WSA 会打开 Hyper-V，这会停用自带运行时的 AEHD 加速 —— 两个引擎都仍然可用（QEMU 落到 WHPX/软件模拟）。',
  wsa_absent_title: '未安装 Windows Subsystem for Android',
  wsa_absent_detail_arm64: '微软已于 2025 年 3 月结束 WSA 支持；存在一个社区续作（与微软无隶属关系、也未获微软背书）：MustardChef/WSABuilds。安装前请先阅读其条款。WSA 在 ARM64 上原生运行应用，没有 CPU 模拟。',
  wsa_link_action: '了解 WSA（社区续作）',
};
