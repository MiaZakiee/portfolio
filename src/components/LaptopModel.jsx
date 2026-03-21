import React, { useCallback } from 'react';
import { Html } from '@react-three/drei';
import { useTheme } from '@hooks/useTheme';
import { cameraStore } from '../stores/cameraStore';
import Terminal from './Terminal';

export default function LaptopModel({ navigateTo, onActivity }) {
  const { isDark } = useTheme();
  const bodyColor = isDark ? '#1a1a2e' : '#2a2a3a';
  const screenFrameColor = isDark ? '#111122' : '#1a1a28';

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    cameraStore.focusLaptop();
  }, []);

  const handleFocus = useCallback(() => {
    cameraStore.focusLaptop();
  }, []);

  return (
    <group position={[0, 1.05, 5]} onClick={handleClick}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 0.04, 1.6]} />
        <meshStandardMaterial color={bodyColor} flatShading />
      </mesh>

      {/* Touchpad */}
      <mesh position={[0, 0.025, 0.3]}>
        <boxGeometry args={[0.6, 0.005, 0.4]} />
        <meshStandardMaterial color={isDark ? '#252540' : '#3a3a4a'} flatShading />
      </mesh>

      {/* Hinge */}
      <mesh position={[0, 0.02, -0.78]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 2.2, 8]} />
        <meshStandardMaterial color={isDark ? '#0f0f20' : '#222233'} flatShading />
      </mesh>

      {/* Screen group - rotated open */}
      <group position={[0, 0.02, -0.78]} rotation={[-0.7, 0, 0]}>
        {/* Screen frame */}
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[2.5, 1.7, 0.05]} />
          <meshStandardMaterial color={screenFrameColor} flatShading />
        </mesh>

        {/* Screen surface with Html terminal */}
        <mesh position={[0, 0.85, 0.03]}>
          <planeGeometry args={[2.3, 1.5]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        <Html
          transform
          occlude
          position={[0, 0.85, 0.04]}
          scale={0.14}
          style={{
            width: '720px',
            height: '450px',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              width: '720px',
              height: '450px',
              overflow: 'hidden',
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Terminal
              navigateTo={navigateTo}
              onActivity={onActivity}
              onFocus={handleFocus}
            />
          </div>
        </Html>
      </group>
    </group>
  );
}
