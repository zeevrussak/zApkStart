'use strict';
// drivers / he — קטלוג עברית עבור src/core/drivers.js (החוזה: src/core/i18n.js)
module.exports = {
  // FORBIDDEN_ARGS (הערכים הם שמות מפתח בטבלה זו; מוזרקים דרך תבנית args_forbidden)
  forbid_wipe_data: 'ימחק את האפליקציות המותקנות והשמירות של המשתמש',
  forbid_datadir: 'ישנה את מיקום ה-AVD ויפר את בידוד המופעים המרובים',
  forbid_sysdir: 'ישנה את מקור תמונת המערכת',
  forbid_partition_size: 'ישנה את גודל מחיצת הנתונים; השתמש בעמוד ההגדרות',
  forbid_avd: 'את שם ה-AVD מנהלת zApkStart',
  forbid_port: 'את הפורט מקצה zApkStart באופן דינמי',
  forbid_http_proxy: 'את הפרוקסי מגדירים בהגדרות המערכת',

  // validateArgs()
  args_forbidden: '‏emulatorArgs אינו מאפשר {flag}: {why}',
  err_flag_only: '‏emulatorArgs אינו תומך בדגל בודד {flag} (לערך כתוב {flag}=ערך)',
  err_arg_unknown: '‏emulatorArgs אינו תומך ב-{flag}',
  err_arg_value: 'ל-emulatorArgs ערך בלתי תקף עבור {flag}: {value}',
  err_args_array: '‏effect.emulatorArgs חייב להיות מערך מחרוזות',

  // validateMatch()
  err_match_obj: '‏match חייב להיות אובייקט',
  err_match_key: '‏match.{key} אינו תנאי התאמה נתמך',
  err_gpu_name: '‏match.gpuName אינו ביטוי רגולרי תקף (וגם אורכו חייב להיות ≤200)',
  err_numeric_field: '‏match.{key} חייב להיות מספר או {min,max}',
  err_range_field: '‏match.{key}.{keys} חייב להיות מספר',

  // validateIni()
  err_ini_obj: '‏effect.configIni חייב להיות אובייקט',
  err_ini_key: '‏configIni אינו תומך ב-{key} (מפתחות שעלולים לפגוע במחיצת הנתונים / במיקום נדחים תמיד)',
  err_ini_value: 'ל-configIni ערך בלתי תקף עבור {key}: {value}',

  // validateEnv()
  err_env_obj: '‏effect.env חייב להיות אובייקט',
  err_env_key: '‏env אינו מאפשר להגדיר {key} (מותרים רק הקידומות ANDROID_/QEMU_/LIBGL_/MESA_/EMUGL_)',
  err_env_value: 'ל-env.{key} ערך בלתי תקף (≤200 תווים, בלי מעברי שורה)',

  // validateDriver()
  err_not_json: '{where}הדרייבר חייב להיות אובייקט JSON',
  err_format: '{where}‏format חייב להיות "{format}" (כרגע {current})',
  err_id: '{where}‏id חייב להיות מורכב מאותיות וספרות ומהתווים . _ -, ‏3~64 תווים (למשל amd-igpu-swangle)',
  err_name: '{where}‏name חובה, ולכל היותר 80 תווים',
  err_version: '{where}‏version חייב להיות בצורה 1.0.0',
  err_priority: '{where}‏priority חייב להיות מספר בין ‎-100 ל-100',
  err_match_empty: '{where}‏match אינו יכול להיות אובייקט ריק; כדי להתאים לכל המחשבים כתוב {"any": true}',
  err_effect_obj: '{where}‏effect חייב להיות אובייקט',
  err_effect_key: '{where}‏effect.{key} אינו שדה נתמך',
  err_gpu_mode: 'ל-{where}effect.gpuMode ערך בלתי תקף: {value}',
  err_force_tcg: '{where}‏effect.forceTcg חייב להיות true/false',
  err_notes_array: '{where}‏effect.notes חייב להיות מערך מחרוזות',

  // loadDir() / importDriver()
  err_file_too_big: 'הקובץ גדול מדי ({size} בתים, המגבלה {max})',
  err_file_unreadable: 'לא ניתן לקרוא: {msg}',
  err_import_too_big: 'הקובץ גדול מדי; דרייבר הוא לכל היותר 256 KB',
  err_write_failed: 'הכתיבה נכשלה: {msg}',

  // templateFromHost()
  template_name_default: 'המחשב שלי',
  template_name_suffix: 'תיקון תאימות {name}',
  template_description: 'נוצר על ידי "ייצוא תבנית מקומית" של zApkStart: ה-match כבר מולא עבור המחשב הזה; התאם את ה-effect לפי הצורך.',
  template_note_example: 'דוגמה: נסה לשנות את gpuMode ל-host / software או להפעיל את forceTcg',
};
