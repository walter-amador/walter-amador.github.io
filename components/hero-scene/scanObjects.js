import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { poly } from './shapes';

/**
 * Objects the LiDAR "sees". Each is modeled as real geometry and then
 * surface-sampled into points, so the point clouds read as what they are.
 * Local frame: ground at y=0; cars drive along +x; signs and people face +z.
 * `angle` uses the atan2(-z, x) convention around the sensor.
 */
export const SCAN_OBJECTS = [
  { kind: 'car', tag: 'car 0.94', angle: 0.25, dist: 1.65, points: 650 },
  { kind: 'stop', tag: 'stop sign 0.97', angle: 1.0, dist: 1.55, points: 300 },
  { kind: 'person', tag: 'person 0.91', angle: 2.45, dist: 1.55, points: 380 },
  { kind: 'light', tag: 'traffic light 0.92', angle: 3.05, dist: 1.7, points: 320 },
  { kind: 'cone', tag: 'cone 0.86', angle: 5.0, dist: 1.2, points: 200 },
];

function parts(kind) {
  switch (kind) {
    case 'car': {
      const body = new THREE.ExtrudeGeometry(
        poly([
          [-0.33, 0.06],
          [0.33, 0.06],
          [0.335, 0.13],
          [0.3, 0.16],
          [0.15, 0.18],
          [0.06, 0.265],
          [-0.13, 0.265],
          [-0.23, 0.185],
          [-0.32, 0.17],
          [-0.335, 0.14],
        ]),
        { depth: 0.28, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 2 }
      ).translate(0, 0, -0.14);
      const wheels = [-0.2, 0.2].flatMap((x) =>
        [-0.16, 0.16].map((z) =>
          new THREE.CylinderGeometry(0.065, 0.065, 0.05, 18).rotateX(Math.PI / 2).translate(x, 0.065, z)
        )
      );
      return [body, ...wheels];
    }
    case 'person':
      return [
        new THREE.CylinderGeometry(0.024, 0.02, 0.22, 10).translate(-0.032, 0.11, 0),
        new THREE.CylinderGeometry(0.024, 0.02, 0.22, 10).translate(0.032, 0.11, 0),
        new THREE.CapsuleGeometry(0.055, 0.12, 4, 12).translate(0, 0.31, 0),
        new THREE.CylinderGeometry(0.017, 0.014, 0.19, 8).rotateZ(0.14).translate(-0.082, 0.29, 0),
        new THREE.CylinderGeometry(0.017, 0.014, 0.19, 8).rotateZ(-0.14).translate(0.082, 0.29, 0),
        new THREE.SphereGeometry(0.045, 14, 10).translate(0, 0.465, 0),
      ];
    case 'stop':
      return [
        new THREE.CylinderGeometry(0.011, 0.011, 0.4, 8).translate(0, 0.2, 0),
        new THREE.CylinderGeometry(0.11, 0.11, 0.014, 8)
          .rotateX(Math.PI / 2)
          .rotateZ(Math.PI / 8)
          .translate(0, 0.48, 0.014),
      ];
    case 'light':
      return [
        new THREE.CylinderGeometry(0.013, 0.013, 0.42, 8).translate(0, 0.21, 0),
        new THREE.BoxGeometry(0.08, 0.21, 0.065).translate(0, 0.525, 0),
        ...[-1, 0, 1].map((i) =>
          new THREE.CylinderGeometry(0.023, 0.023, 0.02, 14)
            .rotateX(Math.PI / 2)
            .translate(0, 0.525 + i * 0.064, 0.04)
        ),
      ];
    case 'cone':
    default:
      return [
        new THREE.ConeGeometry(0.065, 0.21, 22, 1, true).translate(0, 0.115, 0),
        new THREE.BoxGeometry(0.16, 0.016, 0.16).translate(0, 0.008, 0),
      ];
  }
}

/**
 * Returns the sampled points (world space) and the oriented bounding box
 * for one object.
 */
export function sampleObject(def, groundY, density, rng, scale = 1) {
  const x = Math.cos(def.angle) * def.dist;
  const z = -Math.sin(def.angle) * def.dist;
  // Everything is turned to show its most recognizable side to the viewer:
  // cars in profile, signs and people facing the camera.
  const yaw = def.yaw ?? 0;

  const pieces = parts(def.kind).map((g) => {
    const flat = g.index ? g.toNonIndexed() : g;
    if (flat !== g) g.dispose();
    return flat;
  });
  const merged = mergeGeometries(pieces, false);
  merged.scale(scale, scale, scale);
  pieces.forEach((g) => g.dispose());
  merged.computeBoundingBox();
  const localBox = merged.boundingBox.clone();

  const mesh = new THREE.Mesh(merged);
  const sampler = new MeshSurfaceSampler(mesh).setRandomGenerator(rng).build();
  const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  const origin = new THREE.Vector3(x, groundY, z);
  const p = new THREE.Vector3();
  const points = [];
  const count = Math.round(def.points * density);
  for (let i = 0; i < count; i += 1) {
    sampler.sample(p);
    p.x += (rng() - 0.5) * 0.006;
    p.y += (rng() - 0.5) * 0.006;
    p.z += (rng() - 0.5) * 0.006;
    p.applyQuaternion(rotation).add(origin);
    points.push(p.x, p.y, p.z);
  }
  merged.dispose();

  const size = localBox.getSize(new THREE.Vector3());
  const center = localBox.getCenter(new THREE.Vector3()).applyQuaternion(rotation).add(origin);
  return {
    ...def,
    yaw,
    size,
    center,
    top: center.clone().add(new THREE.Vector3(0, size.y / 2 + 0.06, 0)),
    halfAngle: Math.atan2(Math.hypot(size.x, size.z) * 0.42, def.dist),
    points,
  };
}
