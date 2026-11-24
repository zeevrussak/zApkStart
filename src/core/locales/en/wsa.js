'use strict';
// wsa / en — English catalog for src/core/backends/wsa.js + backends/index.js
// (contract: src/core/i18n.js; docs/zapkstart/wsa-backend.md wording rules)
module.exports = {
  // Backend identity (settings page describe())
  backend_label: 'Windows Subsystem for Android (WSA)',
  backend_summary: 'Runs apps in WSA\'s own freeform windows on a native ARM64 Android 13 subsystem (no CPU emulation). adb-only: x86-only apps and Play-certified apps will not work; the VM stays yours.',

  // probe / check
  not_installed: 'Windows Subsystem for Android is not installed on this machine',
  adb_missing: 'adb is missing: click "One-click deploy" to download it automatically',

  // ensure() state machine
  connecting: 'Connecting to WSA over adb ({serial})…',
  starting_vm: 'WSA is not responding yet; starting the subsystem…',
  connect_wait: 'Still waiting for the WSA adb endpoint… ({sec}s)',
  port_fallback: 'The default port is not answering; trying port {port} once…',
  port_saved: 'WSA answered on port {port}; saved it for future launches',
  connected: 'Connected to WSA ({serial})',
  unauthorized: 'WSA is asking for debugging authorization: open WSA settings, enable adb and accept the "Allow USB debugging?" dialog',
  adb_toggle_needed: 'WSA is running but its adb endpoint refuses connections: open the Windows Subsystem for Android app → Developer settings → turn on "Developer mode" and "IP address" (adb) — then try again',

  // backends/index.js fallback log
  fallback_builtin: 'Engine mode is "WSA" but the WSA package was not detected; falling back to the bundled runtime',

  // status() / usage / dataInfo
  not_connected: 'WSA is not connected yet. Open any installed app to bring the subsystem up',
  managed_by_wsa: 'Storage and processes are managed by the Windows Subsystem for Android; ZapkStart only drives it over adb and does not own these numbers',
};
