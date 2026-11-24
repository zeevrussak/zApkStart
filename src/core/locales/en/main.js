'use strict';
// main / en — English catalog for src/main.js (contract: src/core/i18n.js)
module.exports = {
  // ---- orientation switching / shell window tips ----
  switch_landscape_log: 'Switching to landscape: restarting the Android runtime…',
  switch_portrait_log: 'Switching back to portrait: restarting the Android runtime…',
  switching_landscape: 'Switching to landscape (restarts the Android environment, about 40s, one time only)…',
  switching_portrait: 'Switching back to portrait (restarts the Android environment, about 40s, one time only)…',
  switching_for_landscape: 'Switching {label} to landscape (restarts the Android environment, about 40s, one time only)…',
  switching_for_portrait: 'Switching {label} to portrait (restarts the Android environment, about 40s, one time only)…',
  tip_switching_landscape_short: 'Switching to landscape…',
  tip_switching_portrait_short: 'Switching to portrait…',
  tip_opening_app: 'Opening the app…',
  boot_runtime_tip: 'Starting the Android runtime…',
  fallback_embed_toast: 'The emulator native window did not appear; using the built-in window for this session',
  orientation_log_follow: '(follow the app)',
  mark_orientation_mismatch: 'orientation mismatch (panel={cur}, want={want}) restart to correct',
  mark_app_up: 'app up (attaching early)',

  // ---- deploy / download progress ----
  foreign_bundle_log: 'the runtime directory points to another install\'s bundle ({current}); switching to the bundled runtime {bundled}',
  autodeploy_cooldown: 'autoDeploy in cooldown (last failed at {time}); skipping automatic retry',
  autodeploy_skip_bundled: 'autoDeploy skipped: runtime is bundled with the package ({dir}); no download needed',
  autodeploy_skip_bundled_extract: 'autoDeploy skipped: runtime is bundled with the package ({dir}); no download needed, images will be extracted locally on first launch',
  autodeploy_skip_diag: 'autoDeploy skipped the online download: runtime directory is bundled ({dir}); handing over to diagnostics',
  dl_runtime_pack: 'Downloading the runtime from GitHub…',
  dl_runtime_pack_incomplete: 'Runtime pack incomplete; completing from the official sources…',
  dl_runtime_pack_fail: 'GitHub runtime unavailable ({err}); falling back to the official sources…',
  dl_adb: 'Preparing adb…',
  dl_emulator: 'Preparing the Android runtime…',
  dl_sysimg: 'Preparing the Android system image…',
  toast_autodeploy_done: 'Runtime ready automatically',
  powershell_start_failed: 'failed to start PowerShell',

  // ---- store build manual enable hint ----
  msix_accel_hint: 'The store build cannot elevate itself. Please enable it once manually: press Win+R → run optionalfeatures → check "Windows Hypervisor Platform" (HypervisorPlatform — the one WHPX actually needs), then restart the computer.',

  // ---- notifications ----
  still_running_title: 'zApkStart is still running in the background',
  still_running_body: 'Click the tray icon to reopen; right-click the tray to quit.',
  notify_installed_title: 'Installed',
  notify_installed_body: '{label} installed',
  notify_installed_shortcut: '{label} installed; desktop shortcut created',
  notify_install_failed_title: 'Install failed',
  autodebug_new_issues_notify_title: 'Auto-check found new issues',
  autodebug_new_issues_notify_body: '{text}. Open zApkStart\'s "Settings → Diagnostics & repair" to fix them in one click.',
  notify_sw_emu_title: 'Running in software emulation (slow)',
  notify_sw_emu_store: 'Enable "Windows Hypervisor Platform" and restart once for a 5–10x speedup. Settings → Environment self-check → Fix opens that window directly.',
  notify_sw_emu_installer: 'Settings → Environment self-check → Fix enables it in one click (requires admin approval), then restart once.',
  notify_data_resized_title: 'Data partition resized',
  notify_data_resized_body: 'Android free space is about {gb} GB',
  notify_data_resized_restarted: 'Android free space is about {gb} GB (runtime restarted)',
  notify_up_to_date_body: 'zApkStart v{version}',
  notify_low_disk_title: 'Low disk space',
  notify_low_disk_body: 'Only {gb} GB left. Move the Android data/runtime directory to another drive in "Settings → System integration", or clean up the disk first.',
  notify_shortcuts_fixed_title: 'Shortcuts restored',

  // ---- manual window ----
  manual_window_title: 'zApkStart User Manual · {title}',

  // ---- auto-debug reminder ----
  autodebug_new_issues_toast: 'Auto-check found new issues: {text} (Settings → Diagnostics & repair)',

  // ---- tray menu ----
  tray_open: 'Open zApkStart',
  tray_manual: 'User manual',
  tray_no_apps: 'No apps installed yet',
  tray_close_current: 'Close current app',
  tray_close_current_label: 'Close current app ({label})',
  tray_rotate_to_portrait: 'Switch back to portrait (restarts the runtime)',
  tray_rotate_to_landscape: 'Switch to landscape (restarts the runtime)',
  tray_display_exit_fullscreen: 'Exit fullscreen (portrait window)',
  tray_display_fullscreen: 'Fullscreen (fit the screen)',
  tray_rebuild_shortcuts: 'Rebuild desktop/Start menu shortcuts',
  tray_sync_shared: 'Sync shared folder',
  tray_settings: 'Settings',
  tray_update_available: 'New version {tag} available',
  tray_check_update: 'Check for updates',
  tray_quit: 'Quit',
  tray_tooltip: 'zApkStart — Android app runner',

  // ---- update dialog / update flow ----
  update_dialog_title: 'New version available',
  update_dialog_message: 'zApkStart {tag} is out; you are on v{current}. Update now?',
  update_now: 'Update now',
  update_later: 'Later',
  update_up_to_date_notify: 'You are on the latest version',
  update_busy_error: 'an update is already in progress',
  update_store_error: 'store builds are updated by Microsoft Store; its "Downloads and updates" page has been opened',
  update_no_update_error: 'already on the latest version',
  update_no_asset_error: 'no installable package for this version; the GitHub releases page has been opened',
  update_dl_prepare: 'Preparing download…',
  update_dl_apply: 'Replacing the program and restarting…',
  update_resume_apply: 'Finishing the previously interrupted update…',

  // ---- concurrent installs ----
  install_same_file_toast: 'This APK is already installing; please wait…',
  install_busy_error: 'install in progress',
  install_other_toast: 'Another install is running; please wait for it to finish.',
  install_other_error: 'another install is already running',

  // ---- launch / stop app ----
  launch_queued: 'launch queued {pkg} (waiting for {other} to finish starting)',
  preattach_ok: 'pre-attach detached ok (attempt {n})',
  launch_failed_toast: 'Launch failed: {err}',
  stop_no_app_error: 'no running app',

  // ---- dialogs / file pickers ----
  dialog_pick_data_dir: 'Choose a data directory',
  dialog_pick_apk: 'Choose APK files to install',
  dialog_filter_android_apps: 'Android apps',
  dialog_pick_driver: 'Choose a driver file (.json)',
  dialog_filter_driver_json: 'Driver JSON',
  dialog_export_driver: 'Export this machine\'s driver template',
  dialog_pick_iso: 'Choose an Android-x86 / Bliss OS system image',
  dialog_filter_sysimg: 'System image',
  dialog_pick_vdisk: 'Choose a virtual disk with Android installed',
  dialog_filter_vdisk: 'Virtual disk',
  dialog_default_confirm_title: 'Confirm',
  btn_cancel: 'Cancel',
  btn_ok: 'OK',

  // ---- misc errors / logs ----
  app_not_found: 'app not found',
  err_missing_pkg: 'missing package name',
  err_empty_dir: 'directory must not be empty',
  err_missing_driver_id: 'missing driver id',
  err_unknown_setting: 'unknown setting {key}',
  err_invalid_capacity: 'invalid target capacity',
  driver_imported_log: 'Driver imported: {name} v{version}',
  preflight_applied_log: 'preflight auto-config: {engine} driver={driver}',
  agent_scope_empty_log: 'agent scope is empty: not suppressing any windows (to avoid touching other apps)',
  dispose_skip_log: 'Another instance owns the runtime now; skipping shutdown (would kill its emulator)',
  console_smoke_shot_failed: '[smoke] screenshot failed',
  attach_shell_closed_log: 'attach detached: shell window closed (round {n})',
  attach_failed_log: 'attach detached #{n} failed: {err}',
  attach_fallback_log: 'attach detached: all retries failed; temporarily falling back to embed mode',
  resources_unavailable_note: 'the runtime is not ready, so resource allocation is unavailable right now',

  // ---- self-check issues (doctor:selfCheck) ----
  issue_vcredist_title: 'Missing VC++ runtime (x64)',
  issue_vcredist_hint: 'This system is missing Microsoft VC++ 2015-2022 (x64), which the Android runtime depends on. It can be installed in one click; if error 0xC0000135 persists afterwards, see manual section 6.8 — on store builds it can also be a child-process DLL path issue.',
  issue_accel_store_title: '"Windows Hypervisor Platform" needs to be enabled',
  issue_accel_store_hint: 'Without it only pure software emulation runs and boot can take minutes. {msix} (The store build cannot elevate on your behalf; you need to do this manually once, then restart.)',
  issue_accel_title: 'Hardware acceleration not enabled',
  issue_accel_hint: '{note}Click "Fix" on the right to enable it automatically (requires admin approval, may restart once); on failure the AEHD driver is installed instead.',
  sw_fallback_note: 'Falling back to software emulation (works, but slow). ',
  issue_disk_title: 'Runtime disk space is tight',
  issue_disk_hint: 'The drive holding "{dir}" has only {mb} MB left; the runtime and images may fill it.',
  issue_path_title: 'Runtime directory contains non-ASCII/special characters',
  issue_path_hint: 'Some runtime components are sensitive to non-ASCII paths, which can break launch. Moving to a plain ASCII path is recommended.',
  issue_adb_title: 'adb toolchain missing',
  issue_adb_hint: 'Cannot connect to the Android runtime.',
  issue_emulator_title: 'Runtime engine not installed',
  issue_emulator_hint: 'The runtime engine must be deployed first (about 440MB).',
  issue_sysimg_title: 'System image not ready',
  issue_sysimg_hint: 'The Android system image must be downloaded first (about 1.5GB).',
  issue_lock_title: 'Leftover lock files detected',
  issue_lock_hint: 'The next launch may be rejected as "AVD already in use".',

  // ---- runtime cleanup ----
  cleanup_btn: 'Clean {n} items',
  cleanup_dialog_title: 'Confirm runtime cache cleanup',
  cleanup_dialog_message: 'About {mb} MB will be freed',
  cleanup_detail_with_snapshots: 'The runtime stops first, then old images, the current AVD\'s quick-boot snapshots, lock files and inactive AVD caches are deleted. Installed apps themselves are kept (only snapshots are cleared). This cannot be undone — exporting a diagnostic report first is recommended.',
  cleanup_detail_no_snapshots: 'Only old images, old snapshots, lock files and inactive AVD caches are deleted; installed apps are kept. This cannot be undone — exporting a diagnostic report first is recommended.',

  // ---- hardware acceleration / driver elevation ----
  aehd_not_ready: 'the AEHD driver package is not ready',
  uac_cancelled_driver: 'admin approval was cancelled (click "Yes" to install the driver)',
  driver_install_failed: 'driver installation failed (exit code {code})',
  accel_already_note: 'hardware acceleration is already available; nothing else to do',
  accel_whpx_requested_note: '"Windows Hypervisor Platform" has been requested; hardware acceleration takes effect after restarting the computer',
  accel_whpx_enabled_note: '"Windows Hypervisor Platform" enabled; it takes effect after restart',
  uac_cancelled_accel: 'You cancelled the admin approval; hardware acceleration was not changed. You can click "Fix" again, or enable "Windows Hypervisor Platform" manually.',
  aehd_prepare_failed: 'failed to prepare the AEHD driver package',
  accel_aehd_enabled_note: 'AEHD hardware acceleration enabled',

  // ---- low disk ----
  toast_low_disk: 'Only {gb} GB of disk left; Android may fail to start (change the drive in Settings → System integration)',

  // ---- per-app routing (WSA backend, docs/zapkstart/wsa-backend.md) ----
  route_mismatch_builtin_on_wsa: '{app} was installed on the bundled runtime. Switch back to it, or reinstall for WSA — its data will not transfer.',
  route_mismatch_wsa_on_builtin: '{app} was installed on WSA. Switch the engine to WSA, or reinstall on the bundled runtime — its data will not transfer.',
  wsa_launch_ok: '{app} launched in WSA ({ms}ms): the app opens in its own WSA window',
  uninstall_remote_only: 'Uninstalled the local entry. The app itself still lives on the other engine — switch the engine and uninstall again to remove it there.',

};
