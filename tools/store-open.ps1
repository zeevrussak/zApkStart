# ApkStart 商店上架 · 一键打开所需窗口
# 用法：右键 → 使用 PowerShell 运行
# 作用：把上架需要的 4 个东西一次摆到桌面上，省去翻目录

$ErrorActionPreference = 'Continue'
$root = 'D:\apkstart-dsh\apkstart'
# 版本号从 package.json 现取，别在脚本里写死 —— 每次抬版本都改这里迟早会改漏。
# MSIX 的版本是四段式（0.5.2 → 0.5.2.0），和 build/msix.js 的规则保持一致。
$ver = '0.0.0.0'
try {
    # 必须显式 -Encoding UTF8：Windows PowerShell 5.1 的默认编码是 ANSI，
    # 而 package.json 里有中文 description，按 ANSI 读会得到乱码 → ConvertFrom-Json 直接抛错。
    $pkg = Get-Content (Join-Path $root 'package.json') -Raw -Encoding UTF8 | ConvertFrom-Json
    $ver = ('{0}.0' -f $pkg.version)
} catch {
    Write-Host '  [!] 读不到 package.json 的 version，退回按 0.5.3.0 找包' -ForegroundColor Yellow
    $ver = '0.5.3.0'
}
$msix = Join-Path $root ('dist\store\ApkStart_{0}_x64.msix' -f $ver)
$guide = Join-Path $root 'docs\store-upload-walkthrough.md'
$listing = Join-Path $root 'docs\store-listing.md'

Write-Host ''
Write-Host '  ApkStart 上架助手' -ForegroundColor Green
Write-Host '  ─────────────────────────────' -ForegroundColor DarkGray

if (-not (Test-Path $msix)) {
    Write-Host "  [!] 找不到安装包：$msix" -ForegroundColor Red
    Write-Host '      先跑 node build/msix.js 重新打包。' -ForegroundColor DarkGray
} else {
    $mb = [math]::Round((Get-Item $msix).Length / 1MB, 1)
    Write-Host "  [1] 安装包  $mb MB" -ForegroundColor Cyan
    Write-Host '      已选中在资源管理器里，上传时直接拖进去' -ForegroundColor DarkGray
    Start-Process explorer.exe "/select,`"$msix`""
}

Write-Host '  [2] Partner Center（浏览器打开，需你登录）' -ForegroundColor Cyan
Start-Process 'https://partner.microsoft.com/dashboard/apps-and-games'

if (Test-Path $guide) {
    Write-Host '  [3] 上架操作单（照抄版）' -ForegroundColor Cyan
    Start-Process $guide
}

if (Test-Path $listing) {
    Write-Host '  [4] listing 文案（长描述 / 功能点 / 审核备注）' -ForegroundColor Cyan
    Start-Process $listing
}

Write-Host ''
Write-Host '  顺序：新建产品 → 上传包 → 粘 listing → 提交' -ForegroundColor Yellow
Write-Host '  隐私政策：https://github.com/RoutineMiku/apkstart/blob/main/docs/privacy.md' -ForegroundColor DarkGray
Write-Host ''
