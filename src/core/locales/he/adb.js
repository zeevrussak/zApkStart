'use strict';
// adb / he — קטלוג עברית עבור src/core/adb.js (החוזה: src/core/i18n.js)
module.exports = {
  // סיבות כשל של pm install (friendlyInstallError)
  install_abi_mismatch: 'ההתקנה נכשלה: האפליקציה מספקת ספריות native של ARM בלבד (רוב האפליקציות הסיניות כך), ולתמונת המערכת הנוכחית אין שכבת תרגום ARM. zApkStart יחליף אוטומטית לתמונה תואמת עם שכבת התרגום החדשה וינסה שוב.',
  install_older_sdk: 'ההתקנה נכשלה: האפליקציה דורשת גרסת Android חדשה יותר מסביבת הריצה הנוכחית (נדרשת תמונת מערכת חדשה יותר).',
  install_no_certificates: 'ההתקנה נכשלה: ל-APK אין חתימה תקפה ולא ניתן להתקין אותו.',
  install_cert_mismatch: 'ההתקנה נכשלה: החתימה שונה מהגרסה המותקנת; הסר תחילה את הגרסה הישנה ואז התקן.',
  install_version_downgrade: 'ההתקנה נכשלה: גרסה חדשה יותר כבר מותקנת במכשיר; לא ניתן להחליף אותה בגרסה ישנה יותר.',
  install_no_space: 'ההתקנה נכשלה: נגמר המקום בדיסק של סביבת הריצה (not enough space); פנה מקום ונסה שוב.',
  install_invalid_apk: 'ההתקנה נכשלה: קובץ ה-APK פגום או חסר (ייתכן שההורדה לא הושלמה); השג את הקובץ שוב.',
  install_invalid_uri: 'ההתקנה נכשלה: נתיב ה-APK מכיל תווים מיוחדים; העבר את הקובץ לנתיב ASCII פשוט ונסה שוב.',
  install_already_exists: 'ההתקנה נכשלה: כבר מותקנת אפליקציה עם אותו שם חבילה וחתימה שונה; הסר אותה תחילה.',
  install_update_incompatible: 'ההתקנה נכשלה: החתימה שונה מהגרסה המותקנת; הסר תחילה את הגרסה הישנה.',
  install_deprecated_sdk: 'ההתקנה נכשלה: האפליקציה מיועדת לגרסאות Android ישנות מאוד (targetSdk נמוך מדי), ו-Android 14 חוסם זאת כברירת מחדל. zApkStart ינסה שוב אוטומטית עם דגל העקיפה הרשמי.',
  install_test_only: 'ההתקנה נכשלה: זו חבילת אפליקציה לבדיקות בלבד; דגל הבדיקות נוסף אוטומטית וההתקנה תימשך.',
  install_missing_shared_library: 'ההתקנה נכשלה: רכיב מכשיר שהאפליקציה תלויה בו (כגון ספריית יצרן) אינו קיים בסביבת הריצה הנוכחית.',
  install_user_restriction: 'ההתקנה נכשלה: המערכת מגבילה התקנות; הפעל מחדש את סביבת הריצה ונסה שוב.',
  install_conflicting_provider: 'ההתקנה נכשלה: קונפליקט עם ה-ContentProvider של אפליקציה קיימת; הסר את האפליקציה המתנגשת.',
  install_internal_error: 'ההתקנה נכשלה: שגיאת מערכת פנימית (נפוץ במקרה של מקום אחסון לא מספיק או אתחול שלא הושלם); הפעל מחדש את סביבת הריצה ונסה שוב.',
  install_unknown: 'ההתקנה נכשלה: {raw}',
  install_no_clear_reason: 'ההתקנה נכשלה ללא סיבה ברורה',

  // סיבות כשל הפעלה (friendlyLaunchError)
  default_app_name: 'האפליקציה',
  launch_anti_emulator: '{pkg} זיהתה סביבת אמולטור / תרגום ויצאה מרצונה (anti-emulator, anti-debug, או בדיקות SafetyNet/Play Integrity). זו מגבלה של האפליקציה עצמה ולא תקלה; zApkStart אינו יכול לעקוף זאת — ראה המדריך המובנה 6.3.',
  launch_abi_crash: '{pkg} קרסה לאחר ההפעלה: האפליקציה אינה תואמת לשכבת תרגום ה-ARM (libndk_translation/houdini; בדרך כלל זיהוי anti-debug / anti-emulator או קונפליקט native hook). אם התמונה התואמת עדיין לא מופעלת, zApkStart יחליף וינסה שוב פעם אחת; אם היא עדיין קורסת כשהתמונה מופעלת, זו מגבלת תאימות של האפליקציה ולא תקלה — ראה המדריך המובנה 6.3.',
  launch_missing_lib: '{pkg} קרסה לאחר ההפעלה: חסרה ספריית native של המכשיר (ייתכן שהאפליקציה מספקת גרסאות ARM בלבד). אם שכבת תרגום ה-ARM עדיין לא מופעלת, zApkStart יחליף לתמונה תואמת וינסה שוב; אם היא עדיין קורסת כשהשכבה מופעלת, זו בדרך כלל מגבלה של האפליקציה — ראה המדריך המובנה 6.3.',
  launch_java_crash: '{pkg} קרסה מיד עם ההפעלה (חריגה פנימית של האפליקציה; ייתכן קשר לסביבת האמולטור או להיעדר שירותי Google).',
  launch_security: '{pkg} לא הצליחה לעלות: המערכת דחתה את בקשת ההפעלה (בעיית הרשאות או חתימה).',
  launch_generic: '{pkg} לא הצליחה לעלות: {raw}',
  launch_no_process: '{pkg} לא הצליחה לעלות (התהליך לא נשאר חי)',

  // קריאות adb וערוץ הקלט הקבוע
  exec_failed: 'הפקודה adb {args} נכשלה: {raw}',
  input_session_start_failed: 'הפעלת הפעלת adb shell נכשלה',
  input_session_exited: 'הפעלת ה-adb shell הסתיימה',
  input_invalid_command: 'פקודת input לא חוקית',
  input_timeout: 'פקודת ה-input חרגה מזמן ההמתנה',
  input_closed: 'ערוץ הקלט נסגר',

  // התקנה / IME
  apk_not_found: 'קובץ ה-APK לא נמצא: {path}',
  no_split_parts: 'אין קבצי APK מפוצלים להתקנה',
  split_install_failed: 'התקנת APK מפוצל נכשלה',
  app_still_loading: '(האפליקציה עדיין בטעינה)',
  ime_apk_missing: 'קובץ ה-APK של שיטת הקלט חסר',
  ime_not_registered: 'חבילת שיטת הקלט לא נרשמה',

  // ניסוח ה-anti-emulator בגרסת WSA (docs/zapkstart/wsa-backend.md wording rules)
  launch_anti_emulator_wsa: '{pkg} מסרב לסביבות מדומות/וירטואליות ויצא מעצמו. ב-WSA, בדיקות שלמות המכשיר (Play Integrity / SafetyNet) עשויות עדיין לחסום אותו — זו מגבלה של האפליקציה, לא תקלה; ל-builds מסוג core-lane של WSA אין גם שירותי Google.',
};
