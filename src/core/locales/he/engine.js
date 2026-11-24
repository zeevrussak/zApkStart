'use strict';
// engine / he — קטלוג עברית עבור src/core/engine.js (החוזה: src/core/i18n.js)
module.exports = {
  // status()
  adb_missing: 'חסר adb: לחץ על "פריסה בלחיצה אחת" להורדה אוטומטית',

  // bootEmulator()
  accel_fallback_notice: 'לא זוהתה האצת חומרה: מעביר אוטומטית להדמיית תוכנה (האתחול הראשון יהיה איטי משמעותית; אין צורך בפעולה מצדך)',
  auth_title: 'אישור ניפוי ה-Android לא הושלם (נדרשת לחיצה אחת על "אפשר")',
  auth_hint: 'האמולטור תקוע בתיבת הדו-שיח "לאפשר ניפוי USB?". לחץ על "אפשר" בחלון האמולטור — סמן "אפשר תמיד מהמחשב הזה" ולחץ שוב; לא יישאל שוב. אם החלון לא מגיב או לא מופיע: הגדרות → סביבת ריצה → נקה את נתוני Android ונסה שוב (הפעולה מסירה אפליקציות מותקנות — אפשר להתקין אותן מחדש; קבצי ה-APK שלך אינם מושפעים).',
  auth_repair_log: 'adb תקוע בתיבת הדו-שיח "אפשר ניפוי USB"; מבטל תמונת מצב ישנה ומפעיל אתחול קר להזרקת המפתח הציבורי מחדש…',
  adb_reconnect_log: 'תקלת חיבור adb; מפעיל מחדש את שרת ה-adb וממשיך להמתין…',
  boot_failed_default: 'סביבת הריצה של Android לא הצליחה לעלות',

  // prewarm()
  prewarm_prefix: 'חימום מקדים: {msg}',
  prewarm_done: 'החימום המקדים הסתיים ({sec}s)',

  // bootQemu()
  err_qemu_missing: 'QEMU לא מותקן; יש להשלים את פריסת סביבת הריצה תחילה',
  err_iso_missing: 'תמונת המערכת (ISO) אינה מוכנה',
  err_disk_missing: 'Android עדיין לא הותקן על הדיסק הווירטואלי',
  accel_whpx: 'האצת חומרה WHPX',
  accel_sw: 'הדמיית תוכנה בלבד',
  boot_mode_log: 'מפעיל את סביבת הריצה ({mode})…',
  spawn_failed: 'ההפעלה נכשלה: {msg}',
  qemu_exited: 'סביבת הריצה יצאה (code={code})',
  err_qemu_start: 'QEMU נכשל בהפעלה; לפרטים ראה ביומן: {log}',
  installer_started: 'תוכנת ההתקנה הופעלה; השלם את ההתקנה לפי האשף בחלון המכונה הווירטואלית',
  err_adb_no_connect: 'המכונה עלתה אך adb לא הצליח להתחבר: הפעל "אפשרויות מפתח → ADB over network" במכונה ונסה שוב',
  err_kernel_boot: 'ליבת ה-Android לא סיימה לעלות; בדוק את יומן סביבת הריצה (ייתכן שהתמונה פגומה או שההאצה לא נכנסה לפעולה)',
  err_services_not_ready: 'Android עלה אך שירותי המערכת אינם מוכנים (ייתכן שתקוע באשף ההגדרה של האתחול הראשון; השלם אותו בחלון המכונה)',

  // waitAndroidReady() / waitAdb()
  kernel_up_wait: 'הליבה של Android עלתה; ממתין לשירותי המערכת… ({sec}s)',
  android_ready: 'Android מוכן ({sec}s)',
  waiting_services: 'ממתין לשירותי המערכת… {sec}s',
  waiting_android: 'מעלה את Android… {sec}s',
  waiting_adb: 'ממתין לעליית Android… {sec}s',

  // prepare() — שפת האורח / שיטת קלט
  ime_status: 'שיטת קלט בסינית: {status}',
  ime_installed: 'הותקנה והופעלה',
  ime_ready: 'מוכנה',
  ime_not_ready: 'לא מוכנה',
  guest_locale_skip: 'אתחול שפת האורח דולג: {msg}',
  empty: '(ריק)',
  sys_locale_reset: 'שפת המערכת עדיין {cur}; מבטל תמונת מצב ישנה — האתחול הבא יהיה קר ויעבור ל-{want}',
  sys_locale_skip: 'תיקון שפת המערכת דולג: {msg}',

  // QEMU monitor / תוכנת ההתקנה
  err_monitor_timeout: 'ה-monitor חרג מזמן ההמתנה',
  err_need_iso: 'הורד או ייבא תחילה תמונת מערכת Android (ISO)',
  err_installer_boot: 'הפעלת סביבת ההתקנה נכשלה',

  // adoptExisting()
  adopt_none: 'לא נמצאה סביבת ריצה שנותרה; מתכונן לאתחול קר',
  adopt_found: 'נמצאו {count} סביבות ריצה שנותרו (פורטים {ports}); מנסה לאמץ אותן',
  adopt_not_ready: 'נמצאה סביבת ריצה שנותרה ({serial}) אך היא אינה מוכנה; מכבה אותה ומפעיל מחדש',
  adopt_ok: 'אומצה סביבת הריצה הפעילה ({serial})',

  // _ensureInner()
  adb_zombie: 'adb מדווח על מכשיר מחובר אך הפקודות נכשלות (ייתכן שהאמולטור באתחול); מפעיל את סביבת הריצה מחדש…',
  stuck_restart: 'זוהתה סביבת ריצה תקועה; מפעיל מחדש…',
  materialize_failed: 'הרחבת תמונת המערכת נכשלה: {msg}',
  err_need_sysimg: 'עדיין חסרה תמונת מערכת: לחץ על "הורדת תמונת מערכת"',
  err_not_provisioned: 'רכיבי סביבת הריצה עדיין לא נפרסו במלואם',

  // מספר חלונות / סשן מכל
  multiwindow_tombstone: 'מספר חלונות: בחזית {pkg}, {kept} נשמרו ברקע, {n} הושהו',
  multiwindow_ok: 'מספר חלונות: {count} אפליקציות במקביל, אין צורך בפינוי',
  container_parked: 'המכל הוחנה (Android נשאר פעיל, 0 תהליכי אפליקציות, qemu בעדיפות הנמוכה)',

  // תיקון כיוון / תצוגה
  orient_heal: 'תיקון כיוון: init={init} cur={cur} התהפך; מכנס מחדש',
  display_converge: 'מצב התצוגה התכנס: ignore-orientation={ignore} density={density} → משלים',
  density_skip_foreground: 'density={density} חסר אך אפליקציה בחזית: דילוג, יוגדר בהפעלה הבאה (מונע תצוגה מכווצת)',

  // המתנה ותיקון רשת
  waiting_net: 'ממתין שהמכונה הווירטואלית של Android תתחבר לרשת… {sec}s',
  wifi_retry: 'המכונה אינה מצליחה להתחבר ל-Wi-Fi; מנסה התחברות מחדש…',
  net_restored_save: 'הרשת חזרה ({ip}); שומר את המצב התקין כדי שיעבוד ישירות בפעם הבאה.',
  net_cold_boot: 'הרשת עדיין לא מוכנה; מפעיל אתחול קר של המכונה (בלי לטעון תמונת מצב) ומנסה שוב…',
  net_repair_start: 'מתקן את הרשת של המכונה: מנסה תחילה לחבר מחדש את ה-Wi-Fi (אפליקציות מותקנות אינן מושפעות)…',
  err_vm_boot: 'המכונה הווירטואלית לא הצליחה לעלות',
  net_restored_saved: 'הרשת חזרה ({ip}); תמונת מצב תקינה נשמרה.',
  cold_boot_retry: 'ההתחברות מחדש נכשלה; מפעיל אתחול קר של המכונה (בלי תמונת מצב, הנתונים נשמרים)…',
  net_reset_data: 'עדיין אין רשת; מאפס את נתוני ה-Android ומפעיל מחדש (רשימת האפליקציות נשמרת; הן מותקנות מחדש בעת הפתיחה)…',
  net_restored_gw: 'הרשת חזרה ({ip} שער {gw}); תמונת מצב תקינה נשמרה.',
  gw_reachable: 'נגיש',
  net_reset_still_offline: 'עדיין אין חיבור לאחר האיפוס. בדוק אם הרשת/חומת האש המקומית חוסמת את האמולטור (netsimd משתמש בפורטי loopback מקומיים).',

  // ניתוב WSA / מכשיר adb חיצוני (docs/zapkstart/wsa-backend.md)
  wsa_idle_disconnect: 'פינוי בזמן מנוחה: נותקה תעבורת ה-adb של WSA (ה-VM ממשיך לרוץ; הוא בניהול המשתמש)',
  adb_server_reset_skip_wsa: 'מדלג על הפעלה מחדש של שרת ה-adb: הפעולה תמחק את רישום ה-WSA בשרת ה-adb המשותף',
};
