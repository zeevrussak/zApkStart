'use strict';
// updater / he — קטלוג עברית עבור src/core/updater.js (החוזה: src/core/i18n.js)
module.exports = {
  no_installable_asset: 'לגרסה זו אין חבילה שניתן להתקין אוטומטית; הורד ידנית מעמוד ההפצות ב-GitHub',
  incremental_fallback: 'עדכון מצטבר אינו זמין ({reason}); עובר לחבילה המלאה…',
  downloading: 'מוריד {name}…',
  downloading_progress: 'מוריד {info}{speed}',
  downloading_part: 'מוריד {info} (חלק {part}/{total_parts}){speed}',
  reusing_payload: 'כבר קיימת חבילת עדכון שהורדה; משתמש בה מחדש',
  extract_done: 'חבילת העדכון חולצה',
  setup_downloaded: 'קובץ ההתקנה הורד',
  fetching_manifest: 'מוריד את מניפסט העדכון…',
  fetching_app_pack: 'מוריד את חבילת הקוד המצטברת…',
  manifest_version_mismatch: 'גרסת המניפסט אינה תואמת לגרסה בהפצה',
  app_pack_hash_mismatch: 'חבילת הקוד המצטברת נכשלה באימות (אי-התאמת sha256)',
  reusing_app_payload: 'כבר קיימת חבילה מצטברת שהורדה; משתמש בה מחדש',
  app_pack_verify_failed: '{count} קבצים בחבילת הקוד המצטברת נכשלו באימות',
  app_pack_verified: 'החבילה המצטברת אומתה',
  part_size_mismatch: 'לחלק {part} יש גודל שגוי ({got} ≠ {expected}); נעצר, אפשר לנסות שוב',
  assembled_size_mismatch: 'לחבילת העדכון שהורכבה יש גודל שגוי ({got} ≠ {expected}); נעצר, אפשר לנסות שוב',
  extracting: 'חולץ {index}/{total}',
};
