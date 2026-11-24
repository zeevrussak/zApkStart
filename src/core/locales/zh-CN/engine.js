'use strict';
// engine / zh-CN — src/core/engine.js 的用户可见文案（原文抽取，契约见 src/core/i18n.js）
module.exports = {
  // status()
  adb_missing: '缺少 adb：点击「一键部署」自动下载',

  // bootEmulator()
  accel_fallback_notice: '未检测到硬件加速：将自动回退软件模拟（首次开机会明显变慢，无需手动设置）',
  auth_title: '安卓调试授权未完成（需要点一次「允许」）',
  auth_hint: '模拟器停在「允许 USB 调试？」对话框。请在那个模拟器窗口里点「允许」——勾选「一律允许使用这台计算机进行调试」再点，之后就不会再问。若窗口点不动或一直不出现：设置 → 运行时 → 清空安卓数据后重试（会清掉已装应用，重新安装即可，不会影响 APK 文件）。',
  auth_repair_log: 'adb 卡在「允许 USB 调试」授权对话框，正在作废旧快照并冷启动以重新注入公钥…',
  adb_reconnect_log: 'adb 连接异常，重启 adb server 后继续等待…',
  boot_failed_default: '安卓运行时未能启动',

  // prewarm()
  prewarm_prefix: '预热：{msg}',
  prewarm_done: '预热完成（{sec}s）',

  // bootQemu()
  err_qemu_missing: '未安装 QEMU，请先完成运行时部署',
  err_iso_missing: '系统镜像（ISO）未就绪',
  err_disk_missing: '尚未安装 Android 系统到虚拟磁盘',
  accel_whpx: 'WHPX 硬件加速',
  accel_sw: '纯软件模拟',
  boot_mode_log: '启动运行时（{mode}）…',
  spawn_failed: '启动失败：{msg}',
  qemu_exited: '运行时已退出（code={code}）',
  err_qemu_start: 'QEMU 启动失败，详见日志：{log}',
  installer_started: '安装程序已启动，请在虚拟机窗口里按引导完成安装',
  err_adb_no_connect: '虚拟机已启动，但 adb 未能连接：请在虚拟机里开启「开发者选项 → ADB over network」后重试',
  err_kernel_boot: 'Android 内核未完成引导，请查看运行时日志（可能镜像损坏或加速未生效）',
  err_services_not_ready: 'Android 已引导但系统服务未就绪（可能停在首次开机设置界面，请在虚拟机窗口里完成向导）',

  // waitAndroidReady() / waitAdb()
  kernel_up_wait: 'Android 内核已启动，等待系统服务就绪…（{sec}s）',
  android_ready: 'Android 已就绪（{sec}s）',
  waiting_services: '正在等待系统服务… {sec}s',
  waiting_android: '正在引导 Android… {sec}s',
  waiting_adb: '等待 Android 启动… {sec}s',

  // prepare() — guest 语言 / 输入法
  ime_status: '中文输入法：{status}',
  ime_installed: '已安装并启用',
  ime_ready: '已就绪',
  ime_not_ready: '未就绪',
  guest_locale_skip: 'Guest 语言初始化跳过：{msg}',
  empty: '(空)',
  sys_locale_reset: '系统语言仍为 {cur}，作废旧快照，下次开机冷启动切到 {want}',
  sys_locale_skip: '系统语言校正跳过：{msg}',

  // QEMU monitor / 启动安装器
  err_monitor_timeout: 'monitor 超时',
  err_need_iso: '请先下载/导入 Android 系统镜像（ISO）',
  err_installer_boot: '安装环境启动失败',

  // adoptExisting()
  adopt_none: '没有发现上一台运行时，准备冷启动',
  adopt_found: '发现 {count} 台残留运行时（端口 {ports}），尝试接管',
  adopt_not_ready: '发现上一台运行时（{serial}）但没就绪，先关掉它再重新开机',
  adopt_ok: '已接管正在运行的运行时（{serial}）',

  // _ensureInner()
  adb_zombie: 'adb 报告设备在线但命令不通（模拟器可能正在重启），重新拉起运行时…',
  stuck_restart: '检测到卡住的运行时，正在重启…',
  materialize_failed: '系统镜像展开失败：{msg}',
  err_need_sysimg: '还差系统镜像：点「下载系统镜像」即可',
  err_not_provisioned: '运行时组件尚未部署完成',

  // 多窗口 / 容器会话
  multiwindow_tombstone: '多窗口：前台 {pkg}，保留后台 {kept} 个，墓碑化 {n} 个',
  multiwindow_ok: '多窗口：{count} 个应用并存，无需回收',
  container_parked: '容器已停放（Android 常驻，0 个应用进程，qemu 最低优先级）',

  // 方向 / 显示自愈
  orient_heal: '方向自愈：init={init} cur={cur} 已躺倒，重新收敛',
  display_converge: '显示状态收敛：ignore-orientation={ignore} density={density} → 补齐',
  density_skip_foreground: 'density={density} 缺失但有应用在前台：跳过，等下次启动时设置（避免画面缩水）',

  // 网络等待与修复
  waiting_net: '正在等待安卓虚拟机联网… {sec}s',
  wifi_retry: '虚拟机连不上 Wi-Fi，正在尝试重新连接…',
  net_restored_save: '网络已恢复（{ip}），正在保存可用状态，下次直接就好。',
  net_cold_boot: '网络仍未就绪，正在冷启动一次虚拟机（不加载快照）后重试…',
  net_repair_start: '正在修复虚拟机网络：先尝试重新连接 Wi-Fi（不影响已装应用）…',
  err_vm_boot: '虚拟机没能启动',
  net_restored_saved: '网络已恢复（{ip}），已存好可用快照。',
  cold_boot_retry: '重新连接没成功，正在冷启动一次虚拟机（不加载快照，数据保留）…',
  net_reset_data: '仍然没有网络，正在重置安卓数据并重新开机（应用清单会保留，点开时自动重装）…',
  net_restored_gw: '网络已恢复（{ip} 网关 {gw}），已存好可用快照。',
  gw_reachable: '可达',
  net_reset_still_offline: '重置后仍未联网。请检查本机网络/防火墙是否拦截了模拟器（netsimd 走本机回环端口）。',

  // WSA / 外接 adb 设备的分发点（docs/zapkstart/wsa-backend.md）
  wsa_idle_disconnect: '空闲回收：已断开 WSA 的 adb 传输（VM 继续运行，它归用户管理）',
  adb_server_reset_skip_wsa: '跳过 adb server 重启：那会清掉共享 adb server 上的 WSA 注册',
};
