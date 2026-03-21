import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StringLights({ startPoint, endPoint, isDark, bulbCount = 14 }) {
  const bulbRefs = useRef([]);

  const { tubeGeo, bulbPositions, lightPositions } = useMemo(() => {
    const start = new THREE.Vector3(...startPoint);
    const end = new THREE.Vector3(...endPoint);
    // Catenary droop: midpoint hangs 1.6 units below the endpoints
    const mid = new THREE.Vector3(
      (start.x + end.x) / 2,
      Math.min(start.y, end.y) - 1.6,
      (start.z + end.z) / 2
    );

    const curve = new THREE.CatmullRomCurve3([start, mid, end]);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.015, 4, false);

    const bulbPositions = [];
    for (let i = 0; i <= bulbCount; i++) {
      bulbPositions.push(curve.getPoint(i / bulbCount).clone());
    }

    // Every 3rd bulb gets a point light (skips first and last)
    const lightPositions = bulbPositions.filter((_, i) => i % 3 === 1 && i > 0 && i < bulbPositions.length - 1);

    return { tubeGeo, bulbPositions, lightPositions };
  }, [startPoint, endPoint, bulbCount]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    bulbRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const base = bulbPositions[i];
      // Subtle wind sway
      ref.position.x = base.x + Math.cos(t * 0.6 + i * 0.4) * 0.01;
      ref.position.y = base.y + Math.sin(t * 0.8 + i * 0.55) * 0.012;
      ref.position.z = base.z;

      // Night flicker on emissive
      if (isDark && ref.material) {
        ref.material.emissiveIntensity = 0.72 + Math.sin(t * 7.3 + i * 2.1) * 0.1 + Math.sin(t * 13 + i * 0.7) * 0.06;
      }
    });
  });

  return (
    <group>
      {/* Wire */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial color="#2a2a2a" flatShading />
      </mesh>

      {/* Bulbs */}
      {bulbPositions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => { bulbRefs.current[i] = el; }}
          position={[pos.x, pos.y, pos.z]}
        >
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshStandardMaterial
            color={isDark ? '#ffaa44' : '#e8e0d0'}
            emissive={isDark ? '#ff9944' : '#000000'}
            emissiveIntensity={isDark ? 0.8 : 0}
            flatShading
          />
        </mesh>
      ))}

      {/* Point lights at night only — every 3rd bulb */}
      {isDark && lightPositions.map((pos, i) => (
        <pointLight
          key={i}
          position={[pos.x, pos.y, pos.z]}
          color="#ffaa55"
          intensity={0.3}
          distance={3}
        />
      ))}
    </group>
  );
}
