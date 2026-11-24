'use strict';
/**
 * Fork identity constants — the single source of truth for every identity-bearing
 * string in zApkStart.
 *
 * 为什么必须有这个模块：上游把「产品名 / 资产前缀」写死在至少四处代码里
 * （sources.js 白名单、sources.js 合成资产名、provision.js 运行时整包正则、
 * release.yml 的 CI 产物名）。改名时只要漏掉任何一处，自动更新就会静默装回
 * 别家的构建。所有身份相关消费方一律从这里 import，杜绝再次漂移。
 *
 * zApkStart is a fork of RoutineMiku/apkstart (MIT) — see NOTICE.md at the repo root.
 */
const PRODUCT = 'zApkStart';
const APP_ID = 'com.zapkstart.app';
const AUMID_PREFIX = 'zApkStart';
const ASSET_PREFIX = 'zApkStart-';

/** 运行时整包（由 release.yml 产出、provision.js 首启下载）的资产名匹配 */
const RUNTIME_PACK_REGEX = /^zApkStart-runtime-.*\.zip$/i;
/** 更新资产白名单：只认自家前缀，绝不下发别家的同名资产 */
const ASSET_WHITELIST_REGEX = /^zApkStart/i;

const USER_AGENT = `${PRODUCT}/0.6 (Windows)`;

/** 更新/运行时整包的唯一发布源（fork 自己的仓库；Gitee 镜像已随 fork 移除） */
const OWNER_GH = 'zeevrussak';
const REPO = 'apkstart';
const RELEASE_API = `https://api.github.com/repos/${OWNER_GH}/${REPO}`;
const RELEASE_WEB = `https://github.com/${OWNER_GH}/${REPO}`;
const RELEASES_URL = `${RELEASE_WEB}/releases`;

const EXE_NAME = `${PRODUCT}.exe`;

/** 数据目录/共享目录/AVD 命名（与上游 ApkStart 完全隔离，见 README 兼容性一节） */
const DATA_DIRNAME = 'zapkstart';
const STORE_DATA_DIRNAME = 'zApkStart';        // 商店版数据目录的父目录（%USERPROFILE%\zApkStart\data）
const SHARED_DIRNAME = 'zApkStartShared';
const DEVICE_SHARED_DIR = '/sdcard/zApkStartShared';
const AVD = 'zapkstart';
const SNAPSHOT = 'zapkstart';

module.exports = {
  PRODUCT, APP_ID, AUMID_PREFIX, ASSET_PREFIX,
  RUNTIME_PACK_REGEX, ASSET_WHITELIST_REGEX, USER_AGENT,
  OWNER_GH, REPO, RELEASE_API, RELEASE_WEB, RELEASES_URL,
  EXE_NAME, DATA_DIRNAME, STORE_DATA_DIRNAME, SHARED_DIRNAME, DEVICE_SHARED_DIR, AVD, SNAPSHOT,
};
