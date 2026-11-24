'use strict';
// provision / zh-CN — src/core/provision.js 的用户可见文案（原文抽取，契约见 src/core/i18n.js）
module.exports = {
  // assertComplete()
  incomplete_download: '{label}下载不完整（{mb} MB），已清理，请重试',
  label_adb_pack: 'adb 安装包',
  label_runtime_pack: '运行时整包',
  label_engine: '运行时引擎',
  label_compat_img: '兼容镜像',
  label_qemu_pack: 'QEMU 安装包',

  // guardDisk()
  disk_guard_error: '目标磁盘空间不足：该组件约需 {need} MB，但「{dir}」所在盘仅剩 {free} MB。\n建议：把「运行时数据目录」改到空间更大的盘（设置 → 系统集成 → 运行时数据目录 → 浏览），或先清理磁盘 / 卸载不用的应用后再试。',

  // hypervisor()
  note_non_windows: '非 Windows 平台',
  hv_dll_present: '虚拟机平台组件存在（可用性由运行时引擎检测）',
  hv_arm64_note: 'ARM64 上无法用 WHPX/AEHD 加速 x64 引擎（Google 不提供 ARM64 引擎）。继续只会更慢或失败。',
  hv_missing_note: '未检测到 Windows Hypervisor Platform 组件：可在「启用或关闭 Windows 功能」中勾选「虚拟机平台」后重启',

  // inspectIso()
  iso_not_downloaded: '未下载',
  iso_too_small: '文件只有 {mb}MB，下载未完成',
  iso_bad_magic: '文件不是有效的 ISO9660 镜像（可能是下载到错误页或文件已损坏）',

  // checkEnv()
  note_not_installed: '未安装',
  sysimg_note_ok: 'Android {api}（{gb} GB{extra}）',
  sysimg_compressed_suffix: '，包内压缩版，首次启动自动展开',
  sysimg_note_compat: 'Android {api}（{extra}）',
  sysimg_packed_note: '包内压缩版，首次启动自动展开',
  compat_label: 'ARM 兼容镜像',
  not_downloaded: '未下载',
  note_disk_not_created: '尚未创建',

  // installAdb()
  progress_adb_download: '下载 Android platform-tools（约 8MB）…',
  progress_adb_bytes: '下载 adb… {got}MB / {total}MB',
  progress_adb_extract: '解压 adb…',
  err_adb_broken: 'adb 解压后无法运行，请检查是否被杀毒软件拦截',
  progress_adb_done: 'adb {version} 就绪',

  // resolveRuntimePack()
  source_unreachable: '{name} 不可达',
  err_no_runtime_pack: '发布页上没有运行时整包{errs}',

  // installRuntimePack()
  progress_pack_info: '正在获取运行时版本信息…',
  progress_picking_source: '正在挑选最快的下载源（{source}）…',
  progress_runtime_download: '下载运行时（约 1.5 GB，只需一次，{conn} 线程）…',
  eta_suffix: ' · 剩余约 {min} 分钟',
  progress_runtime_bytes: '下载运行时 {info}',
  progress_pack_extract: '解压运行时（约 1 分钟）…',
  progress_extract_entry: '解压 {done}/{all}',
  progress_sysimg_expand: '展开系统镜像（约 1 分钟，只需一次）…',
  progress_done_ready: '运行时已就绪',

  // materializeImages()
  copy_component_failed: '复制镜像组件失败：{msg}',
  progress_expand_image: '首次启动：正在展开系统镜像 {name}（约 1 分钟，只需一次）',
  err_lzma_missing: '安装包不完整：缺少解压组件 @napi-rs/lzma，系统镜像无法展开。请重新下载完整版，或改用商店版。',
  expand_image_failed: '展开镜像失败：{msg}',
  err_materialize: '系统镜像展开失败（{reasons}）',

  // systemImageInfo()
  note_image_incomplete: '镜像不完整',
  note_missing_system_img: '缺少 system.img',

  // emulatorAccel()
  note_not_installed_emulator: '未安装 emulator',
  accel_whpx_on: 'WHPX 硬件加速已启用',
  accel_aehd_on: 'AEHD 硬件加速已启用',
  accel_aehd_on_checkmissing: 'AEHD 硬件加速已启用（emulator-check 缺失，按驱动判定）',
  accel_none_arm64: '未启用硬件加速：ARM64 上无法用 WHPX/AEHD 加速 x64 引擎（Google 不提供 ARM64 引擎），将继续以软件模拟运行',
  accel_none_fallback: '未启用硬件加速：将回退软件模拟（能跑但很慢）。建议安装 AEHD 驱动或开启「虚拟机平台」',

  // installEmulator()
  progress_engine_download: '下载运行时引擎（约 440MB，走 Google 官方源）…',
  progress_engine_bytes: '下载运行时引擎 {got}MB / {total}MB{speed}',
  progress_engine_extract: '解压运行时引擎…',
  err_emulator_broken: 'emulator 解压后无法运行，请检查是否被杀毒软件拦截',
  progress_engine_done: '运行时引擎 {version} 就绪',

  // playImageInfo() / installPlayImage()
  progress_compat_download: '下载 ARM 兼容镜像（Android 14，约 1.5GB）…',
  progress_compat_bytes: '下载兼容镜像 {got}MB / {total}MB{speed}',
  progress_compat_extract: '解压兼容镜像（3GB，需十余秒）…',
  progress_compat_entry: '解压兼容镜像 {i}/{total}',
  err_compat_verify: '兼容镜像解压后校验失败',
  progress_compat_done: 'ARM 兼容镜像就绪，重新启动运行时即可生效',

  // installAehd()
  err_arm64_aehd: 'ARM64 上无法使用 AEHD 加速 x64 引擎（Google 不提供 ARM64 引擎）',
  progress_aehd_download: '下载 AEHD 驱动…',
  err_aehd_extract: 'AEHD 驱动包解压异常',
  progress_aehd_done: 'AEHD 驱动已就绪，需管理员权限安装',

  // installQemu()
  progress_qemu_resolve: '查找最新 QEMU 版本…',
  progress_qemu_download: '下载 QEMU（约 200MB）…',
  progress_qemu_bytes: '下载 QEMU… {got}MB / {total}MB{speed}',
  progress_qemu_install: '正在安装 QEMU（静默）…',
  err_qemu_missing_exe: 'QEMU 安装后未找到 qemu-system-x86_64.exe：可手动下载 QEMU 并解压到 engine/qemu/',
  progress_qemu_done: 'QEMU {version} 就绪',

  // downloadIso()
  progress_iso_download: '下载 Android-x86 9.0-r2（约 900MB，8 线程分块）…',
  progress_iso_bytes: '下载系统镜像… {got}MB / {total}MB{speed}',
  err_iso_unusable: '系统镜像不可用：{reason}{resume}',
  iso_resume_suffix: '，可再次点击继续断点续传',
  progress_iso_done: '系统镜像就绪（{gb} GB）',

  // inspectImage() / importIso()
  err_file_empty: '文件不存在或为空',
  err_image_unusable: '镜像文件不可用',

  // createDisk()
  progress_disk_create: '创建 {gb}GB 虚拟磁盘…',
  err_qemuimg_disk: 'qemu-img 创建虚拟磁盘失败：{detail}',
  err_qemuimg_missing: '未找到 qemu-img.exe，请先安装 QEMU',
  progress_disk_done: '虚拟磁盘已创建',
};
