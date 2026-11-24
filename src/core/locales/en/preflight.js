'use strict';
// preflight / en — English catalog for src/core/preflight.js (contract: src/core/i18n.js)
module.exports = {
  // recommendGpu() rationales (also land in driver notes)
  gpu_why_no_accel: 'No usable hardware acceleration; start with software rendering so the picture comes up at all',
  gpu_why_unknown_gpu: 'GPU model could not be read; let the automatic fallback chain try',
  gpu_why_small_vram: 'Very little VRAM; swangle is more reliable here',
  gpu_why_nvidia_host: 'NVIDIA drivers are mature; host passthrough is usually the fastest',
  gpu_why_amd_host: 'AMD cards only get hardware acceleration via host; falls back automatically if it crashes',
  gpu_why_intel_host: 'Intel iGPUs only get hardware acceleration via host; falls back automatically if it crashes',
  gpu_why_auto: 'Let the automatic fallback chain try',

  // ---- 1. CPU virtualization (BIOS) ----
  vt_unsupported_title: 'This CPU does not support hardware virtualization',
  vt_unsupported_detail: 'Only software emulation is possible, which is 5~10x slower. Fine for lightweight apps; not recommended for large games.',
  vt_bios_off_title: 'CPU virtualization is disabled in the BIOS',
  vt_bios_off_detail: 'Reboot into BIOS/UEFI and set Intel VT-x (Intel) or SVM Mode (AMD) to Enabled, save, then run the check again. '
    + 'On Lenovo/Dell/ASUS it is usually under Advanced → CPU Configuration; brand PCs may call it Virtualization Technology.',
  vt_bios_off_action: 'Requires a reboot into the BIOS and cannot be done automatically',
  vt_ok_title: 'CPU virtualization is enabled in the BIOS',
  vt_ok_detail: '{name} · {cores} cores / {threads} threads',
  vt_unknown_title: 'CPU virtualization status could not be read',
  vt_unknown_detail: 'May be a motherboard/permission limitation. If startup reports no hardware acceleration, enter the BIOS manually and confirm VT-x / SVM is enabled.',
  vt_unknown_action: 'Check manually',

  // ---- 2. Windows side: WHPX / Hyper-V ----
  arm64_accel_hint: 'WHPX/AEHD cannot accelerate the x64 engine on ARM64 (Google publishes no ARM64 engine). Continuing will only be slower or fail.',
  arm64_whpx_on_title: 'ARM64 host: Hypervisor Platform is enabled, but has no effect on the x64 engine',
  arm64_whpx_off_title: 'ARM64 host: WHPX/AEHD hardware acceleration unavailable',
  whpx_ok_title: 'Windows Hypervisor Platform is enabled',
  whpx_ok_detail_running: 'A hypervisor is running and WHPX is available.',
  whpx_ok_detail_restart: 'The feature is enabled; if acceleration is still unavailable, reboot once so the hypervisor comes up.',
  whpx_off_title: '"Hypervisor Platform" is not enabled',
  whpx_off_store_detail: 'The store build cannot change system features on its own. Press Win+R → type optionalfeatures → tick "Windows Hypervisor Platform" (HypervisorPlatform) and "Virtual Machine Platform" → OK → reboot.',
  whpx_off_store_action: 'Open the "Windows Features" window',
  whpx_off_installer_detail: 'The button below enables HypervisorPlatform + VirtualMachinePlatform automatically (an admin confirmation is required), then reboot the PC.',
  whpx_off_installer_action: 'Enable in one click (admin required)',

  // ---- 3. Is hardware acceleration actually usable right now ----
  accel_ok_title: 'Hardware acceleration available ({kind})',
  accel_ok_detail: 'Startup will use hardware acceleration; the configuration below is recommended for this machine\'s GPU and memory.',
  accel_off_title: 'No usable hardware acceleration right now',
  accel_off_detail_aehd: 'You can install the AEHD driver (admin required), or enable "Hypervisor Platform" first and reboot; if neither works, only software emulation remains.',
  accel_off_detail_sw: 'Software emulation will be used first so it can run; expect 5~10x slower than hardware acceleration.',
  accel_off_action: 'Install the AEHD driver (admin required)',

  // ---- 4. GPU ----
  gpu_unknown_title: 'GPU information could not be read',
  gpu_unknown_detail: 'May be Remote Desktop / a virtual machine / a broken driver. The render backend is left to the automatic fallback chain.',
  gpu_vram: '{gb} GB VRAM',
  gpu_vram_integrated: ' (integrated; the rest is shared memory)',
  gpu_vram_unknown: 'VRAM unknown',
  gpu_driver_seg: ' · driver {version}',
  gpu_date_seg: ' ({date})',
  gpu_driver_old_title: 'The GPU driver is quite old',
  gpu_driver_old_detail: 'Driver date {date} (about {years} years ago). Old drivers are a common cause of "boots to a black screen / corrupted graphics"; updating from the vendor\'s website is recommended.',

  // ---- 5. Memory / OS version ----
  mem_unknown_title: 'Physical memory could not be read',
  mem_low_title: 'Memory is on the small side ({gb} GB)',
  mem_low_detail: 'The Android VM can get at most 2 GB and 2 cores, picture quality drops to 540×960; closing browser tabs before launching is recommended.',
  mem_ok_title: 'Physical memory {gb} GB',
  os_old_title: 'Windows version is old (build {build})',
  os_old_detail: '{product} requires Windows 10 2004 (build 19041) or newer. On older systems the emulator may exit immediately.',

  // ---- Auto-generated driver ----
  driver_name: 'Auto-configured for this machine ({gpu})',
  driver_author: '{product} preflight',
  driver_description: 'Generated by "Preflight · auto configuration": {why}. {accel}',
  accel_available: 'Hardware acceleration is available.',
  accel_unavailable: 'No hardware acceleration right now.',

  // ---- Summary ----
  list_sep: ', ',
  summary_bad: '{count} issue(s) must be fixed first ({titles})',
  summary_warn: '{count} item(s) would benefit from tuning ({titles})',
  summary_good: 'This machine can run hardware acceleration directly and the configuration is already optimal',
};
