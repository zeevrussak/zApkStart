'use strict';
// installer / en — English catalog for src/core/installer.js (contract: src/core/i18n.js)
module.exports = {
  // split bundle (.apks/.xapk) parsing
  bundle_no_apk_parts: 'no APK splits were found in this bundle (it may not be a .apks/.xapk)',
  bundle_base_parse_failed: 'failed to parse the base APK of the split bundle',

  // compatible image and runtime orchestration
  compat_image_downloading: 'First ARM app install: downloading the compatible image (about 1.5GB, one time only)…',
  compat_image_download_failed: 'the compatible image download failed; check the network and retry',
  switching_compat_image: 'Switching to the compatible image and restarting the runtime…',
  compat_runtime_unavailable: 'runtime unavailable after switching to the compatible image',
  restoring_app: 'Restoring installed app {label}…',
  parsing_apk: 'Parsing APK…',
  apk_identified: 'Identified {label} ({package})',
  preparing_runtime: 'Preparing the Android runtime…',
  runtime_unavailable: 'runtime unavailable',
  arm_switching: 'This app ships ARM libraries only; switching to the compatible image…',
  arm_switching_retry: 'This app ships ARM libraries only; switching to the compatible image and reinstalling…',
  arm_switch_no_translation: 'The current runtime has no ARM translation layer enabled; switching to the compatible image and retrying…',
  abi_retried_still_failed: 'Switched to the Android 14 compatible image and restarted the runtime, but {label} still failed to install ({raw}). Check disk space and the network, then retry; if it keeps failing, export a diagnostic report in Settings → Diagnostics & repair.',

  // install pipeline progress
  updating_app: 'Updating the app…',
  installing_app: 'Installing the app…',
  compat_switched_reinstalling: 'Compatible image switched; reinstalling…',
  creating_shortcut: 'Creating the desktop shortcut…',
  shortcut_create_failed: 'shortcut creation failed: {reason}',
  shortcut_create_failed_generic: 'failed to create the shortcut',
  install_done: '{label} installed',

  // soft warnings after install
  warn_min_sdk: 'This app requires Android {sdk}+, higher than the current runtime; it may not run properly.',
  warn_icon_placeholder: 'The app icon could not be parsed (possibly an unusual adaptive icon); the shortcut uses a placeholder icon for now.',
  warn_icon_webp_failed: 'The app icon (WebP) failed to decode; the shortcut uses a placeholder icon for now.',

  // launch orchestration (onLog progress and errors)
  display_adapt_skipped: 'display adaptation skipped: {reason}',
  net_ready: 'VM network ready ({ip})',
  wifi_reconnecting: 'The VM cannot reach Wi-Fi; trying to reconnect…',
  net_restored: 'VM network restored ({ip})',
  wifi_reconnect_failed: 'automatic Wi-Fi reconnect failed: {reason}',
  net_not_ready: 'VM network is not ready yet; starting the app anyway (online pages may load late)',
  reinstalling_from_backup: 'App files are missing (snapshot/data mismatch); reinstalling automatically from the local backup…',
  auto_install_failed: 'automatic install failed: {reason}',
  launch_retry: 'The app exited after launch (attempt {attempt}); retrying automatically…',
  reset_and_retry: 'The app keeps exiting; resetting app data and retrying…',
  app_unstable: 'The app exited immediately after launch; automatic retries and an app-data reset did not help',

  // ---- WSA ABI direction (docs/zapkstart/wsa-backend.md) ----
  wsa_x86_only: '{label} ships x86-only native libraries, but this device runs ARM Android (WSA). Look for an ARM-compatible build of the app; this APK cannot be installed here.',
  wsa_arm_translation: '{label} needs an ARM-capable WSA build (the ARM-enabled variants of WSABuilds). This WSA build cannot run the app\'s native libraries.',
};
