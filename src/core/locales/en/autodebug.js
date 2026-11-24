'use strict';
// autodebug / en — 由 i18n 抽取流程填充（设计见 docs/zapkstart/design.md §Phase 3）
module.exports = {
  // ---- Categories (settings page group navigation) ----
  category_runtime: 'Runtime',
  category_runtime_hint: 'Android VM processes, startup phases, snapshots and stale locks',
  category_device: 'Device connection',
  category_device_hint: 'adb authorization state and whether the device is online',
  category_storage: 'Storage',
  category_storage_hint: 'Free disk space, data partition, shared directory',
  category_settings: 'Settings',
  category_settings_hint: 'Conflicts between options that cancel each other out',
  category_network: 'Network',
  category_network_hint: 'Android networking and download-source connectivity',
  category_logs: 'Logs',
  category_logs_hint: 'Errors found in the run logs',

  // ---- Runtime ----
  boot_failed_title: 'Android runtime failed to start last time',
  boot_failed_hint: 'The real error from the runtime was captured; fixing this cause usually restores it in one attempt.',
  stuck_boot_title: 'Android is stuck at the boot stage',
  stuck_boot_hint: 'It has been booting for over 2.5 minutes without entering the system. The common cause is a corrupted quick-boot snapshot; restarting the runtime (a full cold start) usually fixes it.',
  stuck_boot_detail: 'Phase: {phase}',
  stale_locks_title: 'Found {count} leftover lock file(s) from the last run',
  stale_locks_hint: 'Uncleaned lock files make the next start fail immediately as "AVD already in use". They can be cleared with one click.',
  orphan_processes_title: '{count} leftover emulator process(es) are running',
  orphan_processes_hint: 'Android processes from an unclean shutdown still hold resources and the AVD lock, which breaks the next start. One-click cleanup leaves installed apps and save data untouched.',
  stale_snapshot_title: 'The quick-boot snapshot is corrupted',
  stale_snapshot_hint: 'The snapshot file exists but fails verification, so every start pays an extra cold boot. Deleting it trades one cold boot for the disk space back.',

  // ---- Device connection ----
  unauthorized_title: 'Android device is not authorized for debugging',
  unauthorized_hint: 'Android showed an "Allow USB debugging?" prompt that was never confirmed, so adb cannot connect. Restarting the runtime (a cold start) shows the prompt again; confirm it and the connection recovers.',
  offline_title: 'Android device is offline',
  offline_hint: 'adb can see the device but cannot connect — usually the VM is still booting or the adb service did not finish handshaking. If it does not recover soon, restart the runtime.',
  missing_device_title: 'The runtime is running, but adb sees no device',
  missing_device_hint: 'The Android process is alive but adb sees no device — the adb service port is probably taken by another program, or booting has not finished yet.',

  // ---- Storage ----
  disk_critical_title: 'The disk holding the runtime is almost full',
  disk_critical_hint: 'Less than 2 GB left; installing apps and writing snapshots will fail. Click "Clean up" to reclaim old images, old snapshots and logs.',
  disk_low_title: 'The disk holding the runtime is running low',
  disk_low_hint: 'Less than 8 GB left; snapshots and the system image still need space. Run a cleanup first to reclaim files.',
  remaining_mb: '{mb} MB free',
  data_needs_reset_title: 'The data partition resize never actually took effect',
  data_needs_reset_hint: 'The delta disk used by quick boot blocks in-place resizing, so the guest still sees the old size. "Reset Android data" is needed to rebuild at the new size (installed apps are removed).',
  data_mismatch_title: 'The Android data partition is smaller than configured',
  data_mismatch_hint: 'The space actually available inside Android is smaller than the configured value; installing large games will report insufficient storage.',
  data_size_detail: 'Configured {configured} GB · actual {actual} GB',
  shared_broken_title: 'The shared directory is unavailable',
  shared_broken_hint: 'The local folder used for file exchange does not exist or is not writable, so files saved inside Android do not sync over.',

  // ---- Settings ----
  orientation_conflict_title: 'The orientation policy contradicts the current panel orientation',
  orientation_conflict_hint_portrait: 'The policy asks for portrait but the panel is currently landscape, so Android only gives apps a narrow strip with black bars on the sides. Make the panel orientation match the policy.',
  orientation_conflict_hint_landscape: 'The policy asks for landscape but the panel is currently portrait, so video/games render as a narrow vertical strip. Make the panel orientation match the policy.',
  detached_fullscreen_title: '"Auto-fullscreen on launch" has no effect in native-window mode',
  detached_fullscreen_hint: 'In native-window mode the emulator opens its own window and decides fullscreen itself; this toggle does not control it. Press F11 inside the window to fill the screen, or switch the window mode to embedding.',
  snapshot_off_low_disk_title: 'Disk is tight, so the quick-boot snapshot was turned off',
  snapshot_off_low_disk_hint: 'Less than 4 GB free and the snapshot is off: opening an app does a full cold start (a dozen seconds or so). If disk space allows, turn the snapshot back on.',

  // ---- Audio ----
  audio_disabled_title: 'Android app sound is turned off in settings',
  audio_disabled_hint: 'The Android sound switch is off, which is why only apps inside zApkStart are silent. Click "Fix" to turn it back on, then restart the runtime once.',
  audio_service_stopped_title: 'The Windows Audio service (Audiosrv) is not running',
  audio_service_stopped_hint: 'This silences other software on the system too. Start Windows Audio in services.msc and set it to Automatic, or run net start Audiosrv in an admin PowerShell.',
  microphone_disabled_title: 'Microphone input is turned off in settings',
  microphone_disabled_hint: 'Voice, calls and recording inside apps will fail (no recording device is found). Click "Fix" to turn it back on and restart the runtime once; also make sure Windows microphone privacy settings allow desktop apps.',

  // ---- Network ----
  network_down_title: 'Android has no network',
  network_down_hint: 'DNS or connectivity fails on the Android side, so video/news apps spin forever. "Repair network" resets Android data to fix it (the app list is kept).',
  sources_down_title: '{count} download source(s) unreachable',
  sources_down_hint: 'Update checks ask several sources at once; one being down does not affect use. If all of them fail, check your network or proxy.',

  // ---- Logs ----
  logs_errors_title: '{count} error(s) in the run logs',
  logs_errors_hint: 'The last run left error records; expand the diagnostic report to see the full context.',

  // ---- Acceleration ----
  software_emulation_title: 'No hardware acceleration right now',
  software_emulation_hint: 'Only pure software emulation runs — startup takes minutes and the picture stutters. Enable "Windows Hypervisor Platform" and reboot.',
};
