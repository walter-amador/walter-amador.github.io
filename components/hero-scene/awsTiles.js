import * as THREE from 'three';
import { TAU, bar, circle, poly, rect, roundedRect } from './shapes';

/**
 * 3D service tiles in the style of AWS architecture icons: a beveled rounded
 * square with the service-category gradient and a raised white glyph.
 * The glyphs are simplified drawings, not the official icon artwork.
 * Glyph coordinates live in [-1, 1] with y up.
 */

function dbSlab(top, bottom, convexTop) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.75, top);
  shape.absellipse(0, top, 0.75, 0.25, Math.PI, 0, convexTop);
  shape.lineTo(0.75, bottom);
  shape.absellipse(0, bottom, 0.75, 0.25, 0, Math.PI, true);
  shape.closePath();
  return shape;
}

const GLYPHS = {
  lambda: () => [
    poly([
      [-0.833, 1],
      [-0.25, 1],
      [0.833, -1],
      [0.375, -1],
      [-0.02, -0.25],
      [-0.417, -1],
      [-0.875, -1],
      [-0.25, 0.167],
      [-0.5, 0.583],
      [-0.833, 0.583],
    ]),
  ],
  api: () => [
    poly([
      [-0.417, 0.583],
      [-0.229, 0.396],
      [-0.625, 0],
      [-0.229, -0.396],
      [-0.417, -0.583],
      [-1, 0],
    ]),
    poly([
      [0.417, 0.583],
      [1, 0],
      [0.417, -0.583],
      [0.229, -0.396],
      [0.625, 0],
      [0.229, 0.396],
    ]),
    poly([
      [0.167, 0.75],
      [0.375, 0.75],
      [-0.167, -0.75],
      [-0.375, -0.75],
    ]),
  ],
  sqs: () => [
    rect(-0.86, -0.22, 0.36, 0.44),
    rect(-0.4, -0.22, 0.36, 0.44),
    rect(0.06, -0.22, 0.36, 0.44),
    poly([
      [0.52, 0.36],
      [0.98, 0],
      [0.52, -0.36],
    ]),
    rect(-0.86, 0.36, 1.28, 0.1),
    rect(-0.86, -0.46, 1.28, 0.1),
  ],
  ddb: () => [dbSlab(0.57, 0.27, true), dbSlab(0.15, -0.15, false), dbSlab(-0.27, -0.57, false)],
  s3: () => {
    const bucket = new THREE.Shape();
    bucket.moveTo(-0.85, 0.5);
    bucket.absellipse(0, 0.5, 0.85, 0.28, Math.PI, 0, true);
    bucket.lineTo(0.6, -0.68);
    bucket.absellipse(0, -0.68, 0.6, 0.2, 0, Math.PI, true);
    bucket.closePath();
    const opening = new THREE.Path();
    opening.absellipse(0, 0.5, 0.68, 0.15, 0, TAU, false);
    bucket.holes.push(opening);
    return [bucket];
  },
  bedrock: () => {
    const hub = [0, 0];
    const outer = [
      [-0.66, 0.56],
      [0.66, 0.56],
      [-0.66, -0.56],
      [0.66, -0.56],
    ];
    return [
      circle(hub[0], hub[1], 0.24),
      ...outer.map(([x, y]) => circle(x, y, 0.17)),
      ...outer.map(([x, y]) => bar(hub[0], hub[1], x, y, 0.1)),
      bar(-0.66, 0.56, -0.66, -0.56, 0.08),
      bar(0.66, 0.56, 0.66, -0.56, 0.08),
      bar(-0.66, 0.56, 0.66, 0.56, 0.08),
    ];
  },
  cloud: () => [
    rect(-0.66, -0.46, 1.38, 0.36),
    circle(-0.4, -0.12, 0.33),
    circle(0.08, 0.1, 0.45),
    circle(0.5, -0.12, 0.3),
  ],
};

// AWS category gradients (dark → light), applied bottom-left to top-right.
export const AWS_SERVICES = {
  apigw: { label: 'API Gateway', glyph: 'api', colors: ['#4D27A8', '#A166FF'] },
  lambda: { label: 'Lambda', glyph: 'lambda', colors: ['#C8511B', '#FF9900'] },
  bedrock: { label: 'Bedrock', glyph: 'bedrock', colors: ['#055F4E', '#56C0A7'] },
  sqs: { label: 'SQS', glyph: 'sqs', colors: ['#B0084D', '#FF4F8B'] },
  ddb: { label: 'DynamoDB', glyph: 'ddb', colors: ['#2E27AD', '#527FFF'] },
  s3: { label: 'S3', glyph: 's3', colors: ['#1B660F', '#6CAE3E'] },
  cloud: { label: 'AWS Cloud', glyph: 'cloud', colors: ['#232F3E', '#41566F'] },
};

export function createTileFactory(size) {
  const base = new THREE.ExtrudeGeometry(roundedRect(size, size, size * 0.18), {
    depth: size * 0.16,
    bevelEnabled: true,
    bevelThickness: size * 0.055,
    bevelSize: size * 0.05,
    bevelSegments: 4,
    curveSegments: 6,
  });
  base.center();
  base.computeBoundingBox();
  const front = base.boundingBox.max.z;
  const glyphMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.35,
    emissive: '#ffffff',
    emissiveIntensity: 0.2,
  });
  const glyphCache = {};
  const geometries = [base];

  const make = (serviceKey) => {
    const service = AWS_SERVICES[serviceKey];
    const geometry = base.clone();
    geometries.push(geometry);
    const position = geometry.attributes.position;
    const colors = new Float32Array(position.count * 3);
    const dark = new THREE.Color(service.colors[0]);
    const light = new THREE.Color(service.colors[1]);
    const c = new THREE.Color();
    for (let i = 0; i < position.count; i += 1) {
      const t = THREE.MathUtils.clamp((position.getX(i) + position.getY(i)) / (size * 2) + 0.5, 0, 1);
      c.lerpColors(dark, light, t);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.32,
      metalness: 0.1,
      emissive: light,
      emissiveIntensity: 0,
    });

    if (!glyphCache[service.glyph]) {
      const g = new THREE.ExtrudeGeometry(GLYPHS[service.glyph](), {
        depth: size * 0.04,
        bevelEnabled: true,
        bevelThickness: size * 0.012,
        bevelSize: size * 0.008,
        bevelSegments: 2,
        curveSegments: 18,
      });
      const scale = size * 0.33;
      g.scale(scale, scale, 1);
      g.translate(0, 0, front - size * 0.012);
      glyphCache[service.glyph] = g;
      geometries.push(g);
    }

    const pivot = new THREE.Group();
    pivot.add(new THREE.Mesh(geometry, material));
    pivot.add(new THREE.Mesh(glyphCache[service.glyph], glyphMaterial));
    return { pivot, material };
  };

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    glyphMaterial.dispose();
  };

  return { make, dispose };
}
