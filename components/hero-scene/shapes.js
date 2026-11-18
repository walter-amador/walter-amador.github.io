import * as THREE from 'three';

export const TAU = Math.PI * 2;

export function poly(points) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
  shape.closePath();
  return shape;
}

export function rect(x, y, w, h) {
  return poly([
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ]);
}

export function circle(cx, cy, r) {
  const shape = new THREE.Shape();
  shape.absarc(cx, cy, r, 0, TAU, false);
  return shape;
}

/** A straight bar of width `w` between two points. */
export function bar(x1, y1, x2, y2, w) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * (w / 2);
  const ny = (dx / len) * (w / 2);
  return poly([
    [x1 + nx, y1 + ny],
    [x2 + nx, y2 + ny],
    [x2 - nx, y2 - ny],
    [x1 - nx, y1 - ny],
  ]);
}

export function roundedRect(w, h, r) {
  const x = w / 2;
  const y = h / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-x + r, -y);
  shape.lineTo(x - r, -y);
  shape.absarc(x - r, -y + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(x, y - r);
  shape.absarc(x - r, y - r, r, 0, Math.PI / 2, false);
  shape.lineTo(-x + r, y);
  shape.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(-x, -y + r);
  shape.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

export function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function radialTexture(stops) {
  return canvasTexture(64, 64, (ctx) => {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    stops.forEach(([at, color]) => g.addColorStop(at, color));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  });
}
