'use strict';
// incremental / en — English catalog for src/core/incremental.js (contract: src/core/i18n.js)
module.exports = {
  manifest_invalid_json: 'the incremental manifest is not valid JSON',
  manifest_schema_unsupported: 'the incremental manifest schema is not supported',
  manifest_missing_versions: 'the incremental manifest is missing version info',
  manifest_missing_app: 'the incremental manifest is missing code-package info',
  reason_setup_flavor: 'the installer build uses the full setup package',
  reason_no_manifest: 'no incremental manifest',
  reason_electron_mismatch: 'different Electron version; the full package is required',
  reason_app_pack_missing: 'the incremental code package was not published',
  reason_incremental: 'incremental code-layer update',
};
