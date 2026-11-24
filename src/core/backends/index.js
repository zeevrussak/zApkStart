'use strict';
/**
 * 底座注册表
 *
 * **两个底座：自带运行时（builtin）+ WSA（wsa，检测式）。**
 *
 * 历史：0.5.6 曾把所有第三方底座（MuMu / 雷电 / 蓝叠 / WSA / FydeOS）整条删除，
 * 理由是「顺手接管」事故 —— 用户机器上装了什么就被驱动什么，数据、存档、镜像
 * 全都不在自己以为的地方。docs/backend-roadmap.md:15,87-91 据此把 WSA 记为「❌ 不可行」。
 *
 * **本 fork 推翻了其中针对 WSA 的裁决**（docs/zapkstart/wsa-backend.md，含反转理由）：
 * Windows ARM64 上 Google 不发布模拟器二进制，x64 引擎在 Windows 模拟下对真实应用
 * 不可用，而 WSA 是该平台上唯一产品化的原生 ARM64 安卓（freeform 窗口 + adb 端点），
 * 且有活跃的社区续作。检测式 + 只经 adb 驱动，让上游当年的合规顾虑可控。
 *
 * 反抢保证**保留但收窄**（不再是无条件删代码）：
 *   1. mode 只能由用户在设置里显式选（settings 引擎分段控件 id 是 setEngineBackend）；
 *   2. create() 只在包探测确认已安装时才放行 wsa，否则回落 builtin 并记日志 ——
 *      「settings.json 里写了 wsa」不等于「会被采用」（保守放行）；
 *   3. autoPick() 永远返回 builtin，绝不做任何探测 —— 「装了就用」正是 0.5.6 要除掉的行为；
 *   4. store.js 用精确匹配白名单压 mode：mumu / fydeos / attach / 手改乱填一律 builtin。
 *
 * 仍然整条禁止的：任何形式的「探测第三方模拟器 → 接管」（MuMu / 雷电 / 蓝叠 / FydeOS）。
 * WSA 不是模拟器接管 —— 它是我们自己算出的端点（127.0.0.1:5855）上的一台设备，
 * 且只有用户点名才会被连接。
 */

const { Backend, CAPS } = require('./base');
const { BuiltinBackend } = require('./builtin');
const { WsaBackend } = require('./wsa');
const arch = require('../arch');
const { t } = require('../i18n');

const REGISTRY = [
  BuiltinBackend,
  WsaBackend,
];

/** 默认底座。autoPick 永远落在这里；「以后真要加底座」的显式落点保留。 */
const ONLY = 'builtin';

function byId(id) {
  return REGISTRY.find((B) => B.id === id) || null;
}

/** 给界面用的描述清单（只留静态信息，能安全序列化） */
function describe() {
  return REGISTRY.map((B) => ({
    id: B.id,
    label: B.label,
    summary: B.summary,
    embedCapable: B.embedCapable,
  }));
}

/**
 * 按设置创建一个底座实例（保守放行）。
 *
 * 放行规则：
 *   - mode === 'wsa' 且探测缓存确认已安装（arch.wsaEngineNow() === 'available'，
 *     或测试显式传 wsaAvailable）→ WsaBackend；
 *   - 其它一切情况（mode 是 mumu/fydeos/attach/乱填、wsa 但没装/没探测过）→ BuiltinBackend，
 *     wsa 落空时记一条日志说明原因。
 *
 * 注意探测读的是**缓存**（绝不在这里拉 PowerShell）：真正的探测发生在
 * arch.detectWsa()（Runtime 初始化 / prewarm / 设置页会触发），没探测过 = 'unknown'
 * = 不放行。宁可让用户再点一次，也不在启动路径上偷偷扫系统包数据库。
 *
 * @param {object} o { appRoot, settings, runtime, store, log, id, wsaAvailable, backendDeps }
 * @returns {{ backend: Backend, Cls: Function, id: string }}
 */
function create({ appRoot, runtime, store: storeDeps, log, id: forced, wsaAvailable, settings, backendDeps } = {}) {
  const mode = String((settings && settings.engine && settings.engine.mode) || ONLY);
  let id = ONLY;
  if (forced && byId(forced)) {
    // 显式传了注册表里的 id（旧代码回退路径）：尊重，但第三方 id 依然不在注册表里
    id = forced;
  } else if (mode === 'wsa') {
    const available = typeof wsaAvailable === 'boolean'
      ? wsaAvailable
      : arch.wsaEngineNow() === 'available';
    if (available) id = 'wsa';
    else if (typeof log === 'function') log(t('wsa.fallback_builtin'));
  }
  const Cls = byId(id) || BuiltinBackend;
  const backend = new Cls(appRoot, { runtime, store: storeDeps, log, ...(backendDeps || {}) });
  return { backend, Cls, id: Cls.id };
}

/**
 * 自动挑选底座。永远返回 builtin，不做任何探测：
 * 探测本身就会去碰系统包数据库 / 第三方模拟器的目录，那正是 0.5.6 要除掉的行为。
 * WSA 只能由用户显式选择，永远不会「因为装了就被选上」。
 */
async function autoPick() {
  return { id: ONLY, reason: 'builtin-only' };
}

module.exports = {
  REGISTRY, ONLY, CAPS, byId, describe, create, autoPick, Backend,
};
