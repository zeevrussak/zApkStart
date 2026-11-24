'use strict';
/**
 * Android 包名合法性校验。
 *
 * 包名来自 APK 的 AndroidManifest.xml（外部输入），却被直接拿去拼本地文件路径
 * （store.iconPath / apkPath）和 adb shell 命令（pm path / pidof / am start…）。
 * 不校验就等于把「../」、盘符、shell 元字符直接交给 path.join 和 shell：
 * 前者写出目标目录之外，后者命令注入。
 *
 * Android 包名的实际约束：点分隔的若干段，每段以字母/下划线开头，
 * 后面是字母/数字/下划线。这里按 ASCII 严格校验，宁可拒绝极少数奇怪的
 * 第三方包，也不放任何一个路径分隔符或 shell 字符进来。
 */
const RE_PKG = /^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)+$/;

function validPackageName(pkg) {
  return typeof pkg === 'string' && RE_PKG.test(pkg);
}

/** 非法包名改写成安全文件名（用于日志/兜底显示，不用于安装） */
function safeFilePart(pkg) {
  if (validPackageName(pkg)) return pkg;
  return `invalid-${String(pkg || 'unknown').replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 64)}`;
}

module.exports = { validPackageName, safeFilePart, RE_PKG };
