import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const SKIN = '#d4a574';
const SLEEVE = '#6b8fa8';

// Pre-allocated to avoid per-frame allocations
const _breatheVec = new THREE.Vector3();

function Arm({ side }) {
  const sign = side === 'right' ? 1 : -1;
  // Positions are in camera-local space (group inherits camera transform each frame)
  return (
    <group position={[sign * 0.28, -0.25, -0.65]} rotation={[0.05, sign * -0.12, sign * 0.04]}>
      {/* Palm */}
      <mesh>
        <boxGeometry args={[0.11, 0.04, 0.14]} />
        <meshStandardMaterial color={SKIN} flatShading />
      </mesh>
      {/* Fingers (mitten) */}
      <mesh position={[0, 0.01, -0.09]}>
        <boxGeometry args={[0.10, 0.048, 0.07]} />
        <meshStandardMaterial color={SKIN} flatShading />
      </mesh>
      {/* Thumb nub */}
      <mesh position={[sign * 0.07, 0.01, -0.02]} rotation={[0, 0, sign * -0.35]}>
        <boxGeometry args={[0.045, 0.03, 0.055]} />
        <meshStandardMaterial color={SKIN} flatShading />
      </mesh>
      {/* Forearm */}
      <mesh position={[sign * 0.01, -0.025, 0.18]}>
        <boxGeometry args={[0.072, 0.072, 0.26]} />
        <meshStandardMaterial color={SKIN} flatShading />
      </mesh>
      {/* Sleeve cuff */}
      <mesh position={[sign * 0.012, -0.032, 0.36]}>
        <boxGeometry args={[0.088, 0.088, 0.14]} />
        <meshStandardMaterial color={SLEEVE} flatShading />
      </mesh>
      {/* Upper sleeve (mostly off-screen, gives depth) */}
      <mesh position={[sign * 0.015, -0.038, 0.52]}>
        <boxGeometry args={[0.095, 0.095, 0.14]} />
        <meshStandardMaterial color={SLEEVE} flatShading />
      </mesh>
    </group>
  );
}

export default function POVArms() {
  const { camera } = useThree();
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Mirror the camera's world transform so children appear in camera-local space
    groupRef.current.position.copy(camera.position);
    groupRef.current.quaternion.copy(camera.quaternion);
    // Subtle breathing: 0.5 Hz, 0.008 unit amplitude along camera's local up
    const breathe = Math.sin(clock.getElapsedTime() * Math.PI) * 0.008;
    _breatheVec.set(0, breathe, 0).applyQuaternion(camera.quaternion);
    groupRef.current.position.add(_breatheVec);
  });

  return (
    <group ref={groupRef}>
      <Arm side="right" />
      <Arm side="left" />
    </group>
  );
}
