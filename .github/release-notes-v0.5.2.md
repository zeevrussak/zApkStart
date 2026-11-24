# ApkStart v0.5.2

这一版只修一件事：**微软商店版装好后提示「未启用硬件加速」**。

## 为什么商店用户一定会碰到

安卓模拟器在 Windows 上只有两条加速路：

| 方式 | 是什么 | 需要管理员 | 需要重启 |
|---|---|---|---|
| **AEHD** | Google 自家内核驱动 | 装驱动时 | 不用 |
| **WHPX** | Windows 自带功能「虚拟机监控程序平台」 | 开功能时 | 要 |

微软商店（MSIX）包由 AppX 部署模型拉起，固定 mediumIL：**既不能装内核驱动，也拿不到管理员授权**。
所以商店版只剩 WHPX 一条路，而「Windows 虚拟机监控程序平台」在全新的 Windows 上是**默认关闭**的
——于是装完就提示没有硬件加速，只能跑纯软件模拟（开机几分钟）。

## 旧版错在哪

1. 点「修复」走的是 `Start-Process -Verb RunAs` 提权 —— 打包应用拿不到，注定失败，
   提示就永远消不掉。
2. 提示文案写「建议安装 AEHD 驱动或开启虚拟机平台」——商店版装不了驱动，等于指了条死路。
3. 只提「虚拟机平台（VirtualMachinePlatform）」，而那是 **WSL2** 要用的功能；
   模拟器要的是 **「虚拟机监控程序平台（HypervisorPlatform）」**。只开前者，`emulator -accel-check` 依然说不可用。
4. 用 `WinHvPlatform.dll` 是否存在来判断「要不要走 WHPX 分支」——这个 DLL 在现代 Windows 上一直都在
   （实测本机存在，但跑的是 AEHD），判断完全失真。
5. 开启成功后没有清加速缓存，界面还会显示旧结论。

## 现在怎么做

- **商店版**：点「修复」→ 不再弹你注定拿不到的管理员授权，而是**直接打开「启用或关闭 Windows 功能」对话框**
  （`optionalfeatures.exe`，只有它里面才有那一项），并明确告诉你勾「Windows 虚拟机监控程序平台」，完成后重启一次。
- **安装版 / 便携版**：仍然是一键开启（UAC）→ 失败自动改装 AEHD 驱动；用户点了「否」会明确说「你取消了授权」，
  而不是笼统的「未能开启」。
- 两个功能一次都开（先 HypervisorPlatform，再 VirtualMachinePlatform），开启后清掉加速缓存。
- 以软件模拟运行时，**第一次打开应用会弹一次系统通知**：说明加速能快 5~10 倍、在哪开。
  （设置里的自检项藏得深，正在等开机的人根本看不到。）

## 商店版用户自己开（两条等价的路）

图形界面：`Win+R` → 输入 `optionalfeatures` → 勾选 **Windows 虚拟机监控程序平台** → 确定 → 重启。

管理员 PowerShell：

```powershell
dism /online /enable-feature /featurename:HypervisorPlatform /all /norestart
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

## 顺带

- `docs/store-listing.md` 的 Notes for certification 里加了这一段说明，避免审核员看到那条提示就判「无法使用」。
- README 增加了「提示未启用硬件加速怎么办」一节（含上面两条命令）。

---

## 微软商店

- 包体：`dist/store/ApkStart_0.5.2.0_x64.msix`（x64，约 850 MB，内置完整运行时）
- 身份：`RoutineMiku.ApkStart` / `CN=58CA1DED-8AB3-4D0D-AF50-62C9B781AA4D`
- 升级：`0.5.2.0 > 0.5.1.0 > 0.5.0.0`，可直接覆盖之前提交的版本

测试：9 + 25 + 118 = 152 通过。
