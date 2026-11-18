import * as THREE from 'three';
import { TAU, canvasTexture, poly } from './shapes';

/**
 * Stylized AgileX LIMO Pro (~0.53 units long, +z is forward, y=0 is ground):
 * four chunky treaded wheels, white chassis with the black front plate,
 * green status light and red e-stop, a front LiDAR bay, smoked "face" with
 * two eyes, a depth camera on top, side panels, a tilted rear screen on an
 * A-frame and two antennas.
 */

export const LIDAR_LOCAL = new THREE.Vector3(0, 0.208, 0.232);

function sideExtrude(points, width) {
  // Draw a profile in (z, y) and extrude it across x, centered.
  return new THREE.ExtrudeGeometry(poly(points), {
    depth: width,
    bevelEnabled: false,
  })
    .rotateY(-Math.PI / 2)
    .translate(width / 2, 0, 0);
}

export function buildLimo() {
  const robot = new THREE.Group();
  const textures = [];

  const std = (color, roughness, metalness = 0.05) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const M = {
    tire: std('#17181b', 0.9, 0),
    hub: std('#353a42', 0.4, 0.55),
    white: std('#eef0f3', 0.42),
    black: std('#101215', 0.55, 0.2),
    smoke: new THREE.MeshPhysicalMaterial({
      color: '#2c3138',
      roughness: 0.16,
      metalness: 0.2,
      clearcoat: 0.8,
      transparent: true,
      opacity: 0.94,
    }),
    camera: std('#c5cad1', 0.26, 0.75),
    lens: std('#020305', 0.08, 0.5),
    red: std('#d71f2b', 0.32),
    screen: std('#06080b', 0.1, 0.5),
    eye: new THREE.MeshBasicMaterial({ color: '#f8fafc' }),
    status: new THREE.MeshBasicMaterial({ color: '#4ade80' }),
    lidarGlow: new THREE.MeshBasicMaterial({ color: '#93c5fd' }),
  };

  const add = (geometry, material, x = 0, y = 0, z = 0, parent = robot) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };

  const decal = (texture, w, h, x, y, z, rotY = 0) => {
    textures.push(texture);
    const mesh = add(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
      x,
      y,
      z
    );
    mesh.rotation.y = rotY;
    return mesh;
  };

  // ---- Wheels
  const R = 0.1;
  const tireGeo = new THREE.CylinderGeometry(R, R, 0.085, 32).rotateZ(Math.PI / 2);
  const lugGeo = new THREE.BoxGeometry(0.089, 0.018, 0.026);
  const hubGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.089, 24).rotateZ(Math.PI / 2);
  const capGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.095, 16).rotateZ(Math.PI / 2);
  const ribGeo = new THREE.BoxGeometry(0.006, 0.048, 0.014);
  [-1, 1].forEach((sx) => {
    [-1, 1].forEach((sz) => {
      const wheel = new THREE.Group();
      wheel.position.set(sx * 0.205, R, sz * 0.165);
      robot.add(wheel);
      add(tireGeo, M.tire, 0, 0, 0, wheel);
      for (let i = 0; i < 16; i += 1) {
        const a = (i / 16) * TAU;
        const lug = add(lugGeo, M.tire, 0, Math.sin(a) * R, Math.cos(a) * R, wheel);
        lug.rotation.x = Math.PI / 2 - a;
      }
      add(hubGeo, M.hub, 0, 0, 0, wheel);
      add(capGeo, M.black, 0, 0, 0, wheel);
      for (let i = 0; i < 3; i += 1) {
        const a = (i / 3) * TAU + 0.3;
        const rib = add(
          ribGeo,
          M.black,
          sx * 0.0465,
          Math.sin(a) * 0.034,
          Math.cos(a) * 0.034,
          wheel
        );
        rib.rotation.x = Math.PI / 2 - a;
      }
    });
  });

  // ---- Chassis + front details
  add(new THREE.BoxGeometry(0.32, 0.11, 0.52), M.white, 0, 0.13, 0);
  add(new THREE.BoxGeometry(0.27, 0.08, 0.012), M.black, 0, 0.135, 0.262);
  decal(
    canvasTexture(256, 80, (ctx, w, h) => {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 60px "Arial Black", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('LIMO', w / 2, h / 2 + 2);
    }),
    0.1,
    0.031,
    -0.06,
    0.152,
    0.2685
  );
  add(new THREE.BoxGeometry(0.042, 0.032, 0.008), M.status, 0.075, 0.122, 0.269);
  add(new THREE.CylinderGeometry(0.026, 0.028, 0.012, 20), M.black, -0.12, 0.191, 0.2);
  add(new THREE.CylinderGeometry(0.021, 0.021, 0.022, 20), M.red, -0.12, 0.208, 0.2);

  const numberTexture = canvasTexture(128, 96, (ctx, w, h) => {
    ctx.fillStyle = '#111827';
    ctx.font = 'italic bold 72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('01', w / 2, h / 2 + 4);
  });
  decal(numberTexture, 0.07, 0.052, 0.1605, 0.13, 0, Math.PI / 2);
  decal(numberTexture, 0.07, 0.052, -0.1605, 0.13, 0, -Math.PI / 2);

  // ---- LiDAR bay + sensor (the scan origin)
  add(new THREE.BoxGeometry(0.18, 0.055, 0.2), M.black, 0, 0.2125, 0.12);
  const lidar = new THREE.Group();
  lidar.position.copy(LIDAR_LOCAL);
  robot.add(lidar);
  add(new THREE.CylinderGeometry(0.039, 0.042, 0.045, 32), M.black, 0, 0, 0, lidar);
  add(
    new THREE.CylinderGeometry(0.0425, 0.0425, 0.012, 32, 1, true),
    M.lidarGlow,
    0,
    0.004,
    0,
    lidar
  );
  const spinner = new THREE.Group();
  spinner.position.y = 0.0255;
  lidar.add(spinner);
  add(new THREE.CylinderGeometry(0.034, 0.039, 0.007, 28), M.hub, 0, 0, 0, spinner);
  add(new THREE.BoxGeometry(0.02, 0.009, 0.014), M.lidarGlow, 0.024, 0.002, 0, spinner);

  // ---- Smoked head with eyes
  add(
    sideExtrude(
      [
        [0, 0],
        [0.245, 0],
        [0.245, 0.09],
        [0.19, 0.145],
        [0, 0.145],
      ],
      0.3
    ),
    M.smoke,
    0,
    0.24,
    0
  );
  const eyeGeo = new THREE.PlaneGeometry(0.022, 0.04);
  add(eyeGeo, M.eye, -0.04, 0.29, 0.2465);
  add(eyeGeo, M.eye, 0.04, 0.29, 0.2465);

  // ---- Depth camera on top of the head
  add(new THREE.BoxGeometry(0.17, 0.038, 0.05), M.camera, 0, 0.405, 0.15);
  add(new THREE.BoxGeometry(0.15, 0.024, 0.004), M.black, 0, 0.405, 0.176);
  const lensGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.006, 16).rotateX(Math.PI / 2);
  add(lensGeo, M.lens, -0.045, 0.405, 0.179);
  add(lensGeo, M.lens, 0.045, 0.405, 0.179);
  add(new THREE.CylinderGeometry(0.005, 0.005, 0.006, 12).rotateX(Math.PI / 2), M.lens, 0.012, 0.405, 0.179);

  // ---- Mid body with side panels
  add(new THREE.BoxGeometry(0.3, 0.13, 0.25), M.white, 0, 0.25, -0.1);
  const brandTexture = canvasTexture(512, 160, (ctx) => {
    ctx.font = '600 70px Arial, sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#111827';
    ctx.fillText('AGILE·', 70, 80);
    ctx.fillStyle = '#dc2626';
    ctx.fillText('X', 70 + ctx.measureText('AGILE·').width, 80);
    ctx.fillStyle = '#0b0d10';
    ctx.fillRect(170, 100, 130, 44);
  });
  decal(brandTexture, 0.17, 0.053, 0.1505, 0.262, -0.1, Math.PI / 2);
  decal(brandTexture, 0.17, 0.053, -0.1505, 0.262, -0.1, -Math.PI / 2);

  // ---- Rear screen on an A-frame
  const screenPivot = new THREE.Group();
  screenPivot.position.set(0, 0.33, -0.1);
  screenPivot.rotation.x = 0.75;
  robot.add(screenPivot);
  add(new THREE.BoxGeometry(0.3, 0.012, 0.22), M.white, 0, 0, -0.11, screenPivot);
  add(
    new THREE.PlaneGeometry(0.27, 0.19).rotateX(-Math.PI / 2),
    M.screen,
    0,
    0.0065,
    -0.11,
    screenPivot
  );
  const bracket = [
    [-0.15, 0.315],
    [-0.27, 0.315],
    [-0.25, 0.462],
  ];
  add(sideExtrude(bracket, 0.01), M.white, 0.14, 0, 0);
  add(sideExtrude(bracket, 0.01), M.white, -0.14, 0, 0);

  // ---- Antennas
  [-0.075, 0.075].forEach((x) => {
    add(new THREE.CylinderGeometry(0.012, 0.012, 0.02, 12), M.black, x, 0.325, -0.03);
    add(new THREE.CylinderGeometry(0.006, 0.007, 0.2, 10), M.black, x, 0.435, -0.03);
  });

  // ---- Soft contact shadow
  const shadowTexture = canvasTexture(64, 64, (ctx) => {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.6, 'rgba(0,0,0,0.4)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  });
  textures.push(shadowTexture);
  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.5,
  });
  const shadow = add(
    new THREE.PlaneGeometry(0.75, 0.85).rotateX(-Math.PI / 2),
    shadowMaterial,
    0,
    0.003,
    0
  );
  shadow.renderOrder = -1;

  return {
    robot,
    spinner,
    lidarGlow: M.lidarGlow,
    shadowMaterial,
    dispose: () => textures.forEach((t) => t.dispose()),
  };
}
