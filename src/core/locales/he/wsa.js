'use strict';
// wsa / he — Hebrew catalog for src/core/backends/wsa.js + backends/index.js
// (contract: src/core/i18n.js; docs/zapkstart/wsa-backend.md wording rules)
module.exports = {
  // Backend identity (settings page describe())
  backend_label: 'Windows Subsystem for Android (WSA)',
  backend_summary: 'מריץ אפליקציות בחלונות ה-freeform של WSA על תת-מערכת Android 13 עם ARM64 טבעי (בלי אמולציית מעבד). עובד רק דרך adb: אפליקציות x86 בלבד ואפליקציות הדורשות אישור Play לא יעבדו; ה-VM נשאר בניהול שלך.',

  // probe / check
  not_installed: 'Windows Subsystem for Android אינו מותקן במחשב זה',
  adb_missing: 'חסר adb: לחץ על "פריסה בלחיצה אחת" כדי להוריד אותו אוטומטית',

  // ensure() state machine
  connecting: 'מתחבר ל-WSA דרך adb ({serial})…',
  starting_vm: 'WSA עדיין לא מגיב; מפעיל את תת-המערכת…',
  connect_wait: 'עדיין ממתין לנקודת ה-adb של WSA… ({sec}s)',
  port_fallback: 'הפורט המוגדר לא מגיב; מנסה פעם אחת בפורט {port}…',
  port_saved: 'WSA הגיב בפורט {port}; הפורט נשמר להפעלות הבאות',
  connected: 'מחובר ל-WSA ({serial})',
  unauthorized: 'WSA מבקש אישור דיבוג: פתח את הגדרות WSA, הפעל adb ואשר את הדו-שיח "Allow USB debugging?"',
  adb_toggle_needed: 'WSA רץ אבל נקודת ה-adb שלו מסרבת לחיבורים: פתח את האפליקציה Windows Subsystem for Android → הגדרות מפתחים → הפעל "Developer mode" וגם "IP address" (adb) — ונסה שוב',

  // backends/index.js fallback log
  fallback_builtin: 'מצב המנוע הוא "WSA" אך החבילה לא זוהתה; חוזרים לזמן הריצה המובנה',

  // status() / usage / dataInfo
  not_connected: 'WSA עדיין לא מחובר. פתח כל אפליקציה מותקנת כדי להעיר את תת-המערכת',
  managed_by_wsa: 'האחסון והתהליכים מנוהלים על ידי Windows Subsystem for Android; zApkStart מריץ אותו רק דרך adb ואין בידינו את המספרים האלה',
};
