'use strict';
// emulator / he — קטלוג עברית עבור src/core/emulator.js (החוזה: src/core/i18n.js)
module.exports = {
  // describeExitCode()
  exit_ok: 'יצא כרגיל',
  exit_arg_env_error: 'ארגומנטי הפעלה או סביבה שגויים',
  exit_access_violation: '0xC0000005 הפרת גישה; מנגנון העיבוד הגרפי קרס',
  exit_stack_overflow: '0xC00000FD גלישת מחסנית',
  exit_dll_missing: '0xC0000135 טעינת DLL תלוי נכשלה (הסיבה בבדיקה; ראה המדריך המובנה 6.8)',
  exit_access_denied: '0xC0000022 הגישה נדחתה (בעיית דרייבר או הרשאות)',
  exit_arch_mismatch: '0xC000007B אי-התאמה של רוחב התמונה או DLL פגום',

  // killOrphanProcesses()
  kill_orphans: 'מנקה {count} תהליכי אמולטור שנותרו',

  // ensureAvd()
  tag_compat: 'Google Play (תואם ARM)',

  // ensureDataPartition()
  userdata_grown: 'userdata הורחב: קובץ {from} → {to}, מערכת קבצים {fsFrom} → {fsTo}',
  userdata_grow_failed: 'הרחבת userdata נכשלה (נשארים עם המחיצה הקיימת): {msg}',
  userdata_rebuilt: 'userdata נבנה מחדש: {gb}GB ext4 (בלוק 4K, תומך FBE)',
  userdata_rebuild_failed: 'בניית userdata מחדש נכשלה: {msg}',
  err_qemuimg: '‏qemu-img {op} נכשל: {detail}',
  err_resize2fs_missing: '‏resize2fs.exe חסר',
  err_resize2fs: '‏resize2fs נכשל: {detail}',

  // spawnOnce()
  emu_exited: 'סביבת הריצה יצאה (code={code}{meaning})',

  // resizeDataPartition()
  resize_overlay_error: 'Android משתמש כעת בדיסק ההפרש של האתחול המהיר; הרחבה במקום לא תשפיע עליו (יעד {gb} GB). יש להשתמש ב"איפוס נתוני Android" כדי לבנות את /data מחדש בקיבולת החדשה — אפליקציות מותקנות ושמירות יימחקו; נא לאשר תחילה.',
  resize_fs_shortfall: 'התמונה הורחבה ל-{want} GB אך מערכת הקבצים הגיעה רק ל-{actual} GB (ה-resize2fs לא הצליח). אפשר ללחוץ שוב על "הרחבה מיידית", או לפנות מקום בדיסק ולנסות שוב.',

  // start()
  prev_emu_exited: 'האמולטור הקודם כבר יצא; מפעיל מחדש…',
  err_no_engine: 'מנוע סביבת הריצה לא מותקן; יש להשלים את הפריסה בעמוד "סביבת ריצה" תחילה',
  err_no_sysimg: 'תמונת המערכת אינה מוכנה; יש להוריד את תמונת המערכת של Android בעמוד "סביבת ריצה" תחילה',
  disk_full_avd: 'אין מספיק מקום בדיסק: בדיסק של ספריית נתוני ה-Android ({dir}) נשארו רק {free} GB, וסביבת הריצה דורשת לפחות {need} GB פנויים. ב"הגדרות → אינטגרציית מערכת → ספריית נתוני Android" העבר אותה לדיסק עם מקום פנוי (למשל D:), או פנה את הדיסק תחילה. האפליקציות והשמירות שלך לא יימחקו אוטומטית.',
  disk_full_root: 'בדיסק של ספריית סביבת הריצה ({dir}) נשארו רק {free} GB — אין מקום אפילו ליומנים ולקבצים זמניים. פנה את הדיסק, או העבר גם את "ספריית נתוני סביבת הריצה" לדיסק אחר.',
  driver_load_failed_log: 'טעינת הדרייברים נכשלה: {msg}',
  driver_load_failed_ui: 'טעינת הדרייברים נכשלה (התעלמות; מפעיל עם פרמטרי ברירת מחדל): {msg}',
  drivers_applied: 'דרייברים שהוחלו: {names}',
  drivers_none: 'לא נמצא דרייבר מתאים; מפעיל עם פרמטרי ברירת מחדל',
  drivers_errors: '{count} קובצי דרייבר לא נטענו (הסיבה מופיעה בהגדרות → דרייברים)',
  driver_gpu_fixed: 'דרייבר קבע את מנגנון העיבוד הגרפי ל-{gpu}',
  variant_driver_tcg: '{gpu} / הדרייבר דורש הדמיית תוכנה',
  driver_tcg_notice: 'הדרייבר דורש כיבוי האצת חומרה (הדמיית תוכנה)',
  vulkan_retry_notice: 'קריסת ה-host בפעם הקודמת נראית קשורה ל-Vulkan; מנסה שוב האצת חומרה עם ‎-feature -Vulkan',
  bad_gpu_switch: 'מנגנון העיבוד {gpu} קרס בהפעלה בפעם הקודמת; מנסה תחילה {next} הפעם',
  boot_attempt: 'מפעיל את סביבת הריצה (ניסיון {i}/{total}: {label})…',
  disk_full_stop: 'אין מספיק מקום בדיסק; הפסקת ניסיונות חוזרים (האפליקציות והשמירות שלך לא נוגעו).',
  retry_next: '{title}; מחליף אוטומטית לסט פרמטרים אחר ומנסה שוב…',
  booting_progress: 'מעלה… {sec}s',
  boot_ready: 'סביבת הריצה מוכנה ({sec}s, {label})',
  net_missing_notice: '⚠ המכונה הווירטואלית של Android עדיין לא מחוברת לרשת (Wi-Fi לא משויך או שאין כתובת). אפליקציות הדורשות רשת עלולות להישאר על מסך שחור בפתיחה: פתח אותן שוב מאוחר יותר; אם זה נמשך, השתמש ב"הגדרות → תיקון רשת" להתחברות מחדש (אפליקציות מותקנות לא יימחקו).',
  boot_timeout: 'האתחול חרג מזמן ההמתנה (ייתכן אתחול ראשון איטי או שהאצת חומרה לא נכנסה לפעולה)',
  err_boot_exhausted: 'סביבת הריצה לא הצליחה לעלות לאחר מספר ניסיונות ({title}).\n{hint}\n\nנוסו: {attempts}\nדוח אבחון: {report}',

  // תמונות מצב
  snapshot_skip_space: 'דילוג שמירת תמונת מצב: נשארו {free}GB בדיסק < ה-{need}GB הנדרשים',
  snapshot_invalidate_unauth: 'האורח לא מורשה/לא מוכן בזמן כיבוי: תמונת המצב תבוטל; האתחול הקר הבא יזריק מחדש את אישור הניפוי',
  snapshot_skip_unauth: 'דילוג שמירת תמונת מצב: האורח לא מורשה או שהאתחול לא הושלם (מונע שמירת תמונת מצב פגומה)',
};
