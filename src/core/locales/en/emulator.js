'use strict';
// emulator / en — English catalog for src/core/emulator.js (contract: src/core/i18n.js)
module.exports = {
  // describeExitCode()
  exit_ok: 'exited normally',
  exit_arg_env_error: 'bad launch arguments or environment',
  exit_access_violation: '0xC0000005 access violation; the render backend crashed',
  exit_stack_overflow: '0xC00000FD stack overflow',
  exit_dll_missing: '0xC0000135 a dependency DLL failed to load (cause unclear; see built-in manual 6.8)',
  exit_access_denied: '0xC0000022 access denied (driver or permission problem)',
  exit_arch_mismatch: '0xC000007B image bitness mismatch or corrupted DLL',

  // killOrphanProcesses()
  kill_orphans: 'Cleaning up {count} leftover emulator process(es)',

  // ensureAvd()
  tag_compat: 'Google Play (ARM compatible)',

  // ensureDataPartition()
  userdata_grown: 'userdata resized: file {from} → {to}, filesystem {fsFrom} → {fsTo}',
  userdata_grow_failed: 'Failed to grow userdata (keeping the existing partition): {msg}',
  userdata_rebuilt: 'Rebuilt userdata: {gb}GB ext4 (4K block, FBE capable)',
  userdata_rebuild_failed: 'Failed to rebuild userdata: {msg}',
  err_qemuimg: 'qemu-img {op} failed: {detail}',
  err_resize2fs_missing: 'resize2fs.exe is missing',
  err_resize2fs: 'resize2fs failed: {detail}',

  // spawnOnce()
  emu_exited: 'Runtime exited (code={code}{meaning})',

  // resizeDataPartition()
  resize_overlay_error: 'Android is using the quick-boot overlay disk; growing in place cannot reach it (target {gb} GB). Use "Reset Android data" to rebuild /data with the new capacity — installed apps and saves will be wiped; please confirm first.',
  resize_fs_shortfall: 'The image was grown to {want} GB but the filesystem only reached {actual} GB (resize2fs did not succeed). Click "Resize now" again, or free up disk space and retry.',

  // start()
  prev_emu_exited: 'The previous emulator has already exited; starting again…',
  err_no_engine: 'The runtime engine is not installed; finish deployment on the "Runtime" page first',
  err_no_sysimg: 'The system image is not ready; download the Android system image on the "Runtime" page first',
  disk_full_avd: 'Not enough disk space: the disk holding the Android data directory ({dir}) has only {free} GB left, and the runtime needs at least {need} GB free. In "Settings → System integration → Android data directory" move it to a disk with more room (e.g. D:), or clean up the disk first. Your apps and saves will not be deleted automatically.',
  disk_full_root: 'The disk holding the runtime directory ({dir}) has only {free} GB left — not even logs and temp files fit. Clean up the disk, or move the "Runtime data directory" to another disk as well.',
  driver_load_failed_log: 'Failed to load drivers: {msg}',
  driver_load_failed_ui: 'Failed to load drivers (ignored; starting with default arguments): {msg}',
  drivers_applied: 'Drivers applied: {names}',
  drivers_none: 'No driver matched; starting with default arguments',
  drivers_errors: '{count} driver file(s) failed to load (see Settings → Drivers for the reason)',
  driver_gpu_fixed: 'A driver pinned the render backend to {gpu}',
  variant_driver_tcg: '{gpu} / driver requires software emulation',
  driver_tcg_notice: 'A driver requires hardware acceleration to be off (software emulation)',
  vulkan_retry_notice: 'The previous host-render crash looks Vulkan-related; retrying hardware acceleration with -feature -Vulkan',
  bad_gpu_switch: 'The {gpu} render backend crashed on startup last time; trying {next} first this time',
  boot_attempt: 'Starting runtime (attempt {i}/{total}: {label})…',
  disk_full_stop: 'Not enough disk space; stopped retrying (your apps and saves are untouched).',
  retry_next: '{title}; automatically switching to another set of arguments and retrying…',
  booting_progress: 'Booting… {sec}s',
  boot_ready: 'Runtime ready ({sec}s, {label})',
  net_missing_notice: '⚠ The Android VM is not online yet (Wi-Fi not associated or no address). Apps that need the network may stay on a black screen when opened: reopen them later; if it persists, use "Settings → Repair network" to reconnect (installed apps are not removed).',
  boot_timeout: 'Boot timed out (possibly a slow first boot or hardware acceleration not taking effect)',
  err_boot_exhausted: 'The runtime failed to start after multiple attempts ({title}).\n{hint}\n\nTried: {attempts}\nDiagnostic report: {report}',

  // snapshots
  snapshot_skip_space: 'Skipping snapshot save: {free}GB free on disk < {need}GB needed',
  snapshot_invalidate_unauth: 'Guest unauthorized/not ready at shutdown: invalidating the snapshot; the next cold start re-injects the debugging authorization',
  snapshot_skip_unauth: 'Skipping snapshot save: the guest is unauthorized or has not finished booting (avoids saving a poisoned snapshot)',
};
