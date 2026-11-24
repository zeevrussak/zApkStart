'use strict';
// provision / en — English catalog for src/core/provision.js (contract: src/core/i18n.js)
module.exports = {
  // assertComplete()
  incomplete_download: '{label} download incomplete ({mb} MB); it has been cleaned up, please retry',
  label_adb_pack: 'adb package',
  label_runtime_pack: 'Runtime pack',
  label_engine: 'Runtime engine',
  label_compat_img: 'Compatible image',
  label_qemu_pack: 'QEMU installer',

  // guardDisk()
  disk_guard_error: 'Not enough disk space: this component needs about {need} MB, but the disk holding "{dir}" has only {free} MB left.\nSuggestion: move the "Runtime data directory" to a disk with more room (Settings → System integration → Runtime data directory → Browse), or clean up the disk / uninstall unused apps first.',

  // hypervisor()
  note_non_windows: 'Non-Windows platform',
  hv_dll_present: 'Virtual Machine Platform components present (availability is checked by the runtime engine)',
  hv_arm64_note: 'WHPX/AEHD cannot accelerate the x64 engine on ARM64 (Google publishes no ARM64 engine). Continuing will only be slower or fail.',
  hv_missing_note: 'Windows Hypervisor Platform components not detected: enable "Virtual Machine Platform" in "Turn Windows features on or off" and restart',

  // inspectIso()
  iso_not_downloaded: 'not downloaded',
  iso_too_small: 'The file is only {mb}MB; the download did not finish',
  iso_bad_magic: 'The file is not a valid ISO9660 image (possibly an error page or a corrupted download)',

  // checkEnv()
  note_not_installed: 'not installed',
  sysimg_note_ok: 'Android {api} ({gb} GB{extra})',
  sysimg_compressed_suffix: ', packed compressed; expanded automatically on first boot',
  sysimg_note_compat: 'Android {api} ({extra})',
  sysimg_packed_note: 'packed compressed; expanded automatically on first boot',
  compat_label: 'ARM compatible image',
  not_downloaded: 'not downloaded',
  note_disk_not_created: 'not created yet',

  // installAdb()
  progress_adb_download: 'Downloading Android platform-tools (~8MB)…',
  progress_adb_bytes: 'Downloading adb… {got}MB / {total}MB',
  progress_adb_extract: 'Extracting adb…',
  err_adb_broken: 'adb does not run after extraction; check whether antivirus software blocked it',
  progress_adb_done: 'adb {version} ready',

  // resolveRuntimePack()
  source_unreachable: '{name} unreachable',
  err_no_runtime_pack: 'No runtime pack found on the releases page{errs}',

  // installRuntimePack()
  progress_pack_info: 'Fetching runtime version info…',
  progress_picking_source: 'Picking the fastest download source ({source})…',
  progress_runtime_download: 'Downloading the runtime (~1.5 GB, one time only, {conn} connections)…',
  eta_suffix: ' · about {min} min left',
  progress_runtime_bytes: 'Downloading runtime {info}',
  progress_pack_extract: 'Extracting the runtime (~1 minute)…',
  progress_extract_entry: 'Extracting {done}/{all}',
  progress_sysimg_expand: 'Expanding the system image (~1 minute, one time only)…',
  progress_done_ready: 'Runtime is ready',

  // materializeImages()
  copy_component_failed: 'Failed to copy an image component: {msg}',
  progress_expand_image: 'First boot: expanding system image {name} (~1 minute, one time only)',
  err_lzma_missing: 'Incomplete package: the @napi-rs/lzma extraction component is missing and the system image cannot be expanded. Please re-download the full package or use the store version.',
  expand_image_failed: 'Failed to expand the image: {msg}',
  err_materialize: 'System image expansion failed ({reasons})',

  // systemImageInfo()
  note_image_incomplete: 'image incomplete',
  note_missing_system_img: 'system.img missing',

  // emulatorAccel()
  note_not_installed_emulator: 'emulator not installed',
  accel_whpx_on: 'WHPX hardware acceleration enabled',
  accel_aehd_on: 'AEHD hardware acceleration enabled',
  accel_aehd_on_checkmissing: 'AEHD hardware acceleration enabled (emulator-check missing; judged by the driver)',
  accel_none_arm64: 'Hardware acceleration not enabled: WHPX/AEHD cannot accelerate the x64 engine on ARM64 (Google publishes no ARM64 engine); it will run in software emulation',
  accel_none_fallback: 'Hardware acceleration not enabled: falling back to software emulation (works but slow). Consider installing the AEHD driver or enabling "Virtual Machine Platform".',

  // installEmulator()
  progress_engine_download: 'Downloading the runtime engine (~440MB, from the official Google source)…',
  progress_engine_bytes: 'Downloading runtime engine {got}MB / {total}MB{speed}',
  progress_engine_extract: 'Extracting the runtime engine…',
  err_emulator_broken: 'emulator does not run after extraction; check whether antivirus software blocked it',
  progress_engine_done: 'Runtime engine {version} ready',

  // playImageInfo() / installPlayImage()
  progress_compat_download: 'Downloading the ARM compatible image (Android 14, ~1.5GB)…',
  progress_compat_bytes: 'Downloading compatible image {got}MB / {total}MB{speed}',
  progress_compat_extract: 'Extracting the compatible image (3GB, takes a while)…',
  progress_compat_entry: 'Extracting compatible image {i}/{total}',
  err_compat_verify: 'Compatible image failed verification after extraction',
  progress_compat_done: 'ARM compatible image ready; restart the runtime for it to take effect',

  // installAehd()
  err_arm64_aehd: 'AEHD cannot accelerate the x64 engine on ARM64 (Google publishes no ARM64 engine)',
  progress_aehd_download: 'Downloading the AEHD driver…',
  err_aehd_extract: 'The AEHD driver package extracted incorrectly',
  progress_aehd_done: 'AEHD driver ready; administrator rights are needed to install it',

  // installQemu()
  progress_qemu_resolve: 'Looking up the latest QEMU version…',
  progress_qemu_download: 'Downloading QEMU (~200MB)…',
  progress_qemu_bytes: 'Downloading QEMU… {got}MB / {total}MB{speed}',
  progress_qemu_install: 'Installing QEMU (silent)…',
  err_qemu_missing_exe: 'qemu-system-x86_64.exe not found after installing QEMU: you can download QEMU manually and extract it to engine/qemu/',
  progress_qemu_done: 'QEMU {version} ready',

  // downloadIso()
  progress_iso_download: 'Downloading Android-x86 9.0-r2 (~900MB, 8 chunked connections)…',
  progress_iso_bytes: 'Downloading system image… {got}MB / {total}MB{speed}',
  err_iso_unusable: 'System image unusable: {reason}{resume}',
  iso_resume_suffix: '; click again to resume the download',
  progress_iso_done: 'System image ready ({gb} GB)',

  // inspectImage() / importIso()
  err_file_empty: 'The file does not exist or is empty',
  err_image_unusable: 'The image file is unusable',

  // createDisk()
  progress_disk_create: 'Creating the {gb}GB virtual disk…',
  err_qemuimg_disk: 'qemu-img failed to create the virtual disk: {detail}',
  err_qemuimg_missing: 'qemu-img.exe not found; install QEMU first',
  progress_disk_done: 'Virtual disk created',
};
