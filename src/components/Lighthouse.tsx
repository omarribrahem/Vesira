import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * The VASIRA V-shaped lighthouse, rendered as a 3D model on a 2D canvas
 * (software renderer: perspective projection + painter's algorithm).
 *
 * Owner-approved upgrade, 2026-11-10 (tier A):
 *  - Depth-sorted draw list, so arms, lamp and light shafts interleave
 *    correctly instead of always painting over each other.
 *  - Light shafts follow projected 3D cone axes/cross-sections. A cached
 *    scattering texture feathers their edges and fades them into the air.
 *  - A soft contact shadow is projected from the model's own silhouette onto
 *    the ground plane, so the object is grounded rather than floating.
 *  - Slow automatic yaw rotation resumes after drag; vertical tilt is bounded.
 *  - Under prefers-reduced-motion the model holds still and drag has no spin.
 */

const N = 64; // smooth circular silhouettes without a rendering dependency
const GOLD: [number, number, number] = [183, 147, 88];
const LAMP: Vec3 = [0, 0.43, 0];
const BEAM_ANGLE = 0.56; // beam half-angle from vertical
const BEAM_LENGTH = 2.7; // beam length
const BEAM_RADIUS = 0.5; // beam base radius
const GROUND_Y = -1.7;
const HERO_RY = 0.24; // authored three-quarter view keeps both V beams readable
const HERO_RX = 0.12;
const AUTO_SPEED = (Math.PI * 2) / 36; // one calm revolution per 36 seconds
const wrapAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));
const PITCH_MIN = -0.04;
const PITCH_MAX = 0.23;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const IDLE_BEFORE_AUTO = 1.2; // pause after interaction before rotation resumes
const AUTO_BLEND = 1.4; // ease back to cruising speed

type Material = 'brass' | 'glass' | 'emitter' | 'dark';
interface Surface { y0: number; r0: number; y1: number; r1: number; material: Material; x: number; z: number }
const SURFACES: Surface[] = [];
function profile(points: Vec2[], material: Material = 'brass', x = 0, z = 0) {
  for (let i = 1; i < points.length; i++) {
    SURFACES.push({ y0: points[i-1][0], r0: points[i-1][1], y1: points[i][0], r1: points[i][1], material, x, z });
  }
}
// Small bevel bands soften silhouettes and catch light at physical edges.
profile([[-1.7,0],[-1.7,.265],[-1.686,.288],[-1.66,.298],[-1.59,.298],[-1.566,.278],[-1.55,.18],[-1.53,.17],[.16,.105],[.18,.12]]);
profile([[.18,.12],[.18,.205],[.195,.22],[.23,.22],[.25,.205],[.25,.15]]);
profile([[.255,.145],[.59,.145]], 'glass');
profile([[.58,.14],[.58,.205],[.596,.215],[.62,.21],[.64,.195],[.77,.035],[.785,.02],[.79,0]]);
profile([[.27,.04],[.29,.05],[.55,.05],[.57,.035]], 'emitter');
profile([[.26,.055],[.26,.085],[.278,.085],[.285,.055]], 'dark');
profile([[.555,.055],[.565,.08],[.58,.08]]);
for (let i=0;i<4;i++) {
  const angle=Math.PI/4+i*Math.PI/2;
  profile([[.25,.012],[.265,.015],[.575,.015],[.59,.012]], 'brass', Math.cos(angle)*.143, Math.sin(angle)*.143);
}
for(let y=.31;y<.55;y+=.045) profile([[y,.05],[y+.006,.056],[y+.012,.05]],'brass');

type Vec2 = [number, number];
type Vec3 = [number, number, number];

function norm(v: number[]): Vec3 {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

const L = norm([0.5, 0.7, 0.8]);
const Hh = norm([L[0], L[1], L[2] + 1]);

function rot(p: number[], ry: number, rx: number): Vec3 {
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const x = p[0] * cy + p[2] * sy;
  const z = -p[0] * sy + p[2] * cy;
  const y = p[1];
  return [x, y * cx - z * sx, y * sx + z * cx];
}

/** Convex hull (monotone chain) used for the contact-shadow footprint. */
function hull(P: Vec2[]): Vec2[] {
  const pts = P.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: Vec2, a: Vec2, b: Vec2) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Vec2[] = [];
  const up: Vec2[] = [];
  for (let i = 0; i < pts.length; i++) {
    while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], pts[i]) <= 0) lo.pop();
    lo.push(pts[i]);
  }
  for (let i = pts.length - 1; i >= 0; i--) {
    while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], pts[i]) <= 0) up.pop();
    up.push(pts[i]);
  }
  lo.pop();
  up.pop();
  return lo.concat(up);
}

interface Drawable {
  z: number;
  draw: () => void;
}

export function Lighthouse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    if (!ctx) return undefined;

    const canBlur = typeof ctx.filter === 'string';

    // Cache a scattering profile once. Light has no solid outer wall or end
    // cap: it fades across the cone and into the distance through the air.
    const beamTexture = document.createElement('canvas');
    beamTexture.width = 384;
    beamTexture.height = 256;
    const beamCtx = beamTexture.getContext('2d');
    if (!beamCtx) return undefined;
    const pixels = beamCtx.createImageData(beamTexture.width, beamTexture.height);
    for (let y = 0; y < beamTexture.height; y++) {
      for (let x = 0; x < beamTexture.width; x++) {
        const distance = x / (beamTexture.width - 1);
        const cross = (y / (beamTexture.height - 1)) * 2 - 1;
        const spread = 0.018 + distance * 0.58;
        const body = Math.exp(-0.5 * (cross / spread) ** 2);
        const core = Math.exp(-0.5 * (cross / (spread * 0.32)) ** 2);
        const end = Math.max(0, Math.min(1, (1 - distance) / 0.4));
        const feather = end * end * (3 - 2 * end);
        const attenuation = 1 / (1 + 5 * distance * distance);
        const index = (y * beamTexture.width + x) * 4;
        pixels.data[index] = 255;
        pixels.data[index + 1] = 242 - Math.round(distance * 8);
        pixels.data[index + 2] = 215 - Math.round(distance * 14);
        pixels.data[index + 3] = Math.round(
          255 * (body * 0.26 + core * 0.28) * attenuation * feather,
        );
      }
    }
    beamCtx.putImageData(pixels, 0, 0);

    let W = 1;
    let H = 1;
    let dpr = 1;
    let K = 100;

    let ry = HERO_RY;
    let rx = HERO_RX;
    let dragging = false;
    let lx = 0;
    let ly = 0;
    let vy = 0; // angular velocity (rad/s)
    let vx = 0;
    let lastMove = 0;
    let idle = 0; // seconds since the last interaction
    let autoW = 1; // automatic rotation weight, 0..1
    let last = 0;
    let redrawStill = () => {};
    let visible = true;

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(cv.clientWidth || 300, 1);
      H = Math.max(cv.clientHeight || 500, 1);
      cv.width = W * dpr;
      cv.height = H * dpr;
      K = Math.min(W / 4.4, H / 4.6);
      redrawStill();
    };

    size();
    window.addEventListener('resize', size);

    const ro = new ResizeObserver(size);
    ro.observe(cv.parentElement ?? cv);

    /** Perspective projection: model units -> canvas pixels. */
    const pr = (r: Vec3): Vec2 => {
      const f = 1 / (1 - r[2] / 9);
      return [W / 2 + r[0] * K * f, H / 2 + 0.45 * K - r[1] * K * f];
    };

    const frame = (now: number) => {
      if (!visible || document.hidden) return;
      if (!reduceMotion) rafRef.current = requestAnimationFrame(frame);
      const dt = last ? Math.min(1 / 20, (now - last) / 1000) : 1 / 60;
      last = now;

      if (!reduceMotion) {
        if (!dragging) {
          // Spin-down from the last flick.
          if (vy !== 0 || vx !== 0) {
            ry = wrapAngle(ry + vy * dt);
            rx = clamp(rx + vx * dt, PITCH_MIN, PITCH_MAX);
            if (rx === PITCH_MIN || rx === PITCH_MAX) vx = 0;
            const decay = Math.exp(-dt * 3.4);
            vy *= decay;
            vx *= decay;
            if (Math.abs(vy) < 0.002) vy = 0;
            if (Math.abs(vx) < 0.002) vx = 0;
          }
          idle += dt;
          if (idle > IDLE_BEFORE_AUTO) {
            // Latest owner choice: a continuous full turn, not a back/forth arc.
            autoW = Math.min(1, autoW + dt / AUTO_BLEND);
            const pull = (1 - Math.exp(-dt * 2.4)) * autoW;
            ry = wrapAngle(ry + AUTO_SPEED * autoW * dt);
            rx += (HERO_RX - rx) * pull * 0.6;
          }
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const drawables: Drawable[] = [];
      const shadowPoints: Vec2[] = [];

      // ---- tubes ------------------------------------------------------------
      SURFACES.forEach((s) => {
        const nr = s.y1 - s.y0;
        const ny = -(s.r1 - s.r0);

        for (let i = 0; i < N; i++) {
          const a0 = (i / N) * 6.2832;
          const a1 = ((i + 1) / N) * 6.2832;
          const am = (a0 + a1) / 2;
          const n = rot(norm([nr * Math.cos(am), ny, nr * Math.sin(am)]), ry, rx);
          if (n[2] < 0 && s.material !== 'glass') continue;

          const raw: number[][] = [
            [s.x+s.r0*Math.cos(a0),s.y0,s.z+s.r0*Math.sin(a0)],
            [s.x+s.r0*Math.cos(a1),s.y0,s.z+s.r0*Math.sin(a1)],
            [s.x+s.r1*Math.cos(a1),s.y1,s.z+s.r1*Math.sin(a1)],
            [s.x+s.r1*Math.cos(a0),s.y1,s.z+s.r1*Math.sin(a0)],
          ];

          // Footprint of this quad on the ground plane (for the shadow).
          raw.forEach((p) => {
            if(s.material !== 'glass' && s.material !== 'emitter') {
              const height = p[1] - GROUND_Y;
              shadowPoints.push(pr(rot([p[0]-height*.32,GROUND_Y,p[2]-height*.2],ry,rx)));
            }
          });

          const P = raw.map((p) => rot(p, ry, rx));
          const z = (P[0][2] + P[1][2] + P[2][2] + P[3][2]) / 4;

          let col: string;
          if (s.material === 'emitter') {
            const edge = Math.pow(Math.abs(n[2]), .6);
            col = `rgb(255,${Math.round(210+edge*36)},${Math.round(143+edge*64)})`;
          } else if (s.material === 'glass') {
            const fresnel = Math.pow(1-Math.abs(n[2]),3);
            const reflection = Math.pow(Math.max(0,n[0]*Hh[0]+n[1]*Hh[1]+n[2]*Hh[2]),45);
            col = `rgba(194,211,211,${.025+fresnel*.18+reflection*.28})`;
          } else if (s.material === 'dark') {
            col = 'rgb(55,45,32)';
          } else {
            const d = Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]);
            const alignment = Math.max(0,n[0]*Hh[0]+n[1]*Hh[1]+n[2]*Hh[2]);
            const sp = Math.pow(alignment,10)*28+Math.pow(alignment,55)*23;
            const center: Vec3 = [
              (P[0][0] + P[1][0] + P[2][0] + P[3][0]) / 4,
              (P[0][1] + P[1][1] + P[2][1] + P[3][1]) / 4,
              z,
            ];
            const lampPosition = rot(LAMP, ry, rx);
            const towardLamp = lampPosition.map((v, axis) => v - center[axis]);
            const lampDistance = Math.hypot(...towardLamp);
            const lampDirection = norm(towardLamp);
            const facing = Math.max(0,
              n[0] * lampDirection[0] + n[1] * lampDirection[1] + n[2] * lampDirection[2]);
            const spill = facing * 0.32 / (1 + lampDistance * lampDistance * 5);
            const f = 0.42 + 0.58 * d;
            col = `rgb(${Math.min(255, (GOLD[0] * f + sp + spill * 255) | 0)},${Math.min(
              255,
              (GOLD[1] * f + sp + spill * 220) | 0,
            )},${Math.min(255, (GOLD[2] * f * 0.8 + sp + spill * 160) | 0)})`;
          }

          drawables.push({
            z,
            draw: () => {
              const Q = P.map((p) => pr(p));
              ctx.fillStyle = col;
              ctx.strokeStyle = col;
              ctx.lineWidth = 0.45;
              ctx.beginPath();
              ctx.moveTo(Q[0][0], Q[0][1]);
              ctx.lineTo(Q[1][0], Q[1][1]);
              ctx.lineTo(Q[2][0], Q[2][1]);
              ctx.lineTo(Q[3][0], Q[3][1]);
              ctx.closePath();
              ctx.fill();
              if (s.material !== 'glass') ctx.stroke();
            },
          });
        }
      });

      // ---- light shafts ------------------------------------------------------
      // Project each 3D axis and its circular cross-section, then align the
      // cached soft volume to it. No opaque cone shell or glowing far cap.
      const apex = rot(LAMP, ry, rx);
      const apex2d = pr(apex);

      [1, -1].forEach((sg) => {
        const dx = sg * Math.sin(BEAM_ANGLE);
        const dy = Math.cos(BEAM_ANGLE);
        const cx0 = LAMP[0] + dx * BEAM_LENGTH;
        const cy0 = LAMP[1] + dy * BEAM_LENGTH;

          const far = pr(rot([cx0, cy0, 0], ry, rx));
          const axisX = far[0] - apex2d[0];
          const axisY = far[1] - apex2d[1];
          const length = Math.max(1, Math.hypot(axisX, axisY));
          const normalX = -axisY / length;
          const normalY = axisX / length;
          let radius = 1;
          for (let k = 0; k < 24; k++) {
            const angle = (k / 24) * Math.PI * 2;
            const side = Math.sin(angle) * BEAM_RADIUS;
            const q = pr(rot([cx0 + dy * side, cy0 - dx * side,
              Math.cos(angle) * BEAM_RADIUS], ry, rx));
            radius = Math.max(radius,
              Math.abs((q[0] - far[0]) * normalX + (q[1] - far[1]) * normalY));
          }
          const mid = rot(
            [LAMP[0] + dx * BEAM_LENGTH * 0.5, LAMP[1] + dy * BEAM_LENGTH * 0.5, 0],
            ry,
            rx,
          );

          drawables.push({
            z: mid[2],
            draw: () => {
              ctx.save();
              ctx.globalCompositeOperation = 'lighter';
              ctx.transform(
                axisX / beamTexture.width, axisY / beamTexture.width,
                (normalX * radius * 2.8) / beamTexture.height,
                (normalY * radius * 2.8) / beamTexture.height,
                apex2d[0] - normalX * radius * 1.4,
                apex2d[1] - normalY * radius * 1.4,
              );
              ctx.drawImage(beamTexture, 0, 0);
              ctx.restore();
            },
          });
      });

      // ---- contact shadow + soft floor pool --------------------------------
      if (shadowPoints.length > 2) {
        const h = hull(shadowPoints);
        if (h.length > 2) {
          let cx = 0;
          let cy = 0;
          for (const q of h) {
            cx += q[0];
            cy += q[1];
          }
          cx /= h.length;
          cy /= h.length;
          let rad = 0;
          for (const q of h) rad = Math.max(rad, Math.hypot(q[0] - cx, q[1] - cy));

          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rad, 1));
          g.addColorStop(0, 'rgba(0,0,0,0.5)');
          g.addColorStop(0.6, 'rgba(0,0,0,0.22)');
          g.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.save();
          if (canBlur) ctx.filter = 'blur(9px)';
          ctx.fillStyle = g;
          ctx.beginPath();
          h.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      // Soft pool of shade on the floor beneath the model.
      const pool = pr(rot([0, GROUND_Y, 0], ry, rx));
      const pr2 = pr(rot([0.5, GROUND_Y, 0], ry, rx));
      const poolR = Math.abs(pr2[0] - pool[0]);
      const poolG = ctx.createRadialGradient(pool[0], pool[1], 0, pool[0], pool[1], Math.max(poolR, 1));
      poolG.addColorStop(0, 'rgba(0,0,0,0.85)');
      poolG.addColorStop(0.5, 'rgba(0,0,0,0.4)');
      poolG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      if (canBlur) ctx.filter = 'blur(3px)';
      ctx.fillStyle = poolG;
      ctx.beginPath();
      ctx.ellipse(pool[0], pool[1], Math.max(poolR, 1), Math.max(poolR * 0.18, 2), 0, 0, 6.2832);
      ctx.fill();
      ctx.restore();

      // ---- depth-sorted pass -------------------------------------------------
      drawables.sort((a, b) => a.z - b.z);
      drawables.forEach((item) => item.draw());

      // A steady warm halation surrounds a small hot source. Bloom is a
      // photographic cue, not a pulsating luminous ball covering the model.
      const gr = 0.36 * K;
      const g = ctx.createRadialGradient(apex2d[0], apex2d[1], 0, apex2d[0], apex2d[1], gr);
      g.addColorStop(0, 'rgba(255,251,239,0.75)');
      g.addColorStop(0.08, 'rgba(255,241,205,0.48)');
      g.addColorStop(0.3, 'rgba(255,216,151,0.12)');
      g.addColorStop(1, 'rgba(255,207,139,0)');
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(apex2d[0], apex2d[1], gr, 0, 6.2832);
      ctx.fill();
      ctx.restore();
    };

    redrawStill = () => {
      cancelAnimationFrame(rafRef.current);
      if (visible && !document.hidden) rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      last = 0;
      redrawStill();
    });
    visibility.observe(cv);
    const onVisibility = () => { last = 0; redrawStill(); };
    document.addEventListener('visibilitychange', onVisibility);

    const onPointerDown = (e: PointerEvent) => {
      if (dragging || !e.isPrimary || e.button !== 0) return;
      dragging = true;
      lx = e.clientX;
      ly = e.clientY;
      lastMove = performance.now();
      vy = 0;
      vx = 0;
      idle = 0;
      autoW = 0;
      try {
        cv.setPointerCapture(e.pointerId);
      } catch {}
      cv.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dRy = (e.clientX - lx) * 0.008;
      const dRx = e.pointerType === 'touch' ? 0 : (e.clientY - ly) * 0.006;
      ry = wrapAngle(ry + dRy);
      rx = clamp(rx + dRx, PITCH_MIN, PITCH_MAX);
      lx = e.clientX;
      ly = e.clientY;

      const now = performance.now();
      const step = Math.max((now - lastMove) / 1000, 0.008);
      lastMove = now;
      // Smoothed angular velocity so a flick carries momentum.
      vy = vy * 0.55 + (dRy / step) * 0.45;
      vx = vx * 0.55 + (dRx / step) * 0.45;
      redrawStill();
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      idle = 0;
      cv.style.cursor = 'grab';
    };

    cv.addEventListener('pointerdown', onPointerDown);
    cv.addEventListener('pointermove', onPointerMove);
    cv.addEventListener('pointerup', onPointerUp);
    cv.addEventListener('pointercancel', onPointerUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', size);
      ro.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      cv.removeEventListener('pointerdown', onPointerDown);
      cv.removeEventListener('pointermove', onPointerMove);
      cv.removeEventListener('pointerup', onPointerUp);
      cv.removeEventListener('pointercancel', onPointerUp);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="lighthouse-canvas"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        touchAction: 'pan-y pinch-zoom',
        cursor: 'grab',
      }}
      aria-hidden="true"
    />
  );
}
