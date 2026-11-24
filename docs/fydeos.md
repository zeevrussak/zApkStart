# ApkStart 的 FydeOS 底座（Windows 上也能用）

> 一句话：**用 FydeOS 自带的安卓环境替代 Google 模拟器**。
> FydeOS 可以装在本机，也可以跑在 VMware / VirtualBox 里、由 Windows 上的 ApkStart 连过去。

---

## ⚠️ 先看这段：FydeOS 路线的真实风险

我把这条路的可行性查证清楚了，结论不乐观，**你应该先知道再决定要不要投入**：

1. **官方的 VMware 镜像是 preview**。下载页原文写的是「专为用户在虚拟化环境中
   **测试和预览** FydeOS 而设计」（[FydeOS for VMware](https://fydeos.com/download/vm/x86_64/)）。
2. **VMware 版里安卓子系统经常不能用**。FydeOS 社区里明确的说法是
   「VMware 版本仅作为预览使用，暂时不保证功能的完全可用性」；有用户实测反馈
   安卓应用无法联网、`adb` 能连上但画面是黑屏。
   （[社区讨论](https://community.fydeos.com/t/topic/47865)）
3. **有人说旧版本（v18）反而能正常工作**，新版本坏掉。也就是说这条路依赖特定版本，
   很可能哪天就不能用了。

**结论**：FydeOS 底座我做了、能用，但**它不该被当成主力方案**。
如果你只是想要「比 Google 模拟器更轻、窗口不再出问题」——
那 v0.5.0 修好的联网 + **独立窗口模式**已经解决了，不需要换底座。

---

## 两种用法

### 用法 A：ApkStart 和 FydeOS 在同一台机器（FydeOS 装在本机）

前提：你装的是 FydeOS 系统本身（不是 Windows）。

1. FydeOS 应用启动器 → 打开「安卓设置」
2. 系统 → 开发者选项 → 打开 **ADB 调试**
   （找不到开发者选项：安卓设置 → 关于设备 → 连点「版本号」7 次）
3. FydeOS 设置 → Linux → 开启 Linux 子系统
4. Linux 终端里：`sudo apt update && sudo apt install -y adb`
5. ApkStart → 设置 → 运行时 → 引擎模式选 **FydeOS 安卓子系统**，地址**留空**
   （自动依次试 `arc:5555`、`100.115.92.2:5555`、`127.0.0.1:5555`）

### 用法 B：ApkStart 在 Windows，FydeOS 跑在虚拟机里

这是你想要的形态。完整步骤：

#### 1. 装一个虚拟机软件

- **VMware Workstation Player**（免费）—— 官方 FydeOS VM 镜像就是 `.ova`，导入即可
- **VirtualBox** —— 也行，但 `.ova` 导入后可能要手动调 UEFI

> 注意：**不要用 Hyper-V**。ApkStart 的自带运行时靠 AEHD 加速，AEHD 和 Hyper-V 互斥，
> 开了 Hyper-V 自带运行时就用不了了。用 VMware / VirtualBox 没有这个问题。

#### 2. 导入 FydeOS 镜像

从 [FydeOS for VMware 下载页](https://fydeos.com/download/vm/x86_64/) 拿 `.ova`
（约 1.5GB+），VMware 里「打开虚拟机」→ 选那个 `.ova`。
如果提示「未通过 OVF 规格一致性检测」，按提示点**重试**放宽校验，仍可正常导入。

建议给虚拟机 **4GB 以上内存**（安卓子系统吃内存）。

#### 3. 在 FydeOS 里开启 ADB 调试

1. 启动虚拟机，走完 FydeOS 初始化（登录/本地账户）
2. 打开安卓设置，启用安卓子系统
3. 安卓设置 → 系统 → 开发者选项 → 打开 **ADB 调试**

#### 4. 让 Windows 能连到那台虚拟机

两条路，选一条：

**路 1（推荐，最省事）：NAT 端口转发**

VMware：虚拟机设置 → 网络适配器 → 选 NAT → 「NAT 设置」→ 端口转发 → 添加：

| 主机端口 | 类型 | 虚拟机 IP | 虚拟机端口 |
|---|---|---|---|
| 5555 | TCP | （留空或 192.168.x.x） | 5555 |

VirtualBox：设置 → 网络 → 高级 → 端口转发 → 加一条 `127.0.0.1:5555 → 10.0.2.15:5555`

然后 ApkStart 里地址填：`127.0.0.1:5555`

**路 2：直接用虚拟机 IP**

虚拟机网络改成「桥接」，在 FydeOS 里 `crosh`（Ctrl+Alt+T）→ `shell` → `ip addr` 看 IP，
然后 ApkStart 里填 `<那个IP>:5555`。

#### 5. 配 ApkStart

1. 设置 → 运行时 → 引擎模式选 **FydeOS 安卓子系统**
2. 地址填上一步的（例如 `127.0.0.1:5555`）
3. 点检测

**第一次连接时，FydeOS 里会弹出「允许调试吗」的授权框 —— 一定要点「允许」**，
否则 APK 装不进去。

---

## 它和自带运行时的区别

| | 自带运行时（QEMU） | FydeOS 底座 |
|---|---|---|
| 安卓从哪来 | ApkStart 自己下载镜像、自己开机 | FydeOS 系统提供，已在运行 |
| 关机后启动 | 需开机（v0.5.0 约 18 秒） | 几乎瞬时（虚拟机本来就开着） |
| 额外内存 | 约 3GB | 取决于虚拟机分配 |
| 镜像占用 | 几 GB | 无（FydeOS 自己的磁盘） |
| 窗口嵌入 | ✅ 可嵌进 ApkStart 窗口 | ❌ 画面由 FydeOS 自己显示 |
| 一个应用一个窗口 | ✅ | ❌ 所有应用共用 FydeOS 桌面 |
| 稳定性 | 高（实测过） | **取决于 FydeOS 版本，见开头警告** |

**关于「一个应用一个窗口」**：这是 ApkStart 最有价值的那部分体验，FydeOS 底座给不了。
原因是安卓画面在 FydeOS 桌面里（或在那台虚拟机的窗口里），不是某个安卓应用的
独立窗口，没有可以 `SetParent` 的 HWND。

所以 FydeOS 底座下，ApkStart 的角色变成：**应用清单 + 装包 + 启动 + 图标/快捷方式管理**，
画面由 FydeOS 自己显示。

---

## 常见问题

### 提示「请先填 FydeOS 的地址」

Windows 上没有「本机安卓」，ApkStart 无从猜测那台虚拟机在哪。按上面第 4 步配端口转发或填 IP。

### 一直 unauthorized，授权框也不弹

FydeOS X 某些版本的已知问题（宿主机和 Linux 子系统的 adb key 不一致）。手工同步 key：

```bash
# 1. FydeOS 的 Linux 终端里
adb start-server
cat ~/.android/adbkey.pub      # 复制内容

# 2. Crosh（Ctrl+Alt+T）→ shell 进入宿主机
sudo mount -o remount,rw /
sudo mkdir -p /opt/google/containers/android/rootfs/android-data/data/misc/adb
sudo tee /opt/google/containers/android/rootfs/android-data/data/misc/adb/adb_keys <<'EOF'
<把上面 adbkey.pub 的内容粘这里>
EOF
sudo chown 1000:1000 /opt/google/containers/android/rootfs/android-data/data/misc/adb/adb_keys
sudo mount -o remount,ro /
```

然后重启安卓子系统再连。

### 连上了但应用装进去打不开

如果是 `INSTALL_FAILED_NO_MATCHING_ABIS`，说明这个 APK 只有 arm64 版本，而 FydeOS
在 x86 上跑。FydeOS 有内置的 ARM 兼容层，但覆盖不全 —— 这种应用换自带运行时
（它带 Google 的 ARM 转译）更容易成功。

### 应用界面黑屏

这是 FydeOS VMware 版的老问题（见开头警告）。先确认 FydeOS 自带的安卓应用能不能正常打开；
如果系统自己的应用都黑屏，那不是 ApkStart 的问题，换 FydeOS 版本（有人反馈 v18 可用）或改用自带运行时。

---

## 技术细节（给维护者）

- 后端实现在 `src/core/backends/fydeos.js`
- 能力位刻意声明得很克制：不 `provision`（不装镜像）、不 `snapshot`（没有自己的快照）、
  不 `rotatePanel`（面板由系统管）。只有 `shutdown`，而且它只是断开 adb 连接，
  不会真去关系统里的安卓 —— 那会影响用户其它应用。
- `embedCapable = false`。上层（`main.js` 的 `attachAppWindow`）看到这个标记就跳过
  画面接管，不会兜一圈 `SetParent` 失败再刷一堆 `attach failed`。
- Windows 上用 ApkStart 自带的 adb（`runtime/platform-tools/adb.exe`），
  不要求用户自己装 platform-tools。
