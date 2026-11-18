import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { AWS_SERVICES, createTileFactory } from './hero-scene/awsTiles';
import { LIDAR_LOCAL, buildLimo } from './hero-scene/limo';
import { SCAN_OBJECTS, sampleObject } from './hero-scene/scanObjects';
import { TAU, mulberry32, radialTexture, roundedRect } from './hero-scene/shapes';

/**
 * HERO SCENE — "Edge to Cloud"
 *
 * A LIMO Pro scans its surroundings with a spinning LiDAR. When the sweep
 * passes over an object, a data packet rises into an AWS pipeline
 * (API Gateway → Lambda → Bedrock → SQS → Lambda → DynamoDB + S3) and the
 * result falls back down as a YOLO-style detection box.
 *
 * Loaded client-side only via next/dynamic from pages/index.js.
 */

const EDGE_Y = -1.1;
const CLOUD_Y = 1.2;
const LIDAR_RADIUS = 2.3;
const SWEEP_SPEED = TAU / 3.2; // one revolution every 3.2s
const SECTOR = 0.7; // radians of the fading sweep wedge
const PACKET_POOL = 3;
const MIN_LAUNCH_GAP = 1.1; // seconds between packets
const TILE = 0.42;
const ROBOT_YAW = 0.55;
const ROBOT_SCALE = 1.5;
const OBJECT_SCALE = 1.35;

const THEMES = {
  dark: {
    base: '#4f46e5',
    hot: '#93c5fd',
    aws: '#ff9900',
    result: '#34d399',
    grid: '#334155',
    link: '#94a3b8',
    group: '#64748b',
    sectorOpacity: 0.22,
    shadowOpacity: 0.6,
    tintOpacity: 0.05,
    additive: true,
  },
  light: {
    base: '#a5b4fc',
    hot: '#2563eb',
    aws: '#ea7c00',
    result: '#059669',
    grid: '#cbd5e1',
    link: '#64748b',
    group: '#94a3b8',
    sectorOpacity: 0.14,
    shadowOpacity: 0.28,
    tintOpacity: 0.035,
    additive: false,
  },
};

// Pipeline layout. `service` picks the tile look from AWS_SERVICES.
const NODES = {
  apigw: { service: 'apigw', pos: [-1.9, CLOUD_Y, 0.1] },
  lambdaA: { service: 'lambda', pos: [-1.0, CLOUD_Y, 0.3] },
  bedrock: { service: 'bedrock', pos: [-0.38, CLOUD_Y + 0.72, -0.1] },
  sqs: { service: 'sqs', pos: [0.3, CLOUD_Y, 0.3] },
  lambdaB: { service: 'lambda', pos: [1.1, CLOUD_Y, 0.25] },
  ddb: { service: 'ddb', pos: [1.9, CLOUD_Y + 0.62, -0.1] },
  s3: { service: 's3', pos: [1.9, CLOUD_Y - 0.62, 0.05] },
};
const LINKS = [
  ['apigw', 'lambdaA'],
  ['lambdaA', 'bedrock'],
  ['bedrock', 'sqs'],
  ['sqs', 'lambdaB'],
  ['lambdaB', 'ddb'],
  ['lambdaB', 's3'],
];
const CLOUD_BOX = { x: 2.38, bottom: CLOUD_Y - 1.02, top: CLOUD_Y + 1.2, z: -0.45 };

const LABELS = [
  { id: 'cloud', text: 'AWS Cloud', kind: 'cloud' },
  { id: 'edge', text: 'Edge · LiDAR + ROS2', kind: 'edge' },
  ...Object.entries(NODES).map(([id, n]) => ({
    id,
    text: AWS_SERVICES[n.service].label,
    kind: 'node',
  })),
  ...SCAN_OBJECTS.map((o, i) => ({ id: `det${i}`, text: o.tag, kind: 'detect' })),
];

const POINTS_VERTEX = /* glsl */ `
  attribute float aAngle;
  attribute float aCluster;
  attribute float aFade;
  attribute float aRand;
  uniform float uSweep;
  uniform float uTime;
  uniform float uScale;
  uniform float uSize;
  uniform float uGlow[${SCAN_OBJECTS.length}];
  varying float vHot;
  varying float vGlow;
  varying float vFade;
  varying float vFloor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float behind = mod(uSweep - aAngle, 6.2831853);
    float trail = exp(-behind * 1.8);
    int ci = int(aCluster + 0.5) - 1;
    float glow = 0.0;
    for (int i = 0; i < ${SCAN_OBJECTS.length}; i++) {
      if (i == ci) glow = uGlow[i];
    }
    vHot = trail;
    vGlow = glow;
    vFloor = ci >= 0 ? 0.7 : 0.42;
    vFade = aFade * (0.85 + 0.15 * sin(uTime * 2.0 + aRand * 6.2831853));
    float size = uSize * (ci >= 0 ? 1.05 : 1.0) * (1.0 + trail * 0.7 + glow * 0.5);
    gl_PointSize = size * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const POINTS_FRAGMENT = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uHot;
  uniform vec3 uResult;
  varying float vHot;
  varying float vGlow;
  varying float vFade;
  varying float vFloor;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.15, r);
    vec3 color = mix(mix(uBase, uHot, max(vHot, vFloor > 0.5 ? 0.4 : 0.0)), uResult, vGlow);
    float alpha = soft * vFade * clamp(vFloor + (1.0 - vFloor) * vHot + vGlow, 0.0, 1.0);
    gl_FragColor = vec4(color, alpha);
  }
`;

const SECTOR_VERTEX = /* glsl */ `
  varying vec2 vPos;
  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SECTOR_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vPos;
  void main() {
    float a = atan(vPos.y, vPos.x);
    float r = length(vPos) / ${LIDAR_RADIUS.toFixed(2)};
    float alpha = smoothstep(0.0, ${SECTOR.toFixed(2)}, a) * (1.0 - r * 0.7) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

function wrapAngle(a) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

function smooth(u) {
  return u * u * (3 - 2 * u);
}

function easeInOutCubic(u) {
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
}

function labelClass(kind, darkMode) {
  switch (kind) {
    case 'cloud':
      return `font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`;
    case 'edge':
      return `font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`;
    case 'detect':
      return `rounded-sm px-1 py-0.5 text-white ${
        darkMode ? 'bg-emerald-500/90' : 'bg-emerald-600'
      }`;
    default:
      return darkMode ? 'text-slate-300' : 'text-slate-600';
  }
}

export default function HeroScene({
  mouseX = 0.5,
  mouseY = 0.5,
  darkMode = false,
  label,
  fallback = null,
}) {
  const containerRef = useRef(null);
  const labelRefs = useRef({});
  const inputRef = useRef({ mouseX, mouseY, darkMode });
  const applyThemeRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    inputRef.current.mouseX = mouseX;
    inputRef.current.mouseY = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    inputRef.current.darkMode = darkMode;
    applyThemeRef.current?.(darkMode);
  }, [darkMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch {
      setFailed(true);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;display:block;';
    container.prepend(canvas);

    const reduceMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    const compact = container.clientWidth < 400;
    const rng = mulberry32(20260214);
    const V3 = THREE.Vector3;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
    const target = new V3(0, 0.5, 0);
    const disposables = [];

    // Lighting: soft studio environment + key and cool rim light.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();
    disposables.push(envMap);
    scene.environment = envMap;
    scene.environmentIntensity = 0.85;
    const keyLight = new THREE.DirectionalLight('#ffffff', 1.5);
    keyLight.position.set(3, 5, 6);
    const rimLight = new THREE.DirectionalLight('#93c5fd', 0.9);
    rimLight.position.set(-4, 2.5, -5);
    scene.add(keyLight, rimLight, new THREE.HemisphereLight('#e0e7ff', '#1e1b4b', 0.45));

    const theme = {
      base: new THREE.Color(),
      hot: new THREE.Color(),
      aws: new THREE.Color(),
      result: new THREE.Color(),
      grid: new THREE.Color(),
      link: new THREE.Color(),
      group: new THREE.Color(),
    };
    const mats = { link: [], result: [], sprites: [] };
    const track = (list, material) => {
      list.push(material);
      return material;
    };

    // ---------------------------------------------------------------- EDGE
    // The LiDAR sensor sits at world (0, *, 0); everything scans around it.
    const limo = buildLimo();
    disposables.push(limo);
    const lidarOffset = LIDAR_LOCAL.clone().multiplyScalar(ROBOT_SCALE);
    limo.robot.scale.setScalar(ROBOT_SCALE);
    limo.robot.rotation.y = ROBOT_YAW;
    limo.robot.position.set(
      -lidarOffset.z * Math.sin(ROBOT_YAW),
      EDGE_Y,
      -lidarOffset.z * Math.cos(ROBOT_YAW)
    );
    scene.add(limo.robot);

    const density = compact ? 0.55 : 1;
    const objects = SCAN_OBJECTS.map((def) => sampleObject(def, EDGE_Y, density, rng, OBJECT_SCALE));

    const positions = [];
    const angles = [];
    const clusterIds = [];
    const fades = [];
    const rands = [];
    const addPoint = (x, y, z, clusterId) => {
      positions.push(x, y, z);
      angles.push(Math.atan2(-z, x));
      clusterIds.push(clusterId);
      const r = Math.hypot(x, z) / LIDAR_RADIUS;
      const fade = Math.max(0.15, 1 - Math.pow(r, 3) * 0.8);
      fades.push(clusterId > 0 ? Math.max(0.9, fade) : fade);
      rands.push(rng());
    };

    // Concentric LiDAR rings, with "shadows" behind objects.
    const ringCount = compact ? 10 : 14;
    const ringDensity = compact ? 42 : 68;
    for (let i = 0; i < ringCount; i += 1) {
      const radius = 0.7 + (i * (LIDAR_RADIUS - 0.7)) / (ringCount - 1);
      const count = Math.round(radius * ringDensity);
      for (let j = 0; j < count; j += 1) {
        const a = (j / count) * TAU + rng() * 0.02;
        const occluded = objects.some(
          (o) => radius > o.dist && Math.abs(wrapAngle(a - o.angle)) < o.halfAngle
        );
        if (occluded) continue;
        const r = radius + (rng() - 0.5) * 0.03;
        const y = EDGE_Y + Math.sin(a * 3 + radius * 2) * 0.02 + (rng() - 0.5) * 0.012;
        addPoint(Math.cos(a) * r, y, -Math.sin(a) * r, 0);
      }
    }
    objects.forEach((o, i) => {
      for (let k = 0; k < o.points.length; k += 3) {
        addPoint(o.points[k], o.points[k + 1], o.points[k + 2], i + 1);
      }
    });

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    pointsGeo.setAttribute('aAngle', new THREE.Float32BufferAttribute(angles, 1));
    pointsGeo.setAttribute('aCluster', new THREE.Float32BufferAttribute(clusterIds, 1));
    pointsGeo.setAttribute('aFade', new THREE.Float32BufferAttribute(fades, 1));
    pointsGeo.setAttribute('aRand', new THREE.Float32BufferAttribute(rands, 1));

    const clusterGlow = new Array(objects.length).fill(0);
    const pointsMat = new THREE.ShaderMaterial({
      vertexShader: POINTS_VERTEX,
      fragmentShader: POINTS_FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uSweep: { value: 0 },
        uTime: { value: 0 },
        uScale: { value: 400 },
        uSize: { value: 0.03 },
        uGlow: { value: clusterGlow },
        uBase: { value: theme.base },
        uHot: { value: theme.hot },
        uResult: { value: theme.result },
      },
    });
    scene.add(new THREE.Points(pointsGeo, pointsMat));

    const grid = new THREE.PolarGridHelper(LIDAR_RADIUS, 8, 6, 64);
    grid.material.vertexColors = false;
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    grid.material.depthWrite = false;
    grid.material.needsUpdate = true;
    grid.position.y = EDGE_Y - 0.004;
    scene.add(grid);

    // Rotating sweep wedge + leading beam, from the sensor.
    const sweepGroup = new THREE.Group();
    sweepGroup.position.y = EDGE_Y + 0.006;
    const sectorMat = new THREE.ShaderMaterial({
      vertexShader: SECTOR_VERTEX,
      fragmentShader: SECTOR_FRAGMENT,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: { uColor: { value: theme.hot }, uOpacity: { value: 0.2 } },
    });
    const sector = new THREE.Mesh(new THREE.CircleGeometry(LIDAR_RADIUS, 48, 0, SECTOR), sectorMat);
    sector.rotation.x = -Math.PI / 2;
    sweepGroup.add(sector);
    const beamMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.75 });
    sweepGroup.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new V3(0, lidarOffset.y - 0.006, 0),
          new V3(Math.cos(SECTOR) * LIDAR_RADIUS, 0, -Math.sin(SECTOR) * LIDAR_RADIUS),
        ]),
        beamMat
      )
    );
    scene.add(sweepGroup);

    // Detection boxes, oriented with each object.
    const bboxes = objects.map((o) => {
      const boxGeo = new THREE.BoxGeometry(o.size.x + 0.08, o.size.y + 0.08, o.size.z + 0.08);
      const lines = new THREE.LineSegments(
        new THREE.EdgesGeometry(boxGeo),
        track(
          mats.result,
          new THREE.LineBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        )
      );
      boxGeo.dispose();
      lines.position.copy(o.center);
      lines.rotation.y = o.yaw;
      scene.add(lines);
      return lines;
    });

    // --------------------------------------------------------------- CLOUD
    const tiles = createTileFactory(TILE);
    disposables.push(tiles);
    const P = {};
    const nodes = {};
    Object.entries(NODES).forEach(([key, def], i) => {
      P[key] = new V3(...def.pos);
      const { pivot, material } = tiles.make(def.service);
      const group = new THREE.Group();
      group.position.copy(P[key]);
      group.add(pivot);
      scene.add(group);
      nodes[key] = { group, pivot, material, pulse: 0, spin: 1, phase: i * 0.9 };
    });

    // Arrows between services.
    const linkMat = track(mats.link, new THREE.LineBasicMaterial({ transparent: true, opacity: 0.85 }));
    const headMat = track(mats.link, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85 }));
    const headGeo = new THREE.ConeGeometry(0.03, 0.08, 14);
    const up = new V3(0, 1, 0);
    LINKS.forEach(([from, to]) => {
      const a = P[from];
      const b = P[to];
      const dir = b.clone().sub(a).normalize();
      const start = a.clone().addScaledVector(dir, TILE * 0.68);
      const end = b.clone().addScaledVector(dir, -TILE * 0.72);
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([start, end]), linkMat));
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.copy(end).addScaledVector(dir, 0.03);
      head.quaternion.setFromUnitVectors(up, dir);
      scene.add(head);
    });

    // "AWS Cloud" group box with its badge, like an architecture diagram.
    const { x: bx, bottom, top, z: bz } = CLOUD_BOX;
    const boxShape = roundedRect(bx * 2, top - bottom, 0.08);
    const groupMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.7 });
    const outline = boxShape.getPoints(8).map((p) => new V3(p.x, p.y + (top + bottom) / 2, bz));
    outline.push(outline[0].clone());
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(outline), groupMat));
    const tintMat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false });
    const tint = new THREE.Mesh(new THREE.ShapeGeometry(boxShape), tintMat);
    tint.position.set(0, (top + bottom) / 2, bz - 0.01);
    scene.add(tint);
    const badge = tiles.make('cloud');
    badge.pivot.scale.setScalar(0.2 / TILE);
    badge.pivot.position.set(-bx + 0.14, top - 0.14, bz + 0.02);
    scene.add(badge.pivot);

    // ------------------------------------------------------------- PACKETS
    const glowTexture = radialTexture([
      [0, 'rgba(255,255,255,1)'],
      [0.25, 'rgba(255,255,255,0.85)'],
      [0.6, 'rgba(255,255,255,0.18)'],
      [1, 'rgba(255,255,255,0)'],
    ]);
    disposables.push(glowTexture);
    const makeSprite = (scale) => {
      const material = track(
        mats.sprites,
        new THREE.SpriteMaterial({ map: glowTexture, transparent: true, depthWrite: false })
      );
      const sprite = new THREE.Sprite(material);
      sprite.scale.setScalar(scale);
      sprite.visible = false;
      scene.add(sprite);
      return sprite;
    };

    const CLOUD_SEGMENTS = [
      { a: P.apigw, b: P.lambdaA, d: 0.4, node: 'lambdaA' },
      { a: P.lambdaA, b: P.bedrock, d: 0.45, node: 'bedrock' },
      { a: P.bedrock, b: P.sqs, d: 0.45, node: 'sqs' },
      { a: P.sqs, b: P.lambdaB, d: 0.45, node: 'lambdaB', fork: true },
      { a: P.lambdaB, b: P.ddb, d: 0.4, node: 'ddb' },
    ];
    const FORK = { a: P.lambdaB, b: P.s3, d: 0.45 };

    const paths = objects.map((o) => {
      const segs = [
        { a: o.top, b: P.apigw, d: 1.15, ctrl: new V3(o.top.x, 0.5, o.top.z), phase: 'rise', node: 'apigw' },
        ...CLOUD_SEGMENTS,
        { a: P.ddb, b: o.top, d: 1.15, ctrl: new V3(o.top.x, 0.3, o.top.z), phase: 'fall', node: null },
      ];
      let t = 0;
      const timed = segs.map((s) => {
        const seg = { ...s, start: t, end: t + s.d };
        t += s.d;
        return seg;
      });
      return { segs: timed, total: t };
    });

    const tmpColor = new THREE.Color();
    const evalSegment = (seg, u, out) => {
      if (seg.ctrl) {
        const e = easeInOutCubic(u);
        const i = 1 - e;
        out
          .copy(seg.a)
          .multiplyScalar(i * i)
          .addScaledVector(seg.ctrl, 2 * i * e)
          .addScaledVector(seg.b, e * e);
      } else {
        out.lerpVectors(seg.a, seg.b, smooth(u));
      }
    };
    const evalPath = (path, t, outPos, outColor) => {
      const { segs } = path;
      let seg = segs[segs.length - 1];
      for (let i = 0; i < segs.length; i += 1) {
        if (t < segs[i].end) {
          seg = segs[i];
          break;
        }
      }
      const u = Math.min(1, Math.max(0, (t - seg.start) / seg.d));
      evalSegment(seg, u, outPos);
      if (seg.phase === 'rise') outColor.lerpColors(theme.hot, theme.aws, smooth(u));
      else if (seg.phase === 'fall') outColor.copy(theme.result);
      else outColor.copy(theme.aws);
    };

    const TRAIL_OPACITY = [0.55, 0.35, 0.2];
    const packets = Array.from({ length: PACKET_POOL }, () => ({
      active: false,
      t: 0,
      ci: 0,
      seg: -1,
      head: makeSprite(0.24),
      trail: [makeSprite(0.17), makeSprite(0.12), makeSprite(0.085)],
      fork: makeSprite(0.17),
      forkT: -1,
    }));
    const hidePacket = (p) => {
      p.head.visible = false;
      p.trail.forEach((s) => {
        s.visible = false;
      });
    };

    const pulse = (key) => {
      const n = nodes[key];
      if (!n) return;
      n.pulse = 1;
      if (NODES[key].service === 'lambda') n.spin = 0;
    };

    // ---------------------------------------------------------- LABELS
    const below = (key) => ({
      pos: P[key].clone().add(new V3(0, -(TILE / 2 + 0.07), 0)),
      align: 'center',
      v: 'below',
    });
    const above = (key) => ({
      pos: P[key].clone().add(new V3(0, TILE / 2 + 0.07, 0)),
      align: 'center',
      v: 'above',
    });
    const labelAnchors = {
      cloud: { pos: new V3(-bx + 0.3, top - 0.14, bz), align: 'left', v: 'middle' },
      edge: { pos: new V3(0, EDGE_Y - 0.05, LIDAR_RADIUS + 0.05), align: 'center', v: 'below' },
      apigw: above('apigw'),
      lambdaA: below('lambdaA'),
      bedrock: below('bedrock'),
      sqs: below('sqs'),
      lambdaB: below('lambdaB'),
      ddb: above('ddb'),
      s3: below('s3'),
    };
    objects.forEach((o, i) => {
      labelAnchors[`det${i}`] = {
        pos: o.center.clone().add(new V3(0, o.size.y / 2 + 0.07, 0)),
        align: 'center',
        v: 'above',
        glow: i,
      };
    });

    const size = { w: 1, h: 1 };
    const labelSize = {};
    const projected = new V3();
    const updateLabels = () => {
      LABELS.forEach(({ id }) => {
        const el = labelRefs.current[id];
        const anchor = labelAnchors[id];
        if (!el || !anchor) return;
        if (!labelSize[id]) labelSize[id] = { w: el.offsetWidth, h: el.offsetHeight };
        const { w: lw, h: lh } = labelSize[id];
        projected.copy(anchor.pos).project(camera);
        const x = (projected.x * 0.5 + 0.5) * size.w;
        const y = (-projected.y * 0.5 + 0.5) * size.h;
        let left = anchor.align === 'left' ? x : x - lw / 2;
        let topPx = y;
        if (anchor.v === 'above') topPx = y - lh;
        else if (anchor.v === 'middle') topPx = y - lh / 2;
        left = Math.min(Math.max(left, 2), size.w - lw - 2);
        topPx = Math.min(Math.max(topPx, 2), size.h - lh - 2);
        el.style.transform = `translate3d(${left.toFixed(1)}px, ${topPx.toFixed(1)}px, 0)`;
        const opacity =
          anchor.glow === undefined ? 1 : Math.min(1, clusterGlow[anchor.glow] * 1.4);
        el.style.opacity = opacity.toFixed(2);
      });
    };

    // ---------------------------------------------------------- CAMERA
    const cam = { az: 0, el: 0.2 };
    let fit = 1;
    const BASE_DIST = 7.1;
    const updateCamera = (dt, time) => {
      const { mouseX: mx, mouseY: my } = inputRef.current;
      const idle = reduceMotion ? 0 : Math.sin(time * 0.18) * 0.12;
      const targetAz = (mx - 0.5) * 0.7 + idle;
      const targetEl = 0.2 + (0.5 - my) * 0.3;
      const k = 1 - Math.exp(-dt * 3);
      cam.az += (targetAz - cam.az) * k;
      cam.el += (targetEl - cam.el) * k;
      const d = BASE_DIST * fit;
      camera.position.set(
        target.x + d * Math.sin(cam.az) * Math.cos(cam.el),
        target.y + d * Math.sin(cam.el),
        target.z + d * Math.cos(cam.az) * Math.cos(cam.el)
      );
      camera.lookAt(target);
    };

    // ---------------------------------------------------------- SIMULATION
    let elapsed = 0;
    let sweep = 0;
    let lastLaunch = -Infinity;
    const packetPos = new V3();

    const step = (dt) => {
      elapsed += dt;
      const prevSweep = sweep;
      sweep += dt * SWEEP_SPEED;
      const sweepAngle = sweep % TAU;
      sweepGroup.rotation.y = sweepAngle - SECTOR;
      limo.spinner.rotation.y = sweepAngle - ROBOT_YAW;
      pointsMat.uniforms.uSweep.value = sweepAngle;
      pointsMat.uniforms.uTime.value = elapsed;

      // Launch a packet when the sweep passes over an object.
      objects.forEach((o, ci) => {
        const crossed =
          Math.floor((sweep - o.angle) / TAU) > Math.floor((prevSweep - o.angle) / TAU);
        if (!crossed || elapsed - lastLaunch < MIN_LAUNCH_GAP) return;
        if (packets.some((p) => p.active && p.ci === ci)) return;
        const free = packets.find((p) => !p.active);
        if (!free) return;
        Object.assign(free, { active: true, t: 0, ci, seg: -1 });
        lastLaunch = elapsed;
      });

      packets.forEach((p) => {
        if (p.active) {
          const path = paths[p.ci];
          p.t += dt;
          while (p.seg + 1 < path.segs.length && p.t >= path.segs[p.seg + 1].end) {
            p.seg += 1;
            const seg = path.segs[p.seg];
            if (seg.node) pulse(seg.node);
            if (seg.fork) p.forkT = 0;
          }
          if (p.t >= path.total) {
            p.active = false;
            clusterGlow[p.ci] = 1;
            hidePacket(p);
          } else {
            evalPath(path, p.t, packetPos, tmpColor);
            p.head.visible = true;
            p.head.position.copy(packetPos);
            p.head.material.color.copy(tmpColor);
            p.trail.forEach((sprite, k) => {
              const tt = p.t - 0.045 * (k + 1);
              if (tt < 0) {
                sprite.visible = false;
                return;
              }
              evalPath(path, tt, sprite.position, sprite.material.color);
              sprite.material.opacity = TRAIL_OPACITY[k];
              sprite.visible = true;
            });
          }
        }
        if (p.forkT >= 0) {
          p.forkT += dt;
          if (p.forkT >= FORK.d) {
            p.forkT = -1;
            p.fork.visible = false;
            pulse('s3');
          } else {
            evalSegment(FORK, p.forkT / FORK.d, p.fork.position);
            p.fork.material.color.copy(theme.aws);
            p.fork.visible = true;
          }
        }
      });

      // Service tiles: idle float, pulse on each invocation, Lambda flips.
      Object.entries(nodes).forEach(([key, n]) => {
        n.pulse = Math.max(0, n.pulse - dt * 2);
        n.group.position.y = P[key].y + Math.sin(elapsed * 1.1 + n.phase) * 0.025;
        n.pivot.scale.setScalar(1 + 0.16 * n.pulse);
        n.material.emissiveIntensity = 0.55 * n.pulse;
        if (n.spin < 1) {
          n.spin = Math.min(1, n.spin + dt * 1.8);
          n.pivot.rotation.y = easeInOutCubic(n.spin) * TAU;
        }
      });

      clusterGlow.forEach((g, i) => {
        const next = Math.max(0, g - dt * 0.55);
        clusterGlow[i] = next;
        bboxes[i].material.opacity = Math.min(1, next * 1.3);
        bboxes[i].scale.setScalar(1 + 0.18 * Math.pow(next, 8));
      });

      updateCamera(dt, elapsed);
    };

    const renderFrame = () => {
      updateLabels();
      renderer.render(scene, camera);
    };

    // ---------------------------------------------------------- THEME
    let running = false;
    const applyTheme = (dark) => {
      const p = dark ? THEMES.dark : THEMES.light;
      Object.keys(theme).forEach((key) => theme[key].set(p[key]));
      const blending = p.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
      pointsMat.blending = blending;
      sectorMat.uniforms.uOpacity.value = p.sectorOpacity;
      beamMat.color.copy(theme.hot);
      limo.lidarGlow.color.copy(theme.hot);
      limo.shadowMaterial.opacity = p.shadowOpacity;
      grid.material.color.copy(theme.grid);
      groupMat.color.copy(theme.group);
      tintMat.color.copy(theme.group);
      tintMat.opacity = p.tintOpacity;
      mats.link.forEach((m) => m.color.copy(theme.link));
      mats.result.forEach((m) => m.color.copy(theme.result));
      mats.sprites.forEach((m) => {
        m.blending = blending;
      });
      if (!running) renderFrame();
    };

    // ---------------------------------------------------------- LIFECYCLE
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      size.w = w;
      size.h = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Pull back on narrow boxes: labels keep their pixel size while the scene shrinks.
      fit = Math.max(1, 1.05 / camera.aspect, 420 / w);
      camera.updateProjectionMatrix();
      pointsMat.uniforms.uScale.value =
        (h * renderer.getPixelRatio() * 0.5) /
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      Object.keys(labelSize).forEach((k) => delete labelSize[k]);
      if (!running) {
        updateCamera(1, elapsed);
        renderFrame();
      }
    };

    let rafId = 0;
    let last = 0;
    const tick = (now) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      step(dt);
      renderFrame();
    };
    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      last = performance.now();
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    resize();
    applyTheme(inputRef.current.darkMode);
    applyThemeRef.current = applyTheme;

    if (reduceMotion) {
      // Pre-simulate so the still frame shows the pipeline mid-flight.
      for (let i = 0; i < 400; i += 1) step(1 / 60);
      renderFrame();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let intersectionObserver = null;
    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      });
      intersectionObserver.observe(container);
    } else {
      start();
    }

    return () => {
      stop();
      applyThemeRef.current = null;
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      scene.traverse((obj) => {
        obj.geometry?.dispose();
        const material = obj.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  if (failed) return fallback;

  return (
    <div
      ref={containerRef}
      role='img'
      aria-label={label}
      className='relative h-80 w-full max-w-[440px] select-none md:h-[400px]'
    >
      {LABELS.map((l) => (
        <span
          key={l.id}
          ref={(el) => {
            labelRefs.current[l.id] = el;
          }}
          aria-hidden='true'
          className={`pointer-events-none absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] leading-none tracking-wide ${labelClass(
            l.kind,
            darkMode
          )}`}
          style={{ opacity: 0 }}
        >
          {l.text}
        </span>
      ))}
    </div>
  );
}
