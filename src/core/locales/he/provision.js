'use strict';
// provision / he — קטלוג עברית עבור src/core/provision.js (החוזה: src/core/i18n.js)
module.exports = {
  // assertComplete()
  incomplete_download: 'הורדת {label} לא הושלמה ({mb} MB); הקובץ נמחק, נסה שוב',
  label_adb_pack: 'חבילת ה-adb',
  label_runtime_pack: 'חבילת סביבת הריצה',
  label_engine: 'מנוע סביבת הריצה',
  label_compat_img: 'התמונה התואמת',
  label_qemu_pack: 'התקנת QEMU',

  // guardDisk()
  disk_guard_error: 'אין מספיק מקום בדיסק: הרכיב דורש כ-{need} MB, אך בדיסק של "{dir}" נשארו רק {free} MB.\nהצעה: העבר את "ספריית נתוני סביבת הריצה" לדיסק עם יותר מקום (הגדרות → אינטגרציית מערכת → ספריית נתוני סביבת הריצה → עיון), או פנה את הדיסק / הסר אפליקציות מיותרות תחילה.',

  // hypervisor()
  note_non_windows: 'פלטפורמה שאינה Windows',
  hv_dll_present: 'רכיבי Virtual Machine Platform קיימים (הזמינות נבדקת על ידי מנוע סביבת הריצה)',
  hv_arm64_note: '‏WHPX/AEHD אינם יכולים להאיץ את מנוע ה-x64 על ARM64 (Google אינה מפרסמת מנוע ARM64). המשך יהיה איטי יותר או ייכשל.',
  hv_missing_note: 'רכיבי Windows Hypervisor Platform לא זוהו: ניתן לסמן "Virtual Machine Platform" ב"הפעלה או כיבוי של תכונות Windows" ולהפעיל מחדש',

  // inspectIso()
  iso_not_downloaded: 'לא הורד',
  iso_too_small: 'הקובץ בגודל {mb}MB בלבד; ההורדה לא הושלמה',
  iso_bad_magic: 'הקובץ אינו תמונת ISO9660 תקפה (ייתכן עמוד שגיאה או הורדה פגומה)',

  // checkEnv()
  note_not_installed: 'לא מותקן',
  sysimg_note_ok: 'Android {api} ({gb} GB{extra})',
  sysimg_compressed_suffix: ', באריזה דחוסה; מורחב אוטומטית באתחול הראשון',
  sysimg_note_compat: 'Android {api} ({extra})',
  sysimg_packed_note: 'באריזה דחוסה; מורחב אוטומטית באתחול הראשון',
  compat_label: 'תמונה תואמת ARM',
  not_downloaded: 'לא הורד',
  note_disk_not_created: 'טרם נוצר',

  // installAdb()
  progress_adb_download: 'מוריד את Android platform-tools (כ-8MB)…',
  progress_adb_bytes: 'מוריד adb… {got}MB / {total}MB',
  progress_adb_extract: 'חולץ את ה-adb…',
  err_adb_broken: 'ה-adb אינו פועל לאחר החילוץ; בדוק אם תוכנת אנטי-וירוס חסמה אותו',
  progress_adb_done: '‏adb {version} מוכן',

  // resolveRuntimePack()
  source_unreachable: '{name} לא נגיש',
  err_no_runtime_pack: 'לא נמצאה חבילת סביבת ריצה בעמוד ההפצות{errs}',

  // installRuntimePack()
  progress_pack_info: 'מביא את פרטי הגרסה של סביבת הריצה…',
  progress_picking_source: 'בוחר את מקור ההורדה המהיר ביותר ({source})…',
  progress_runtime_download: 'מוריד את סביבת הריצה (כ-1.5 GB, פעם אחת בלבד, {conn} חיבורים)…',
  eta_suffix: ' · נותרו כ-{min} דקות',
  progress_runtime_bytes: 'מוריד סביבת ריצה {info}',
  progress_pack_extract: 'חולץ את סביבת הריצה (כדקה)…',
  progress_extract_entry: 'מחלץ {done}/{all}',
  progress_sysimg_expand: 'מרחיב את תמונת המערכת (כדקה, פעם אחת בלבד)…',
  progress_done_ready: 'סביבת הריצה מוכנה',

  // materializeImages()
  copy_component_failed: 'העתקת רכיב תמונה נכשלה: {msg}',
  progress_expand_image: 'אתחול ראשון: מרחיב את תמונת המערכת {name} (כדקה, פעם אחת בלבד)',
  err_lzma_missing: 'חבילה לא מלאה: חסר רכיב החילוץ ‎@napi-rs/lzma ולא ניתן להרחיב את תמונת המערכת. יש להוריד שוב את הגרסה המלאה או להשתמש בגרסת החנות.',
  expand_image_failed: 'הרחבת התמונה נכשלה: {msg}',
  err_materialize: 'הרחבת תמונת המערכת נכשלה ({reasons})',

  // systemImageInfo()
  note_image_incomplete: 'תמונה לא שלמה',
  note_missing_system_img: '‏system.img חסר',

  // emulatorAccel()
  note_not_installed_emulator: '‏emulator לא מותקן',
  accel_whpx_on: 'האצת חומרה WHPX מופעלת',
  accel_aehd_on: 'האצת חומרה AEHD מופעלת',
  accel_aehd_on_checkmissing: 'האצת חומרה AEHD מופעלת (emulator-check חסר; נשפט לפי הדרייבר)',
  accel_none_arm64: 'האצת חומרה לא מופעלת: ‏WHPX/AEHD אינם יכולים להאיץ את מנוע ה-x64 על ARM64 (Google אינה מפרסמת מנוע ARM64); יופעל בהדמיית תוכנה',
  accel_none_fallback: 'האצת חומרה לא מופעלת: יעבור להדמיית תוכנה (עובד אך איטי). מומלץ להתקין את דרייבר ה-AEHD או להפעיל את "Virtual Machine Platform".',

  // installEmulator()
  progress_engine_download: 'מוריד את מנוע סביבת הריצה (כ-440MB, מהמקור הרשמי של Google)…',
  progress_engine_bytes: 'מוריד את מנוע סביבת הריצה {got}MB / {total}MB{speed}',
  progress_engine_extract: 'חולץ את מנוע סביבת הריצה…',
  err_emulator_broken: 'ה-emulator אינו פועל לאחר החילוץ; בדוק אם תוכנת אנטי-וירוס חסמה אותו',
  progress_engine_done: 'מנוע סביבת הריצה {version} מוכן',

  // playImageInfo() / installPlayImage()
  progress_compat_download: 'מוריד את התמונה התואמת ARM (Android 14, כ-1.5GB)…',
  progress_compat_bytes: 'מוריד תמונה תואמת {got}MB / {total}MB{speed}',
  progress_compat_extract: 'חולץ את התמונה התואמת (3GB, ייקח זמן)…',
  progress_compat_entry: 'מחלץ תמונה תואמת {i}/{total}',
  err_compat_verify: 'התמונה התואמת נכשלה באימות לאחר החילוץ',
  progress_compat_done: 'התמונה התואמת ARM מוכנה; הפעל מחדש את סביבת הריצה כדי שתיכנס לפעולה',

  // installAehd()
  err_arm64_aehd: '‏AEHD אינו יכול להאיץ את מנוע ה-x64 על ARM64 (Google אינה מפרסמת מנוע ARM64)',
  progress_aehd_download: 'מוריד את דרייבר ה-AEHD…',
  err_aehd_extract: 'חילוץ חבילת דרייבר ה-AEHD השתבש',
  progress_aehd_done: 'דרייבר ה-AEHD מוכן; נדרשות הרשאות מנהל להתקנתו',

  // installQemu()
  progress_qemu_resolve: 'מחפש את גרסת ה-QEMU העדכנית…',
  progress_qemu_download: 'מוריד QEMU (כ-200MB)…',
  progress_qemu_bytes: 'מוריד QEMU… {got}MB / {total}MB{speed}',
  progress_qemu_install: 'מתקין את QEMU (שקט)…',
  err_qemu_missing_exe: '‏qemu-system-x86_64.exe לא נמצא לאחר התקנת QEMU: אפשר להוריד QEMU ידנית ולחלץ אותו אל engine/qemu/',
  progress_qemu_done: '‏QEMU {version} מוכן',

  // downloadIso()
  progress_iso_download: 'מוריד את Android-x86 9.0-r2 (כ-900MB, 8 חיבורים מקבילים)…',
  progress_iso_bytes: 'מוריד תמונת מערכת… {got}MB / {total}MB{speed}',
  err_iso_unusable: 'תמונת המערכת בלתי שמישה: {reason}{resume}',
  iso_resume_suffix: '; לחץ שוב להמשך ההורדה מהנקודה שנעצרה',
  progress_iso_done: 'תמונת המערכת מוכנה ({gb} GB)',

  // inspectImage() / importIso()
  err_file_empty: 'הקובץ לא קיים או ריק',
  err_image_unusable: 'קובץ התמונה בלתי שמיש',

  // createDisk()
  progress_disk_create: 'יוצר דיסק וירטואלי בגודל {gb}GB…',
  err_qemuimg_disk: '‏qemu-img נכשל ביצירת הדיסק הווירטואלי: {detail}',
  err_qemuimg_missing: '‏qemu-img.exe לא נמצא; התקן את QEMU תחילה',
  progress_disk_done: 'הדיסק הווירטואלי נוצר',
};
