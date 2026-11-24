'use strict';
// main / he — קטלוג עברית עבור src/main.js (החוזה: src/core/i18n.js)
module.exports = {
  // ---- החלפת כיוון / טיפים של חלון המעטפת ----
  switch_landscape_log: 'מעבר לרוחב: מפעיל מחדש את סביבת ה-Android…',
  switch_portrait_log: 'חזרה לאורך: מפעיל מחדש את סביבת ה-Android…',
  switching_landscape: 'מחליף לרוחב (מפעיל מחדש את סביבת Android, כ־40 שניות, פעם אחת בלבד)…',
  switching_portrait: 'חוזר לאורך (מפעיל מחדש את סביבת Android, כ־40 שניות, פעם אחת בלבד)…',
  switching_for_landscape: 'מחליף את {label} לרוחב (מפעיל מחדש את סביבת Android, כ־40 שניות, פעם אחת בלבד)…',
  switching_for_portrait: 'מחליף את {label} לאורך (מפעיל מחדש את סביבת Android, כ־40 שניות, פעם אחת בלבד)…',
  tip_switching_landscape_short: 'מחליף לרוחב…',
  tip_switching_portrait_short: 'מחליף לאורך…',
  tip_opening_app: 'פותח את האפליקציה…',
  boot_runtime_tip: 'מפעיל את סביבת ה-Android…',
  fallback_embed_toast: 'חלון האמולטור המקורי לא הופיע; להפעלה הזאת נעשה שימוש בחלון המובנה',
  orientation_log_follow: '(לפי האפליקציה)',
  mark_orientation_mismatch: 'orientation mismatch (panel={cur}, want={want}) הפעלה מחדש לתיקון',
  mark_app_up: 'app up (חיבור מוקדם)',

  // ---- התקנת רכיבים / התקדמות הורדה ----
  foreign_bundle_log: 'תיקיית הרנטיים מצביעה על חבילה של התקנה אחרת ({current}); עובר לרנטיים המובנה {bundled}',
  autodeploy_cooldown: 'autoDeploy בתקופת צינון (נכשל לאחרונה ב־{time}); מדלג על ניסיון אוטומטי',
  autodeploy_skip_bundled: 'autoDeploy מדלג: הרנטיים כלול בחבילה ({dir}); אין צורך בהורדה',
  autodeploy_skip_bundled_extract: 'autoDeploy מדלג: הרנטיים כלול בחבילה ({dir}); אין צורך בהורדה, התמונות יופקו מקומית בהפעלה הראשונה',
  autodeploy_skip_diag: 'autoDeploy מדלג על ההורדה המקוונת: תיקיית הרנטיים כלולה בחבילה ({dir}); מעביר לאבחון',
  dl_runtime_pack: 'מוריד את הרנטיים מ-GitHub…',
  dl_runtime_pack_incomplete: 'חבילת הרנטיים חלקית; משלים מהמקורות הרשמיים…',
  dl_runtime_pack_fail: 'הרנטיים ב-GitHub לא זמין ({err}); עובר למקורות הרשמיים…',
  dl_adb: 'מכין את adb…',
  dl_emulator: 'מכין את סביבת ה-Android…',
  dl_sysimg: 'מכין את תמונת המערכת של Android…',
  toast_autodeploy_done: 'הרנטיים הוכן אוטומטית',
  powershell_start_failed: 'הפעלת PowerShell נכשלה',

  // ---- הדרכה ידנית לגרסת החנות ----
  msix_accel_hint: 'גרסת החנות אינה יכולה להרים הרשאות בעצמה. יש להפעיל פעם אחת ידנית: Win+R → הקלד optionalfeatures → סמן את «Windows Hypervisor Platform» (HypervisorPlatform — זה ש-WHPX באמת צריך), ואז הפעל את המחשב מחדש.',

  // ---- התראות ----
  still_running_title: 'zApkStart עדיין פועל ברקע',
  still_running_body: 'לחיצה על סמל המגש תפתח מחדש; לחיצה ימנית במגש ליציאה.',
  notify_installed_title: 'ההתקנה הושלמה',
  notify_installed_body: '{label} הותקן',
  notify_installed_shortcut: '{label} הותקן; קיצור דרך נוצר בשולחן העבודה',
  notify_install_failed_title: 'ההתקנה נכשלה',
  autodebug_new_issues_notify_title: 'הבדיקה האוטומטית מצאה בעיות חדשות',
  autodebug_new_issues_notify_body: '{text}. פתח את «הגדרות ← אבחון ותיקון» של zApkStart לטיפול בלחיצה אחת.',
  notify_sw_emu_title: 'פועל באמולציית תוכנה (איטי)',
  notify_sw_emu_store: 'הפעלת «Windows Hypervisor Platform» והפעלה מחדש אחת תאיץ פי 5–10. הגדרות ← בדיקת סביבה ← תיקון יפתח את החלון הזה ישירות.',
  notify_sw_emu_installer: 'הגדרות ← בדיקת סביבה ← תיקון יפעיל זאת בלחיצה אחת (דורש אישור מנהל), ואז הפעלה מחדש אחת.',
  notify_data_resized_title: 'מחיצת הנתונים הוגדלה',
  notify_data_resized_body: 'השטח הפנוי ל-Android הוא כ־{gb} GB',
  notify_data_resized_restarted: 'השטח הפנוי ל-Android הוא כ־{gb} GB (הרנטיים הופעל מחדש)',
  notify_up_to_date_body: 'zApkStart v{version}',
  notify_low_disk_title: 'מעט מקום בדיסק',
  notify_low_disk_body: 'נותרו רק {gb} GB. העבר את תיקיות הנתונים/הרנטיים של Android לכונן אחר ב«הגדרות ← שילוב מערכת», או פנה את הדיסק.',
  notify_shortcuts_fixed_title: 'קיצורי הדרך הושלמו',

  // ---- חלון מדריך ----
  manual_window_title: 'מדריך zApkStart · {title}',

  // ---- תזכורת בדיקה אוטומטית ----
  autodebug_new_issues_toast: 'הבדיקה האוטומטית מצאה בעיות חדשות: {text} (הגדרות ← אבחון ותיקון)',

  // ---- תפריט המגש ----
  tray_open: 'פתח את zApkStart',
  tray_manual: 'מדריך למשתמש',
  tray_no_apps: 'עדיין אין אפליקציות מותקנות',
  tray_close_current: 'סגור את האפליקציה הנוכחית',
  tray_close_current_label: 'סגור את האפליקציה הנוכחית ({label})',
  tray_rotate_to_portrait: 'חזרה לאורך (מפעיל מחדש את הרנטיים)',
  tray_rotate_to_landscape: 'מעבר לרוחב (מפעיל מחדש את הרנטיים)',
  tray_display_exit_fullscreen: 'יציאה ממסך מלא (חלון לאורך)',
  tray_display_fullscreen: 'מסך מלא (מתאים למסך)',
  tray_rebuild_shortcuts: 'בנה מחדש קיצורי דרך בשולחן העבודה/תפריט התחל',
  tray_sync_shared: 'סנכרן את תיקיית השיתוף',
  tray_settings: 'הגדרות',
  tray_update_available: 'גרסה חדשה {tag} זמינה',
  tray_check_update: 'בדוק עדכונים',
  tray_quit: 'יציאה',
  tray_tooltip: 'zApkStart — מריץ אפליקציות Android',

  // ---- דיאלוג עדכון / תהליך עדכון ----
  update_dialog_title: 'גרסה חדשה זמינה',
  update_dialog_message: 'zApkStart {tag} יצא; הגרסה שלך v{current}. לעדכן עכשיו?',
  update_now: 'עדכן עכשיו',
  update_later: 'מאוחר יותר',
  update_up_to_date_notify: 'יש לך את הגרסה העדכנית ביותר',
  update_busy_error: 'עדכון כבר מתבצע',
  update_store_error: 'בגרסת החנות העדכון מטופל על ידי Microsoft Store; עמוד «הורדות ועדכונים» נפתח',
  update_no_update_error: 'כבר על הגרסה העדכנית ביותר',
  update_no_asset_error: 'אין חבילה הניתנת להתקנה ישירה לגרסה זו; עמוד ההפצות ב-GitHub נפתח',
  update_dl_prepare: 'מתכונן להורדה…',
  update_dl_apply: 'מחליף את התוכנית ומפעיל מחדש…',
  update_resume_apply: 'משלים את העדכון שנקטע קודם…',

  // ---- התקנות במקביל ----
  install_same_file_toast: 'קובץ ה-APK הזה כבר מותקן כעת; המתן…',
  install_busy_error: 'התקנה מתבצעת',
  install_other_toast: 'התקנה אחרת מתבצעת; המתן עד שתסתיים.',
  install_other_error: 'התקנה אחרת כבר מתבצעת',

  // ---- הפעלה / סגירת אפליקציה ----
  launch_queued: 'launch queued {pkg} (ממתין ש-{other} יסיים להיטען)',
  preattach_ok: 'pre-attach detached ok (ניסיון {n})',
  launch_failed_toast: 'ההפעלה נכשלה: {err}',
  stop_no_app_error: 'אין אפליקציה פעילה',

  // ---- דיאלוגים / בחירת קבצים ----
  dialog_pick_data_dir: 'בחר תיקיית נתונים',
  dialog_pick_apk: 'בחר קבצי APK להתקנה',
  dialog_filter_android_apps: 'אפליקציות Android',
  dialog_pick_driver: 'בחר קובץ דרייבר (.json)',
  dialog_filter_driver_json: 'דרייבר JSON',
  dialog_export_driver: 'ייצוא תבנית דרייבר למחשב זה',
  dialog_pick_iso: 'בחר תמונת מערכת Android-x86 / Bliss OS',
  dialog_filter_sysimg: 'תמונת מערכת',
  dialog_pick_vdisk: 'בחר דיסק וירטואלי עם Android מותקן',
  dialog_filter_vdisk: 'דיסק וירטואלי',
  dialog_default_confirm_title: 'אישור',
  btn_cancel: 'ביטול',
  btn_ok: 'אישור',

  // ---- שגיאות ויומנים שונים ----
  app_not_found: 'האפליקציה לא נמצאה',
  err_missing_pkg: 'חסר שם חבילה',
  err_empty_dir: 'תיקייה לא יכולה להיות ריקה',
  err_missing_driver_id: 'חסר מזהה דרייבר',
  err_unknown_setting: 'הגדרה לא מוכרת {key}',
  err_invalid_capacity: 'קיבולת יעד לא חוקית',
  driver_imported_log: 'דרייבר יובא: {name} v{version}',
  preflight_applied_log: 'הגדרה אוטומטית מבדיקת סביבה: {engine} driver={driver}',
  agent_scope_empty_log: 'agent scope ריק: לא מדכא חלונות (למנוע פגיעה בתוכנות אחרות)',
  dispose_skip_log: 'מופע אחר השתלט על הרנטיים; מדלג על כיבוי (אחרת יורג האמולטור שלו)',
  console_smoke_shot_failed: '[smoke] צילום מסך נכשל',
  attach_shell_closed_log: 'attach detached: חלון המעטפת נסגר (סבב {n})',
  attach_failed_log: 'attach detached #{n} נכשל: {err}',
  attach_fallback_log: 'attach detached: כל הניסיונות נכשלו; חזרה זמנית למצב מוטמע',
  resources_unavailable_note: 'הרנטיים אינו מוכן, ולכן אין כרגע קריאה של הקצאת משאבים',

  // ---- רשימת בעיות בדיקת סביבה (doctor:selfCheck) ----
  issue_vcredist_title: 'חסר רכיב VC++ (x64)',
  issue_vcredist_hint: 'במערכת זו חסר Microsoft VC++ 2015-2022 (x64), וסביבת ה-Android תלויה בו. ניתן להתקין בלחיצה אחת; אם לאחר ההתקנה עדיין מופיע 0xC0000135, עיין בסעיף 6.8 במדריך — בגרסת החנות זה יכול להיות גם בעיית נתיב DLL של תהליך בן.',
  issue_accel_store_title: 'יש להפעיל את «Windows Hypervisor Platform»',
  issue_accel_store_hint: 'בלעדיו רק אמולציית תוכנה טהורה רצה, והפעלה עלולה להימשך דקות. {msix} (גרסת החנות אינה יכולה להרים הרשאות בשבילך; יש לבצע זאת ידנית פעם אחת ולהפעיל מחדש.)',
  issue_accel_title: 'האצת חומרה לא מופעלת',
  issue_accel_hint: '{note}לחיצה על «תיקון» מימין תפעיל זאת אוטומטית (דורש אישור מנהל, עשויה להפעיל מחדש פעם אחת); במקרה של כשל יותקן דרייבר AEHD במקום.',
  sw_fallback_note: 'חוזר לאמולציית תוכנה (עובד, אך איטי). ',
  issue_disk_title: 'מעט מקום בדיסק הרנטיים',
  issue_disk_hint: 'לכונן של «{dir}» נותרו רק {mb} MB; הרנטיים והתמונות עלולים למלא אותו.',
  issue_path_title: 'תיקיית הרנטיים מכילה תווים לא לטיניים/מיוחדים',
  issue_path_hint: 'חלק מרכיבי הרנטיים רגישים לנתיבים כאלה והדבר עלול לגרום לכשל הפעלה. מומלץ לעבור לנתיב ASCII פשוט.',
  issue_adb_title: 'חסר כלי adb',
  issue_adb_hint: 'לא ניתן להתחבר לסביבת ה-Android.',
  issue_emulator_title: 'מנוע הרנטיים לא מותקן',
  issue_emulator_hint: 'יש לפרוס קודם את מנוע הרנטיים (כ־440MB).',
  issue_sysimg_title: 'תמונת המערכת אינה מוכנה',
  issue_sysimg_hint: 'יש להוריד קודם את תמונת המערכת של Android (כ־1.5GB).',
  issue_lock_title: 'התגלו קבצי נעילה שנותרו',
  issue_lock_hint: 'ההפעלה הבאה עלולה להיחסם בטענה «ה-AVD תפוס».',

  // ---- ניקוי מטמון הרנטיים ----
  cleanup_btn: 'נקה {n} פריטים',
  cleanup_dialog_title: 'אישור ניקוי מטמון הרנטיים',
  cleanup_dialog_message: 'ישוחררו כ־{mb} MB',
  cleanup_detail_with_snapshots: 'הרנטיים ייעצר תחילה, ולאחר מכן יימחקו תמונות ישנות, תמונות מצב quick-boot של ה-AVD הנוכחי, קבצי נעילה ומטמון של AVD לא פעילים. האפליקציות המותקנות עצמן נשמרות (רק תמונות המצב נמחקות). הפעולה אינה ניתנת לשחזור — מומלץ לייצא קודם דוח אבחון.',
  cleanup_detail_no_snapshots: 'יימחקו רק תמונות ישנות, תמונות מצב ישנות, קבצי נעילה ומטמון של AVD לא פעילים; האפליקציות המותקנות נשמרות. הפעולה אינה ניתנת לשחזור — מומלץ לייצא קודם דוח אבחון.',

  // ---- האצת חומרה / הרמת הרשאות דרייבר ----
  aehd_not_ready: 'חבילת דרייבר AEHD אינה מוכנה',
  uac_cancelled_driver: 'אישור המנהל בוטל (יש ללחוץ «כן» כדי להתקין את הדרייבר)',
  driver_install_failed: 'התקנת הדרייבר נכשלה (קוד יציאה {code})',
  accel_already_note: 'האצת החומרה כבר זמינה; אין צורך בפעולה נוספת',
  accel_whpx_requested_note: 'הבקשה להפעלת «Windows Hypervisor Platform» נשלחה; האצת החומרה תיכנס לתוקף לאחר הפעלה מחדש של המחשב',
  accel_whpx_enabled_note: '«Windows Hypervisor Platform» הופעל; נכנס לתוקף לאחר הפעלה מחדש',
  uac_cancelled_accel: 'ביטלת את אישור המנהל; האצת החומרה לא שונתה. אפשר ללחוץ שוב על «תיקון», או להפעיל «Windows Hypervisor Platform» ידנית.',
  aehd_prepare_failed: 'הכנת חבילת דרייבר AEHD נכשלה',
  accel_aehd_enabled_note: 'האצת החומרה מ-AEHD הופעלה',

  // ---- דיסק מעט מקום ----
  toast_low_disk: 'נותרו רק {gb} GB בדיסק; ייתכן ש-Android לא יעלה (אפשר להחליף כונן בהגדרות ← שילוב מערכת)',

  // ---- ניתוב לכל אפליקציה (בק-אנד WSA, docs/zapkstart/wsa-backend.md) ----
  route_mismatch_builtin_on_wsa: '{app} הותקן על זמן הריצה המובנה. חזור אליו, או התקן מחדש עבור WSA — הנתונים שלו לא יועברו.',
  route_mismatch_wsa_on_builtin: '{app} הותקן על WSA. החלף את המנוע ל-WSA, או התקן מחדש על זמן הריצה המובנה — הנתונים שלו לא יועברו.',
  wsa_launch_ok: '{app} הופעל ב-WSA ({ms}ms): האפליקציה נפתחת בחלון ה-WSA שלה',
  uninstall_remote_only: 'הרשומה המקומית הוסרה. האפליקציה עצמה עדיין קיימת במנוע השני — החלף מנוע והסר שוב כדי להסיר גם שם.',

};
