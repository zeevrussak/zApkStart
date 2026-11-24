'use strict';
// adb / en — English catalog for src/core/adb.js (contract: src/core/i18n.js)
module.exports = {
  // pm install failure reasons (friendlyInstallError)
  install_abi_mismatch: 'Install failed: this app only ships ARM native libraries (most CN-market apps do), and the current system image has no ARM translation layer. zApkStart will automatically switch to the compatible image with the newer translation layer and retry.',
  install_older_sdk: 'Install failed: the app requires an Android version newer than the current runtime (needs a newer system image).',
  install_no_certificates: 'Install failed: the APK has no valid signature and cannot be installed.',
  install_cert_mismatch: 'Install failed: the signature differs from the installed version; uninstall the old version first, then install.',
  install_version_downgrade: 'Install failed: a higher version is already installed on the device; it cannot be downgraded over.',
  install_no_space: 'Install failed: the runtime has run out of disk space (not enough space); free some up and retry.',
  install_invalid_apk: 'Install failed: the APK file is corrupted or incomplete (the download may not have finished); fetch it again.',
  install_invalid_uri: 'Install failed: the APK path contains special characters; move the file to a plain-ASCII path and retry.',
  install_already_exists: 'Install failed: an app with the same package name but a different signature already exists; uninstall it first.',
  install_update_incompatible: 'Install failed: the signature differs from the installed version; uninstall the old version first.',
  install_deprecated_sdk: 'Install failed: this app targets a very old Android version (targetSdk too low), which Android 14 blocks by default. zApkStart will automatically retry with the official bypass flag.',
  install_test_only: 'Install failed: this is a test-only app package; the test-only flag has been added automatically and the install retries.',
  install_missing_shared_library: 'Install failed: a device feature the app depends on (such as a vendor library) does not exist in the current runtime.',
  install_user_restriction: 'Install failed: the system restricts installation; restart the runtime and retry.',
  install_conflicting_provider: 'Install failed: it conflicts with an existing app\'s ContentProvider; uninstall the conflicting app.',
  install_internal_error: 'Install failed: internal system error (commonly low storage or an unfinished boot); restart the runtime and retry.',
  install_unknown: 'Install failed: {raw}',
  install_no_clear_reason: 'install failed without a clear reason',

  // Launch failure reasons (friendlyLaunchError)
  default_app_name: 'the app',
  launch_anti_emulator: '{pkg} detected an emulator / translation environment and exited on purpose (anti-emulator, anti-debug, or SafetyNet/Play Integrity checks). This is a limitation of the app itself, not a malfunction; zApkStart cannot bypass it — see the built-in manual 6.3.',
  launch_abi_crash: '{pkg} crashed after launch: the app is incompatible with the ARM translation layer (libndk_translation/houdini; commonly anti-debug / anti-emulator detection or native hook conflicts). If the compatible image is not enabled yet, zApkStart will switch and retry once; if it still crashes with the image enabled, this is an app compatibility limitation, not a malfunction — see the built-in manual 6.3.',
  launch_missing_lib: '{pkg} crashed after launch: a device native library is missing (the app may ship ARM-only builds). If the ARM translation layer is not enabled yet, zApkStart will switch to the compatible image and retry; if it still crashes with it enabled, this is usually an app limitation — see the built-in manual 6.3.',
  launch_java_crash: '{pkg} crashed immediately on launch (internal app exception, possibly related to the emulator environment or missing Google services).',
  launch_security: '{pkg} failed to launch: the system refused the launch request (permission or signature problem).',
  launch_generic: '{pkg} did not start: {raw}',
  launch_no_process: '{pkg} did not start (the process did not stay alive)',

  // adb calls and the persistent input channel
  exec_failed: 'adb {args} failed: {raw}',
  input_session_start_failed: 'failed to start the adb shell session',
  input_session_exited: 'the adb shell session has exited',
  input_invalid_command: 'invalid input command',
  input_timeout: 'the input command timed out',
  input_closed: 'the input channel has been closed',

  // install / IME orchestration
  apk_not_found: 'APK not found: {path}',
  no_split_parts: 'no split APKs available to install',
  split_install_failed: 'split APK install failed',
  app_still_loading: '(app still loading)',
  ime_apk_missing: 'the input-method APK is missing',
  ime_not_registered: 'the input-method package is not registered',
};
