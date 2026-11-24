'use strict';
/**
 * 结构化错误码契约（i18n 抽取的配套件）。
 *
 * 背景：friendlyInstallError / friendlyLaunchError 原来只返回一句中文文案，
 * 渲染层只能靠正则匹配文案片段（如 /空间不足/）来决定下一步提示 —— 文案一改
 * 匹配就悄悄失效。抽取 i18n 后文案随语言变化，正则匹配彻底不可靠，所以这里
 * 给出稳定的机器可读错误码：mkErr(code, params, raw) → { code, params, raw }，
 * friendly* 函数返回 { ...mkErr(...), message }（message 仍可展示，code 可编程处理）。
 *
 * CODES 把每个错误码映射到它的 i18n key（命名空间见 src/core/i18n.js）；
 * mkErr 的 code 参数取这里的**键名**（如 'INSTALL_NO_SPACE'），值仅作 key 查表用。
 * 历史行为保留：抛出的 Error 上 err.code 仍用旧值（'NO_MATCHING_ABIS' /
 * 'INSTALL_<TAG>' / 'APP_CRASHED' / 'APP_UNSTABLE'），结构化码放在 err.errCode。
 */
const CODES = {
  // ---- pm install 失败（adb.friendlyInstallError） ----
  INSTALL_ABI_MISMATCH: 'adb.install_abi_mismatch',
  INSTALL_OLDER_SDK: 'adb.install_older_sdk',
  INSTALL_NO_CERTIFICATES: 'adb.install_no_certificates',
  INSTALL_CERT_MISMATCH: 'adb.install_cert_mismatch',
  INSTALL_VERSION_DOWNGRADE: 'adb.install_version_downgrade',
  INSTALL_NO_SPACE: 'adb.install_no_space',
  INSTALL_INVALID_APK: 'adb.install_invalid_apk',
  INSTALL_INVALID_URI: 'adb.install_invalid_uri',
  INSTALL_ALREADY_EXISTS: 'adb.install_already_exists',
  INSTALL_UPDATE_INCOMPATIBLE: 'adb.install_update_incompatible',
  INSTALL_DEPRECATED_SDK: 'adb.install_deprecated_sdk',
  INSTALL_TEST_ONLY: 'adb.install_test_only',
  INSTALL_MISSING_SHARED_LIBRARY: 'adb.install_missing_shared_library',
  INSTALL_USER_RESTRICTION: 'adb.install_user_restriction',
  INSTALL_CONFLICTING_PROVIDER: 'adb.install_conflicting_provider',
  INSTALL_INTERNAL_ERROR: 'adb.install_internal_error',
  INSTALL_UNKNOWN: 'adb.install_unknown',

  // ---- 启动失败（adb.friendlyLaunchError） ----
  LAUNCH_ANTI_EMULATOR: 'adb.launch_anti_emulator',
  LAUNCH_ABI_CRASH: 'adb.launch_abi_crash',
  LAUNCH_MISSING_LIB: 'adb.launch_missing_lib',
  LAUNCH_JAVA_CRASH: 'adb.launch_java_crash',
  LAUNCH_SECURITY: 'adb.launch_security',
  LAUNCH_GENERIC: 'adb.launch_generic',
  LAUNCH_NO_PROCESS: 'adb.launch_no_process',

  // ---- adb 调用 / 常驻输入通道 ----
  EXEC_FAILED: 'adb.exec_failed',
  INPUT_SESSION_START_FAILED: 'adb.input_session_start_failed',
  INPUT_SESSION_EXITED: 'adb.input_session_exited',
  INPUT_INVALID_COMMAND: 'adb.input_invalid_command',
  INPUT_TIMEOUT: 'adb.input_timeout',
  INPUT_CLOSED: 'adb.input_closed',

  // ---- 安装编排面（adb / installer） ----
  APK_NOT_FOUND: 'adb.apk_not_found',
  INSTALL_NO_SPLIT_PARTS: 'adb.no_split_parts',
  INSTALL_SPLIT_FAILED: 'adb.split_install_failed',
  IME_APK_MISSING: 'adb.ime_apk_missing',
  IME_NOT_REGISTERED: 'adb.ime_not_registered',
  RUNTIME_UNAVAILABLE: 'installer.runtime_unavailable',
  COMPAT_IMAGE_DOWNLOAD_FAILED: 'installer.compat_image_download_failed',
  COMPAT_RUNTIME_UNAVAILABLE: 'installer.compat_runtime_unavailable',
  ABI_RETRIED_STILL_FAILED: 'installer.abi_retried_still_failed',
  APP_UNSTABLE: 'installer.app_unstable',
  SHORTCUT_CREATE_FAILED: 'installer.shortcut_create_failed',
};

/**
 * 造一个结构化错误对象。
 * @param {string} code CODES 里的稳定错误码
 * @param {object} [params] 文案插值参数（与 message 的 {placeholder} 一一对应）
 * @param {string} [raw] 原始错误文本（pm install / logcat / adb stderr）
 * @returns {{code:string, params:object, raw:string}}
 */
function mkErr(code, params, raw) {
  return { code, params: params || {}, raw: raw == null ? '' : String(raw) };
}

module.exports = { CODES, mkErr };
