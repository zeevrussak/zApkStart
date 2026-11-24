# ApkStart v0.5.3

这一版全部围绕**图标**：让每个安卓应用在桌面/任务栏上真的显示它自己的图标。

## 一、安卓应用的快捷方式恢复用「应用自己的图标」

上一版整理图标时，把所有 ApkStart 相关快捷方式的图标统一写成了 ApkStart 的品牌图标，
于是红果、墨读的桌面快捷方式都变成了绿色播放键。

现在用 App 自己的 `shortcut.writeShortcut()` 重写（和「设置 → 重建快捷方式」同一条代码路径）：

| 快捷方式 | 图标 |
|---|---|
| 红果免费短剧（桌面 + 开始菜单） | `%APPDATA%\apkstart\icons\com.phoenix.read.ico` |
| 墨读（桌面 + 开始菜单） | `%APPDATA%\apkstart\icons\cn.moread.app.ico` |
| ApkStart / Demo（运行器本身） | 品牌图标 |

> 产品代码本来就用的是 `app.icoPath`，这是环境被改坏的修复 + 补了一层任务栏身份。

## 二、任务栏身份按应用切换

Windows 只有在「运行进程的 AUMID == 快捷方式的 AUMID」时，才会把正在运行的窗口和
任务栏固定项合并、并沿用快捷方式的图标。每个应用的快捷方式写的是
`RoutineMiku.ApkStart.<包名>`，而进程级身份原本是 `RoutineMiku.ApkStart` —— 对不上就会
出现「固定项是应用图标，任务栏上却另起一个 ApkStart 按钮」。

现在：打开某个应用前把进程身份切成该应用的 AUMID，回到管理窗口再切回 ApkStart 的。

## 三、运行器 exe 的品牌化（0.5.2 起）

`ApkStart.exe` 以前就是改名的 `electron.exe`：FileDescription=Electron、
CompanyName=GitHub, Inc.、版本 33.4.11，图标也是 Electron 的。现在打包时会写入

```
FileDescription  ApkStart 安卓应用运行器
ProductName      ApkStart
CompanyName      RoutineMiku
FileVersion      0.5.3.0
ProductVersion   0.5.3
```

并嵌入 `appicon.ico`（16→256 共 9 帧）。

---

## 从 0.5.2 升级说明

- `0.5.3.0 > 0.5.2.0`，商店可以直接覆盖升级。
- 已经装过 0.5.1 / 0.5.2 的用户：更新后**不需要重装安卓应用**，但建议在
  「设置 → 重建快捷方式」点一次，把旧快捷方式的图标刷成应用自己的
  （0.5.2 装的应用快捷方式本身是对的，只有被手工改坏的那几个需要重建）。

## 微软商店

- 包体：`dist/store/ApkStart_0.5.3.0_x64.msix`（x64，约 850 MB，内置完整运行时）
- 身份：`RoutineMiku.ApkStart` / `CN=58CA1DED-8AB3-4D0D-AF50-62C9B781AA4D`
- 提交材料：`docs/store-listing.md`（含本版 What's new 中英文段）
- 步骤：`docs/store-upload-walkthrough.md`

测试：9 + 25 + 121 = 155 通过。
