'use strict';
// preflight / he — קטלוג עברית עבור src/core/preflight.js (החוזה: src/core/i18n.js)
module.exports = {
  // הסיבות של recommendGpu() (נכנסות גם להערות הדרייבר)
  gpu_why_no_accel: 'אין האצת חומרה זמינה; מתחילים בעיבוד תוכנה כדי שהתמונה תופיע בכלל',
  gpu_why_unknown_gpu: 'לא ניתן לקרוא את דגם כרטיס המסך; נניח לשרשרת הנפילה האוטומטית לנסות',
  gpu_why_small_vram: 'זיכרון גרפי מועט; swangle יציב יותר כאן',
  gpu_why_nvidia_host: '‏דרייברי NVIDIA בשלים; העברה ישירה ב-host בדרך כלל המהירה ביותר',
  gpu_why_amd_host: '‏כרטיסי AMD מקבלים האצת חומרה רק דרך host; אם קורס יש נפילה אוטומטית אחורה',
  gpu_why_intel_host: '‏כרטיסי ה-Intel המשולבים מקבלים האצת חומרה רק דרך host; אם קורס יש נפילה אוטומטית אחורה',
  gpu_why_auto: 'נניח לשרשרת הנפילה האוטומטית לנסות',

  // ---- 1. וירטואליזציית מעבד (BIOS) ----
  vt_unsupported_title: 'המעבד הזה אינו תומך בווירטואליזציית חומרה',
  vt_unsupported_detail: 'רק הדמיית תוכנה אפשרית, איטית פי 5~10. סביר לאפליקציות קלות; לא מומלץ למשחקים גדולים.',
  vt_bios_off_title: 'וירטואליזציית המעבד אינה מופעלת ב-BIOS',
  vt_bios_off_detail: '‏הפעל מחדש לתוך ה-BIOS/UEFI והגדר Intel VT-x (Intel) או SVM Mode (AMD) ל-Enabled, שמור, ואז הרץ את הבדיקה שוב. אצל Lenovo/Dell/ASUS זה בדרך כלל תחת Advanced → CPU Configuration; במחשבים מותג זה עשוי להיקרא Virtualization Technology.',
  vt_bios_off_action: 'דורש הפעלה מחדש לתוך ה-BIOS ואינו יכול להתבצע אוטומטית',
  vt_ok_title: 'וירטואליזציית המעבד מופעלת ב-BIOS',
  vt_ok_detail: '‏{name} · {cores} ליבות / {threads} תהליכונים',
  vt_unknown_title: 'לא ניתן לקרוא את מצב הווירטואליזציה של המעבד',
  vt_unknown_detail: 'ייתכן שזו מגבלת לוח אם / הרשאות. אם ההפעלה מדווחת על היעדר האצת חומרה, היכנס ידנית ל-BIOS וודא ש-VT-x / SVM מופעלים.',
  vt_unknown_action: 'בדיקה ידנית',

  // ---- 2. הצד של Windows: WHPX / Hyper-V ----
  arm64_accel_hint: '‏WHPX/AEHD אינם יכולים להאיץ את מנוע ה-x64 על ARM64 (Google אינה מפרסמת מנוע ARM64). המשך יהיה איטי יותר או ייכשל.',
  arm64_whpx_on_title: 'מארח ARM64: Hypervisor Platform מופעל, אך אין לו השפעה על מנוע ה-x64',
  arm64_whpx_off_title: 'מארח ARM64: האצת החומרה של WHPX/AEHD אינה זמינה',
  whpx_ok_title: '‏Windows Hypervisor Platform מופעל',
  whpx_ok_detail_running: '‏hypervisor פועל ו-WHPX זמין.',
  whpx_ok_detail_restart: 'התכונה מופעלת; אם ההאצה עדיין אינה זמינה, הפעל מחדש פעם אחת כדי שה-hypervisor יעלה.',
  whpx_off_title: '‏"Hypervisor Platform" אינו מופעל',
  whpx_off_store_detail: '‏גרסת החנות אינה יכולה לשנות תכונות מערכת בעצמה. הקש Win+R → הקלד optionalfeatures → סמן "Windows Hypervisor Platform" (HypervisorPlatform) ו-"Virtual Machine Platform" → אישור → הפעל מחדש.',
  whpx_off_store_action: 'פתיחת החלון "תכונות Windows"',
  whpx_off_installer_detail: 'הכפתור למטה מפעיל את HypervisorPlatform + VirtualMachinePlatform אוטומטית (נדרש אישור מנהל מערכת), ואז הפעל את המחשב מחדש.',
  whpx_off_installer_action: 'הפעלה בלחיצה אחת (נדרש מנהל מערכת)',

  // ---- 3. האם האצת החומרה באמת זמינה כרגע ----
  accel_ok_title: 'האצת חומרה זמינה ({kind})',
  accel_ok_detail: 'ההפעלה תשתמש בהאצת חומרה; התצורה למטה מומלצת עבור ה-GPU והזיכרון של המחשב הזה.',
  accel_off_title: 'אין האצת חומרה זמינה כרגע',
  accel_off_detail_aehd: 'אפשר להתקין את דרייבר ה-AEHD (נדרש מנהל מערכת), או להפעיל קודם את "Hypervisor Platform" ולהפעיל מחדש; אם אף אחד מהם לא עוזר, נותרה רק הדמיית תוכנה.',
  accel_off_detail_sw: 'קודם תשמש הדמיית תוכנה כדי שהמערכת תרוץ; צפה לאיטיות של פי 5~10 לעומת האצת חומרה.',
  accel_off_action: 'התקנת דרייבר AEHD (נדרש מנהל מערכת)',

  // ---- 4. כרטיס מסך ----
  gpu_unknown_title: 'לא ניתן לקרוא את פרטי כרטיס המסך',
  gpu_unknown_detail: 'ייתכן שולחן עבודה מרחוק / מכונה וירטואלית / דרייבר תקול. מנגנון העיבוד יימסר לשרשרת הנפילה האוטומטית.',
  gpu_vram: '‏{gb} GB זיכרון גרפי',
  gpu_vram_integrated: ' · משולב; היתרה בזיכרון משותף',
  gpu_vram_unknown: 'זיכרון גרפי לא ידוע',
  gpu_driver_seg: ' · דרייבר {version}',
  gpu_date_seg: ' ({date})',
  gpu_driver_old_title: 'דרייבר כרטיס המסך ישן למדי',
  gpu_driver_old_detail: '‏תאריך הדרייבר {date} (לפני כ-{years} שנים). דרייברים ישנים הם סיבה נפוצה ל"עולה למסך שחור / תמונה פגומה"; מומלץ לעדכן מאתר היצרן.',

  // ---- 5. זיכרון / גרסת מערכת ----
  mem_unknown_title: 'לא ניתן לקרוא את הזיכרון הפיזי',
  mem_low_title: 'הזיכרון קטן יחסית ({gb} GB)',
  mem_low_detail: 'מכונת ה-Android תקבל לכל היותר 2 GB ו-2 ליבות, איכות התמונה תרד ל-540×960; מומלץ לסגור כרטיסיות דפדפן לפני ההפעלה.',
  mem_ok_title: 'זיכרון פיזי {gb} GB',
  os_old_title: 'גרסת Windows ישנה (build {build})',
  os_old_detail: '‏{product} דורש Windows 10 2004 (build 19041) ומעלה. במערכות ישנות יותר האמולטור עשוי לצאת מיד.',

  // ---- דרייבר שנוצר אוטומטית ----
  driver_name: 'תצורה אוטומטית למחשב הזה ({gpu})',
  driver_author: 'בדיקת מקדים של {product}',
  driver_description: 'נוצר על ידי "בדיקת מקדים · תצורה אוטומטית": {why}. {accel}',
  accel_available: 'האצת חומרה זמינה.',
  accel_unavailable: 'אין האצת חומרה כרגע.',

  // ---- סיכום ----
  list_sep: ', ',
  summary_bad: 'יש {count} בעיות שחייבות לטופל קודם ({titles})',
  summary_warn: 'יש {count} סעיפים שכדאי לשפר ({titles})',
  summary_good: 'המחשב הזה יכול לרוץ על האצת חומרה ישירות והתצורה כבר אופטימלית',
};
