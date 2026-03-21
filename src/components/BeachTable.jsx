import React from 'react';
import { useTheme } from '@hooks/useTheme';

export default function BeachTable() {
  const { isDark } = useTheme();
  const woodColor = isDark ? '#5a3d2b' : '#a0714f';
  const legColor = isDark ? '#4a2d1b' : '#8a6140';

  return (
    <group position={[0, 0, 5]}>
      {/* Tabletop */}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[3.5, 0.08, 2.2]} />
        <meshStandardMaterial color={woodColor} flatShading />
      </mesh>

      {/* 4 Legs */}
      {[[-1.5, 0, -0.9], [1.5, 0, -0.9], [-1.5, 0, 0.9], [1.5, 0, 0.9]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.47, pos[2]]}>
          <cylinderGeometry args={[0.06, 0.08, 0.94, 6]} />
          <meshStandardMaterial color={legColor} flatShading />
        </mesh>
      ))}

      {/* Coffee mug */}
      <group position={[1.2, 1.05, -0.5]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.07, 0.16, 8]} />
          <meshStandardMaterial color="#e8e0d0" flatShading />
        </mesh>
        {/* Handle */}
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.05, 0.015, 6, 8, Math.PI]} />
          <meshStandardMaterial color="#e8e0d0" flatShading />
        </mesh>
      </group>

      {/* Sunglasses */}
      <group position={[-1.0, 1.02, 0.4]} rotation={[0, 0.3, 0]}>
        {/* Left lens */}
        <mesh position={[-0.08, 0, 0]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color="#1a1a2e" flatShading />
        </mesh>
        {/* Right lens */}
        <mesh position={[0.08, 0, 0]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color="#1a1a2e" flatShading />
        </mesh>
        {/* Bridge */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.01, 0.02]} />
          <meshStandardMaterial color="#2a2a3e" flatShading />
        </mesh>
      </group>
    </group>
  );
}
