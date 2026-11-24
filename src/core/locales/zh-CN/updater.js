'use strict';
// updater / zh-CN — src/core/updater.js 的用户可见文案（原文抽取，契约见 src/core/i18n.js）
module.exports = {
  no_installable_asset: '这个版本没有可自动安装的安装包，请到 GitHub 发布页手动下载',
  incremental_fallback: '增量更新不可用（{reason}），改用完整包…',
  downloading: '正在下载 {name}…',
  downloading_progress: '下载中 {info}{speed}',
  downloading_part: '下载中 {info}（第 {part}/{total_parts} 片）{speed}',
  reusing_payload: '已有下载好的更新包，直接复用',
  extract_done: '更新包已解压完成',
  setup_downloaded: '安装包已下载完成',
  fetching_manifest: '正在获取更新清单…',
  fetching_app_pack: '正在获取增量代码包…',
  manifest_version_mismatch: '清单版本与发行版不一致',
  app_pack_hash_mismatch: '增量代码包校验失败（sha256 不符）',
  reusing_app_payload: '已有下载好的增量包，直接复用',
  app_pack_verify_failed: '增量代码包有 {count} 个文件校验不通过',
  app_pack_verified: '增量包已校验完成',
  part_size_mismatch: '分片 {part} 大小不对（{got} ≠ {expected}），已中止，可重试',
  assembled_size_mismatch: '更新包拼装后大小不对（{got} ≠ {expected}），已中止，可重试',
  extracting: '正在解压 {index}/{total}',
};
