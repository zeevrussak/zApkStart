# ApkStart 隐私政策 / Privacy Policy

最后更新：2026-11-16

## 简体中文

ApkStart 是一个在本机运行的 Android 应用运行器。我们的原则很简单：**不收集、不上传、不分享你的个人数据。**

### 1. 我们不收集什么

- 不收集账号、姓名、邮箱、手机号等身份信息（本应用没有账号系统）。
- 不收集设备标识符、广告 ID、位置信息。
- 不集成任何统计、埋点、崩溃上报或广告 SDK。
- 不向我们的服务器发送任何数据（本应用没有自有服务器）。

### 2. 本机保存的数据

以下数据只保存在你自己的电脑上，不会离开设备：

| 位置 | 内容 |
|---|---|
| `%USERPROFILE%\ApkStart\data` | 安卓系统镜像、已安装应用、应用数据、快照 |
| `%USERPROFILE%\ApkStartShared` | 与安卓 `/sdcard/ApkStartShared` 双向同步的共享文件夹 |

卸载 Microsoft Store 版本不会自动删除上述目录；你可以随时手动删除。

### 3. 联网行为

- **Microsoft Store 版**：安装包已内置全部运行时，首次启动只做本地解压，不下载任何可执行内容；应用更新由 Microsoft Store 负责。
- **安装包 / 便携版**：仅在「检查更新」时访问 GitHub / Gitee 的 Release 列表；轻量版首次启动会从项目 Release 下载运行时压缩包。请求只包含版本号与下载所需的标准 HTTP 头。
- 安卓应用自身的网络访问由该应用决定，走 QEMU 用户态 NAT 复用主机网络，ApkStart 不做内容审查或转发留存。

### 4. 第三方

你通过 ApkStart 运行的安卓应用由各自的开发者提供，其数据处理行为适用各自的隐私政策。ApkStart 不控制也不代表这些第三方应用。

### 5. 儿童

本应用不面向 13 岁以下儿童，也不会有意收集儿童信息。

### 6. 变更与联系

政策如有变更，会更新本页面并修改「最后更新」日期。
问题请提交 issue 到 https://github.com/RoutineMiku/apkstart/issues

---

## English

ApkStart is a locally-running Android app runner. Our principle is simple: **we do not collect, upload, or share your personal data.**

- No account system, no identity data, no device identifiers, no advertising ID, no location.
- No analytics, telemetry, crash-reporting, or advertising SDKs.
- No data is sent to any server operated by us — we do not operate one.

Local data (never leaves your device):

| Path | Content |
|---|---|
| `%USERPROFILE%\ApkStart\data` | Android system image, installed apps, app data, snapshots |
| `%USERPROFILE%\ApkStartShared` | Shared folder synced with `/sdcard/ApkStartShared` inside Android |

Network behaviour:
- **Microsoft Store build**: all runtime components are bundled; first launch only extracts locally. Updates are delivered by Microsoft Store.
- **Installer / portable build**: GitHub and Gitee Release endpoints are contacted only when you check for updates; the lightweight build downloads the runtime package on first launch. Requests contain only the version and standard HTTP headers.
- Network access from Android apps is decided by those apps. Traffic uses QEMU user-mode NAT over the host network; ApkStart does not inspect or retain it.

Third-party apps you run are provided by their own developers and governed by their own privacy policies.

Contact: open an issue at https://github.com/RoutineMiku/apkstart/issues
