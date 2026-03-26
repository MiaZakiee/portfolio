import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { cameraStore } from '../stores/cameraStore';

// Camera never moves — fixed seated POV
const SEATED_POS = new THREE.Vector3(0, 2.2, 6);

// Laptop screen world position (used to compute focus angles)
// Camera at [0,2.2,6], screen at [0,1.8,4.0] → dir [0,-0.196,-0.981]
const FOCUS_THETA = 0;
const FOCUS_PHI = Math.asin(-0.1962); // ≈ -0.197 rad (looking slightly down)

// Idle pan: ±60° horizontal, slow sine sweep (≈9s for full left→right)
const IDLE_THETA_AMP  = 1.0;   // ±1 rad ≈ ±57°
const IDLE_THETA_FREQ = 0.35;  // rad/s  → period ≈ 18s, half ≈ 9s
const IDLE_PHI_CENTER = -0.08; // slightly downward
const IDLE_PHI_AMP    = 0.04;  // tiny vertical drift
const IDLE_PHI_FREQ   = 0.09;

const MIN_PHI = -0.45;
const MAX_PHI =  0.30;

const DRAG_SENSITIVITY  = 0.0045;
const DRAG_RESUME_DELAY = 6000;  // ms before auto-pan resumes after drag
const INACTIVITY_TIMEOUT = 12000; // ms before unfocus

// Lerp speeds (time-based: factor = 1 - exp(-delta * speed))
const SPEED_IDLE  = 1.6;
const SPEED_FOCUS = 4.5;

export default function CameraController() {
  const { camera, gl } = useThree();

  const theta          = useRef(0);
  const phi            = useRef(IDLE_PHI_CENTER);
  const mode           = useRef('orbit');
  const isDragging     = useRef(false);
  const lastDragTime   = useRef(0);
  const lastMouse      = useRef({ x: 0, y: 0 });
  const initialized    = useRef(false);

  // Place camera at seated position immediately
  useEffect(() => {
    camera.position.copy(SEATED_POS);
    initialized.current = true;
  }, [camera]);

  // Sync store mode
  useEffect(() => {
    return cameraStore.subscribe((s) => {
      mode.current = s.mode;
    });
  }, []);

  const onPointerDown = useCallback((e) => {
    if (e.target !== gl.domElement) return;
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, [gl]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };

    // Drag on canvas background unfocuses laptop
    if (mode.current === 'focused') {
      cameraStore.unfocusLaptop();
    }

    theta.current -= dx * DRAG_SENSITIVITY;
    phi.current   += dy * DRAG_SENSITIVITY;
    phi.current    = THREE.MathUtils.clamp(phi.current, MIN_PHI, MAX_PHI);
    lastDragTime.current = Date.now();
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    lastDragTime.current = Date.now();
  }, []);

  useEffect(() => {
    const el = gl.domElement;
    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [gl, onPointerDown, onPointerMove, onPointerUp]);

  useFrame(({ clock }, delta) => {
    if (!initialized.current) return;
    const dt  = delta || 0.016; // fallback to 60fps if delta is undefined

    const t   = clock.getElapsedTime();
    const s   = cameraStore.getState();
    const now = Date.now();

    // Camera always stays at SEATED_POS — only rotation changes
    camera.position.copy(SEATED_POS);

    if (s.mode === 'focused') {
      // Auto-unfocus on inactivity
      if (now - s.lastActivityTime > INACTIVITY_TIMEOUT) {
        cameraStore.unfocusLaptop();
      }
      const f = 1 - Math.exp(-dt * SPEED_FOCUS);
      theta.current = THREE.MathUtils.lerp(theta.current, FOCUS_THETA, f);
      phi.current   = THREE.MathUtils.lerp(phi.current,   FOCUS_PHI,   f);
    } else {
      // Idle head-turn: sine wave auto-pan, but respect recent drag
      const dragPaused = (now - lastDragTime.current) < DRAG_RESUME_DELAY;
      if (!dragPaused && !isDragging.current) {
        const targetTheta = Math.sin(t * IDLE_THETA_FREQ) * IDLE_THETA_AMP;
        const targetPhi   = IDLE_PHI_CENTER + Math.sin(t * IDLE_PHI_FREQ) * IDLE_PHI_AMP;
        const f = 1 - Math.exp(-dt * SPEED_IDLE);
        theta.current = THREE.MathUtils.lerp(theta.current, targetTheta, f);
        phi.current   = THREE.MathUtils.lerp(phi.current,   targetPhi,   f);
      }
    }

    // Convert theta/phi to a lookAt point
    // direction: [sin(θ)cos(φ), sin(φ), -cos(θ)cos(φ)]
    const cosP = Math.cos(phi.current);
    const lookX = SEATED_POS.x + Math.sin(theta.current) * cosP * 10;
    const lookY = SEATED_POS.y + Math.sin(phi.current)          * 10;
    const lookZ = SEATED_POS.z - Math.cos(theta.current) * cosP * 10;
    camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}
