'use strict';
// drivers / zh-CN — src/core/drivers.js 的用户可见文案（原文抽取，契约见 src/core/i18n.js）
module.exports = {
  // FORBIDDEN_ARGS（值为本表键名；报错时经 args_forbidden 模板插值）
  forbid_wipe_data: '会清空用户已装应用与存档',
  forbid_datadir: '会改 AVD 落点，破坏多实例隔离',
  forbid_sysdir: '会改系统镜像来源',
  forbid_partition_size: '会改数据分区大小，请走设置页',
  forbid_avd: 'AVD 名由 zApkStart 管理',
  forbid_port: '端口由 zApkStart 动态分配',
  forbid_http_proxy: '代理请走系统设置',

  // validateArgs()
  args_forbidden: 'emulatorArgs 不允许 {flag}：{why}',
  err_flag_only: 'emulatorArgs 不支持单独的参数 {flag}（带值的请写成 {flag}=值）',
  err_arg_unknown: 'emulatorArgs 不支持 {flag}',
  err_arg_value: 'emulatorArgs 的 {flag} 取值不合法：{value}',
  err_args_array: 'effect.emulatorArgs 必须是字符串数组',

  // validateMatch()
  err_match_obj: 'match 必须是对象',
  err_match_key: 'match.{key} 不是支持的匹配条件',
  err_gpu_name: 'match.gpuName 不是合法正则（且长度需 ≤200）',
  err_numeric_field: 'match.{key} 必须是数字或 {min,max}',
  err_range_field: 'match.{key}.{keys} 必须是数字',

  // validateIni()
  err_ini_obj: 'effect.configIni 必须是对象',
  err_ini_key: 'configIni 不支持 {key}（会破坏数据分区 / 落点的键一律拒绝）',
  err_ini_value: 'configIni 的 {key} 取值不合法：{value}',

  // validateEnv()
  err_env_obj: 'effect.env 必须是对象',
  err_env_key: 'env 不允许设置 {key}（只放行 ANDROID_/QEMU_/LIBGL_/MESA_/EMUGL_ 前缀）',
  err_env_value: 'env.{key} 的取值不合法（长度 ≤200，且不能含换行）',

  // validateDriver()
  err_not_json: '{where}驱动必须是 JSON 对象',
  err_format: '{where}format 必须是 "{format}"（当前 {current}）',
  err_id: '{where}id 必须由字母数字和 . _ - 组成，3~64 个字符（例如 amd-igpu-swangle）',
  err_name: '{where}name 必填，且不超过 80 字',
  err_version: '{where}version 必须形如 1.0.0',
  err_priority: '{where}priority 必须是 -100 ~ 100 的数字',
  err_match_empty: '{where}match 不能是空对象；如果要匹配所有机器请写 {"any": true}',
  err_effect_obj: '{where}effect 必须是对象',
  err_effect_key: '{where}effect.{key} 不是支持的字段',
  err_gpu_mode: '{where}effect.gpuMode 取值不合法：{value}',
  err_force_tcg: '{where}effect.forceTcg 必须是 true/false',
  err_notes_array: '{where}effect.notes 必须是字符串数组',

  // loadDir() / importDriver()
  err_file_too_big: '文件过大（{size} 字节，上限 {max}）',
  err_file_unreadable: '读不出来：{msg}',
  err_import_too_big: '文件过大，驱动最多 256 KB',
  err_write_failed: '写入失败：{msg}',

  // templateFromHost()
  template_name_default: '我的机器',
  template_name_suffix: '{name} 兼容补丁',
  template_description: '由 zApkStart「导出本机模板」生成：match 已经按这台机器填好，按需修改 effect 即可。',
  template_note_example: '示例：把 gpuMode 改成 host / software 或打开 forceTcg 试试',
};
