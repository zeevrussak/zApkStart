'use strict';
// doctor / en — English catalog for src/core/doctor.js (contract: src/core/i18n.js)
module.exports = {
  // ARM64 unified wording (kept in sync with preflight)
  arm64_accel_hint: 'WHPX/AEHD cannot accelerate the x64 engine on ARM64 (Google publishes no ARM64 engine). Continuing will only be slower or fail.',

  // planVariants()
  accel_hw: 'hardware acceleration',
  accel_sw: 'software emulation',
  variant_sw_off: 'software emulation with acceleration off (slow, but the best compatibility)',
  variant_safe_cold: 'conservative cold start (minimal memory + cleared snapshot)',

  // diagnose() rules
  diag_access_violation_title: 'Render backend crash (0xC0000005 access violation)',
  diag_access_violation_hint: 'Automatically retried with a more conservative render backend and remembered not to try it first next time. If it keeps happening, update your GPU driver; or lower the picture quality in Settings → Performance & resources and disable Remote Desktop / VM GPU passthrough, then retry.',
  diag_gpu_init_title: 'GPU render backend failed to initialize',
  diag_gpu_init_hint: 'Automatically switched to software rendering and retried. If it still fails, update your GPU driver, or disable Remote Desktop / VM GPU passthrough and retry.',
  diag_gpu_mode_title: 'The current runtime rejects this GPU mode',
  diag_gpu_mode_hint: 'Automatically picked an available GPU mode for this runtime version and retried (older versions use swiftshader_indirect, newer ones use software).',
  diag_accel_title: 'Hardware acceleration unavailable',
  diag_accel_hint: 'Automatically fell back to software emulation (the first start will be noticeably slower). For smooth performance, enable "Virtual Machine Platform" in Windows Features, or install the AEHD driver and reboot.',
  diag_memory_title: 'Memory allocation failed',
  diag_memory_hint: 'Automatically reduced the memory and cores assigned to Android. Close memory-heavy programs and retry.',
  diag_port_busy_title: 'Emulator ports are in use',
  diag_port_busy_hint: 'Automatically switched to free ports. If it keeps happening, exit other emulators (NoxPlayer/MuMu/BlueStacks etc.) or reboot the computer.',
  diag_avd_lock_title: 'Stale lock files were left by the previous run',
  diag_avd_lock_hint: 'The AVD lock files were cleaned automatically and the emulator was started again.',
  diag_image_title: 'System image missing or corrupted / incompatible with old user data',
  diag_image_hint: 'Automatically rebooted with clean user data. If it still fails, delete the image under "Runtime" and download it again.',
  diag_dll_title: 'A runtime dependency DLL failed to load (exact cause undetermined)',
  diag_dll_hint: 'Common causes: the store build launches child processes from a read-only directory with containerized DLL search, a missing VC++ runtime, or antivirus quarantining runtime files. Open the built-in manual 6.8 and follow the steps; do not reinstall the runtime based on this entry alone.',
  diag_disk_full_title: 'Not enough disk space to start Android',
  diag_disk_full_hint: 'Move the runtime directory (Settings → System integration → Runtime data directory) to a disk with enough room, or disable "Keep quick-boot snapshot" / shrink the data partition in Settings. Android data is not cleared automatically.',
  diag_non_ascii_title: 'The install path contains non-ASCII or special characters',
  diag_non_ascii_hint: 'Automatically switched to the Windows short path. If it still fails, move {product} to a pure-ASCII directory (e.g. C:\\{product}).',
  diag_avd_stale_title: 'The previous run did not exit cleanly and left lock files',
  diag_avd_stale_hint: '{product} clears the stale locks automatically and retries; if it keeps happening, check whether another emulator is using the same runtime.',
  diag_cpu_feature_title: 'The CPU lacks instruction sets required by the runtime',
  diag_cpu_feature_hint: 'On some older CPUs this is only a warning and the VM can still boot; if it really fails, update the engine under "Runtime" to an older compatible version, or use a computer that supports VT-x/AVX.',
  diag_snapshot_title: 'The quick-boot snapshot is corrupted',
  diag_snapshot_hint: 'The old snapshot was discarded automatically in favor of a cold start; the next clean exit regenerates it.',
  diag_unknown_title: 'The runtime did not finish booting',
  diag_unknown_hint: 'Automatically retried with several argument combinations. You can click "Export diagnostic report" to send the logs to the author for analysis.',

  // describeProfile()
  profile_summary: 'Auto: {mem}GB memory · {cores} cores · {gpu} rendering · {accel} · {snap}{lite} · port {port}',
  snap_on: 'on-demand snapshot',
  snap_off: 'cold start',
  profile_lite: ' · lite container',

  // writeReport()
  report_title: '{product} diagnostic report',
  report_generated_at: 'Generated at: {time}',
  report_section_host: '== Host ==',
  report_section_profile: '== Auto configuration ==',
  report_section_diag: '== Diagnosis ==',
  report_section_extra: '== Extra info ==',
  report_section_log: '== Runtime log (last 300 lines) ==',
};
