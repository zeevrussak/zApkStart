'use strict';
// updater / en — English catalog for src/core/updater.js (contract: src/core/i18n.js)
module.exports = {
  no_installable_asset: 'this release has no auto-installable package; download it manually from the GitHub releases page',
  incremental_fallback: 'incremental update unavailable ({reason}); falling back to the full package…',
  downloading: 'Downloading {name}…',
  downloading_progress: 'Downloading {info}{speed}',
  downloading_part: 'Downloading {info} (part {part}/{total_parts}){speed}',
  reusing_payload: 'A downloaded update package already exists; reusing it',
  extract_done: 'Update package extracted',
  setup_downloaded: 'Installer downloaded',
  fetching_manifest: 'Fetching the update manifest…',
  fetching_app_pack: 'Fetching the incremental code package…',
  manifest_version_mismatch: 'manifest version does not match the release',
  app_pack_hash_mismatch: 'incremental code package failed verification (sha256 mismatch)',
  reusing_app_payload: 'A downloaded incremental package already exists; reusing it',
  app_pack_verify_failed: '{count} files in the incremental code package failed verification',
  app_pack_verified: 'Incremental package verified',
  part_size_mismatch: 'Part {part} has the wrong size ({got} ≠ {expected}); aborted, you can retry',
  assembled_size_mismatch: 'Assembled update package has the wrong size ({got} ≠ {expected}); aborted, you can retry',
  extracting: 'Extracting {index}/{total}',
};
