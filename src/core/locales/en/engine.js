'use strict';
// engine / en — English catalog for src/core/engine.js (contract: src/core/i18n.js)
module.exports = {
  // status()
  adb_missing: 'adb is missing: click "One-click deploy" to download it automatically',

  // bootEmulator()
  accel_fallback_notice: 'No hardware acceleration detected: falling back to software emulation automatically (the first boot will be noticeably slower; no action needed)',
  auth_title: 'Android debugging authorization not completed (one "Allow" click needed)',
  auth_hint: 'The emulator is stuck on the "Allow USB debugging?" dialog. Click "Allow" in that emulator window — check "Always allow from this computer" and tap again; it will not ask afterwards. If the dialog is unresponsive or never appears: Settings → Runtime → Clear Android data and retry (this removes installed apps — reinstall them; your APK files are not affected).',
  auth_repair_log: 'adb is stuck on the "Allow USB debugging" authorization dialog; invalidating the old snapshot and cold-booting to re-inject the public key…',
  adb_reconnect_log: 'adb connection error; restarting the adb server and continuing to wait…',
  boot_failed_default: 'The Android runtime failed to start',

  // prewarm()
  prewarm_prefix: 'Pre-warming: {msg}',
  prewarm_done: 'Pre-warm finished ({sec}s)',

  // bootQemu()
  err_qemu_missing: 'QEMU is not installed; finish the runtime deployment first',
  err_iso_missing: 'System image (ISO) is not ready',
  err_disk_missing: 'Android has not been installed to the virtual disk yet',
  accel_whpx: 'WHPX hardware acceleration',
  accel_sw: 'pure software emulation',
  boot_mode_log: 'Starting runtime ({mode})…',
  spawn_failed: 'Start failed: {msg}',
  qemu_exited: 'Runtime exited (code={code})',
  err_qemu_start: 'QEMU failed to start; see the log for details: {log}',
  installer_started: 'The installer has started; follow its wizard in the VM window to finish installation',
  err_adb_no_connect: 'The VM started but adb could not connect: enable "Developer options → ADB over network" in the VM and retry',
  err_kernel_boot: 'The Android kernel did not finish booting; check the runtime log (the image may be corrupt or acceleration is not taking effect)',
  err_services_not_ready: 'Android booted but system services are not ready (possibly stuck on the first-boot setup wizard; complete it in the VM window)',

  // waitAndroidReady() / waitAdb()
  kernel_up_wait: 'Android kernel is up; waiting for system services… ({sec}s)',
  android_ready: 'Android is ready ({sec}s)',
  waiting_services: 'Waiting for system services… {sec}s',
  waiting_android: 'Booting Android… {sec}s',
  waiting_adb: 'Waiting for Android to start… {sec}s',

  // prepare() — guest language / IME
  ime_status: 'Chinese input method: {status}',
  ime_installed: 'installed and enabled',
  ime_ready: 'ready',
  ime_not_ready: 'not ready',
  guest_locale_skip: 'Guest language init skipped: {msg}',
  empty: '(empty)',
  sys_locale_reset: 'System language is still {cur}; invalidating the old snapshot — the next boot cold-starts to switch to {want}',
  sys_locale_skip: 'System language correction skipped: {msg}',

  // QEMU monitor / installer
  err_monitor_timeout: 'monitor timed out',
  err_need_iso: 'Download/import an Android system image (ISO) first',
  err_installer_boot: 'Failed to start the install environment',

  // adoptExisting()
  adopt_none: 'No leftover runtime found; preparing a cold start',
  adopt_found: 'Found {count} leftover runtime(s) (ports {ports}); trying to adopt them',
  adopt_not_ready: 'Found a leftover runtime ({serial}) but it is not ready; shutting it down and rebooting',
  adopt_ok: 'Adopted the running runtime ({serial})',

  // _ensureInner()
  adb_zombie: 'adb reports the device online but commands fail (the emulator may be restarting); relaunching the runtime…',
  stuck_restart: 'Detected a stuck runtime; restarting…',
  materialize_failed: 'Failed to expand the system image: {msg}',
  err_need_sysimg: 'System image still missing: click "Download system image"',
  err_not_provisioned: 'Runtime components are not fully deployed yet',

  // multi-window / container session
  multiwindow_tombstone: 'Multi-window: foreground {pkg}, keeping {kept} in background, tombstoning {n}',
  multiwindow_ok: 'Multi-window: {count} apps coexist, no reclaim needed',
  container_parked: 'Container parked (Android resident, 0 app processes, qemu at lowest priority)',

  // orientation / display self-heal
  orient_heal: 'Orientation heal: init={init} cur={cur} is rotated; re-converging',
  display_converge: 'Display state converged: ignore-orientation={ignore} density={density} → fixing',
  density_skip_foreground: 'density={density} missing but an app is in the foreground: skipping, will be set on next launch (avoids a shrunken picture)',

  // network wait & repair
  waiting_net: 'Waiting for the Android VM to get online… {sec}s',
  wifi_retry: 'The VM cannot connect to Wi-Fi; trying to reconnect…',
  net_restored_save: 'Network restored ({ip}); saving the working state so it works directly next time.',
  net_cold_boot: 'Network still not ready; cold-booting the VM once (without loading the snapshot) and retrying…',
  net_repair_start: 'Repairing the VM network: trying to reconnect Wi-Fi first (installed apps are not affected)…',
  err_vm_boot: 'The VM failed to start',
  net_restored_saved: 'Network restored ({ip}); a working snapshot has been saved.',
  cold_boot_retry: 'Reconnect failed; cold-booting the VM once (no snapshot loaded, data kept)…',
  net_reset_data: 'Still no network; resetting Android data and rebooting (the app list is kept; apps reinstall when opened)…',
  net_restored_gw: 'Network restored ({ip} gateway {gw}); a working snapshot has been saved.',
  gw_reachable: 'reachable',
  net_reset_still_offline: 'Still offline after the reset. Check whether the local network/firewall blocks the emulator (netsimd uses local loopback ports).',

  // WSA / external-adb-device dispatch (docs/zapkstart/wsa-backend.md)
  wsa_idle_disconnect: 'Idle reclaim: disconnected the WSA adb transport (the VM stays running; it is user-managed)',
  adb_server_reset_skip_wsa: 'Skipping the adb server restart: it would wipe the WSA registration on the shared adb server',
};
