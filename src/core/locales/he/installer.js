'use strict';
// installer / he — קטלוג עברית עבור src/core/installer.js (החוזה: src/core/i18n.js)
module.exports = {
  // פענות חבילה מפוצלת (.apks/.xapk)
  bundle_no_apk_parts: 'לא נמצאו חלקי APK בחבילה הזו (ייתכן שאינה .apks/.xapk)',
  bundle_base_parse_failed: 'פענוח ה-base APK של החבילה המפוצלת נכשל',

  // תמונה תואמת ותזמור סביבת ריצה
  compat_image_downloading: 'התקנת אפליקציית ARM ראשונה: מוריד את התמונה התואמת (כ-1.5GB, פעם אחת בלבד)…',
  compat_image_download_failed: 'הורדת התמונה התואמת נכשלה; בדוק את הרשת ונסה שוב',
  switching_compat_image: 'מחליף לתמונה התואמת ומפעיל מחדש את סביבת הריצה…',
  compat_runtime_unavailable: 'סביבת הריצה אינה זמינה לאחר המעבר לתמונה התואמת',
  restoring_app: 'משחזר את האפליקציה המותקנת {label}…',
  parsing_apk: 'מפענח APK…',
  apk_identified: 'זוהה {label} ({package})',
  preparing_runtime: 'מכין את סביבת האנדרואיד…',
  runtime_unavailable: 'סביבת הריצה אינה זמינה',
  arm_switching: 'לאפליקציה הזו ספריות ARM בלבד; מחליף לתמונה התואמת…',
  arm_switching_retry: 'לאפליקציה הזו ספריות ARM בלבד; מחליף לתמונה התואמת ומתקין מחדש…',
  arm_switch_no_translation: 'שכבת תרגום ARM אינה מופעלת בסביבת הריצה הנוכחית; מחליף לתמונה התואמת ומנסה שוב…',
  abi_retried_still_failed: 'הוחלף לתמונה התואמת של Android 14 וסביבת הריצה הופעלה מחדש, אך {label} עדיין נכשל בהתקנה ({raw}). בדוק מקום בדיסק ואת הרשת ונסה שוב; אם זה ממשיך להיכשל, ייצא דוח אבחון בהגדרות ← אבחון ותיקון.',

  // התקדמות צינור ההתקנה
  updating_app: 'מעדכן את האפליקציה…',
  installing_app: 'מתקין את האפליקציה…',
  compat_switched_reinstalling: 'התמונה התואמת הוחלפה; מתקין מחדש…',
  creating_shortcut: 'יוצר את קיצור הדרך בשולחן העבודה…',
  shortcut_create_failed: 'יצירת קיצור הדרך נכשלה: {reason}',
  shortcut_create_failed_generic: 'יצירת קיצור הדרך נכשלה',
  install_done: '{label} הותקנה',

  // אזהרות רכות לאחר ההתקנה
  warn_min_sdk: 'האפליקציה דורשת Android {sdk}+, גבוה מסביבת הריצה הנוכחית; ייתכן שלא תרוץ כראוי.',
  warn_icon_placeholder: 'לא ניתן היה לפענח את האייקון של האפליקציה (ייתכן אייקון אדפטיבי בפורמט מיוחד); קיצור הדרך משתמש כרגע באייקון חלופי.',
  warn_icon_webp_failed: 'פענוח האייקון של האפליקציה (WebP) נכשל; קיצור הדרך משתמש כרגע באייקון חלופי.',

  // תזמור הפעלה (התקדמות ושגיאות onLog)
  display_adapt_skipped: 'התאמת תצוגה דולגה: {reason}',
  net_ready: 'הרשת של ה-VM מוכנה ({ip})',
  wifi_reconnecting: 'ה-VM אינו מצליח להתחבר ל-Wi-Fi; מנסה להתחבר מחדש…',
  net_restored: 'הרשת של ה-VM שוחזרה ({ip})',
  wifi_reconnect_failed: 'התחברות מחדש אוטומטית ל-Wi-Fi נכשלה: {reason}',
  net_not_ready: 'הרשת של ה-VM עדיין לא מוכנה; מפעיל את האפליקציה בכל זאת (דפים מקוונים עשויים להיטען מאוחר)',
  reinstalling_from_backup: 'קבצי האפליקציה חסרים (אי-התאמה בין snapshot לנתונים); מתקין מחדש אוטומטית מהגיבוי המקומי…',
  auto_install_failed: 'התקנה אוטומטית נכשלה: {reason}',
  launch_retry: 'האפליקציה יצאה לאחר ההפעלה (ניסיון {attempt}); מנסה שוב אוטומטית…',
  reset_and_retry: 'האפליקציה ממשיכה לצאת; מאפס את נתוני האפליקציה ומנסה שוב…',
  app_unstable: 'האפליקציה יצאה מיד לאחר ההפעלה; ניסיונות חוזרים אוטומטיים ואיפוס נתוני האפליקציה לא עזרו',
};
