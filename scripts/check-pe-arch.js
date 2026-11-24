'use strict';
/**
 * PE 头架构门：验证一个 Windows 可执行文件真的是期望的架构。
 *
 * 为什么存在：ARM64 产物由 x64 runner 交叉编译，如果哪天 Electron dist 拉错
 * 架构，整条构建链不会报错——只有用户在 ARM64 机器上跑不起来时才发现。
 * 这个脚本读 PE 头的 Machine 字段，不匹配就非零退出，release.yml 的 arm64
 * 作业拿它当发布闸门。
 *
 * 用法：node scripts/check-pe-arch.js <exe路径> [--expect arm64|x64|any]
 *   Machine 值：0x8664 = x64, 0xAA64 = ARM64, 0x014C = x86, 0x01C4 = ARM。
 * 纯 Node，零依赖（CI runner 不需要装 VS Build Tools / dumpbin）。
 */
const fs = require('fs');

function readPeMachine(file) {
  const fd = fs.openSync(file, 'r');
  try {
    // DOS header: e_lfanew 在 0x3C（4 字节 LE）；文件头两个字节是 'MZ'（0x4D 0x5A）
    const head = Buffer.alloc(0x40);
    if (fs.readSync(fd, head, 0, 0x40, 0) < 0x40) throw new Error('文件太小，不是 PE');
    if (head[0] !== 0x4d || head[1] !== 0x5a) throw new Error('缺少 MZ 签名，不是 PE 文件');
    const e_lfanew = head.readUInt32LE(0x3c);
    const peSig = Buffer.alloc(4);
    if (fs.readSync(fd, peSig, 0, 4, e_lfanew) < 4) throw new Error('读不到 PE 签名');
    if (peSig.readUInt32BE(0) !== 0x50450000) throw new Error('PE\\0\\0 签名不匹配');
    // COFF header 紧跟签名：Machine 是前 2 字节
    const coff = Buffer.alloc(2);
    fs.readSync(fd, coff, 0, 2, e_lfanew + 4);
    return coff.readUInt16LE(0);
  } finally {
    fs.closeSync(fd);
  }
}

const NAMES = { 0x8664: 'x64', 0xaa64: 'arm64', 0x014c: 'x86', 0x01c4: 'arm', 0x0200: 'ia64' };

function main() {
  const args = process.argv.slice(2);
  const file = args[0];
  const expectIdx = args.indexOf('--expect');
  const expect = expectIdx > 0 ? String(args[expectIdx + 1] || 'any').toLowerCase() : 'any';
  if (!file) {
    console.error('用法：node scripts/check-pe-arch.js <exe> [--expect arm64|x64|any]');
    process.exit(2);
  }
  let machine;
  try {
    machine = readPeMachine(file);
  } catch (e) {
    console.error(`[check-pe-arch] ${file}: ${e.message}`);
    process.exit(2);
  }
  const name = NAMES[machine] || `0x${machine.toString(16)}`;
  console.log(`[check-pe-arch] ${file}: Machine=${name}`);
  if (expect !== 'any' && name !== expect) {
    console.error(`[check-pe-arch] 期望 ${expect}，实际 ${name} —— 不通过`);
    process.exit(1);
  }
  process.exit(0);
}

if (require.main === module) main();
module.exports = { readPeMachine };
