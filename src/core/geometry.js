'use strict';
/**
 * 纯几何换算（零依赖，可在无 Electron 的 CI/Node 环境直接 require 测试）。
 *
 * Electron 的 screen / BrowserWindow 坐标一律是 DIP（设备无关像素）；而窗口代理
 * agent.ps1 顶层声明了 per-monitor v2 DPI 感知，它调用的 Win32 SetWindowPos 收到
 * 的是物理像素。二者混用，在 125% / 150% 缩放下就是「窗口只显示一半 / 偏到角落 /
 * 点击错位」（issue #99）。嵌入模式的 _rect() 早已乘过 scaleFactor，这里把同一
 * 个换算抽出来，供独立窗口模式复用并单独测试。
 */

/**
 * 把一块 DIP 矩形换算成物理像素。
 * @param {{x:number,y:number,w:number,h:number}} rect DIP 逻辑像素矩形
 * @param {number} [scaleFactor] 缩放比；1 / 缺省时原样返回（同一对象，零开销）
 * @returns {{x:number,y:number,w:number,h:number}} 物理像素矩形
 */
function physicalRect(rect, scaleFactor) {
  const k = Number(scaleFactor) || 1;
  if (!rect || k === 1) return rect;
  return {
    x: Math.round(rect.x * k),
    y: Math.round(rect.y * k),
    w: Math.round(rect.w * k),
    h: Math.round(rect.h * k),
  };
}

module.exports = { physicalRect };
