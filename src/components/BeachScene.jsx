import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@hooks/useTheme';
import CameraController from './CameraController';
import BeachTable from './BeachTable';
import LaptopModel from './LaptopModel';
import StringLights from './StringLights';
import POVArms from './POVArms';

// Low-poly water plane with animated vertices
function Water({ isDark }) {
  const meshRef = useRef();
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(80, 80, 40, 40);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, Math.sin(x * 0.3 + t) * 0.3 + Math.cos(z * 0.4 + t * 0.8) * 0.2);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geo} position={[0, -0.5, -20]}>
      <meshStandardMaterial
        color={isDark ? '#0a2a4a' : '#2E8BC0'}
        flatShading
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// Low-poly sand
function Sand({ isDark }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(60, 30, 20, 10);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, Math.random() * 0.15);
    }
    return g;
  }, []);

  return (
    <mesh geometry={geo} position={[0, -0.3, 10]}>
      <meshStandardMaterial color={isDark ? '#3d3522' : '#F4D58D'} flatShading />
    </mesh>
  );
}

// Low-poly palm tree
function PalmTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.15, 0.25, 4, 6]} />
        <meshStandardMaterial color="#8B6914" flatShading />
      </mesh>
      {/* Leaves */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((rot, i) => (
        <mesh key={i} position={[0, 4.1, 0]} rotation={[0.3, rot, 0.5 - i * 0.1]}>
          <coneGeometry args={[0.6, 2.5, 4]} />
          <meshStandardMaterial color={`hsl(${120 + i * 8}, 50%, ${30 + i * 3}%)`} flatShading />
        </mesh>
      ))}
      {/* Coconuts */}
      <mesh position={[0.2, 3.8, 0.1]}>
        <sphereGeometry args={[0.12, 4, 4]} />
        <meshStandardMaterial color="#5C4033" flatShading />
      </mesh>
    </group>
  );
}

// Low-poly rock
function Rock({ position, scale = 1, color = '#8a8a8a' }) {
  const geo = useMemo(() => {
    const g = new THREE.DodecahedronGeometry(0.6, 0);
    g.scale(1, 0.6, 1);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * 0.15);
      pos.setY(i, pos.getY(i) + (Math.random() - 0.5) * 0.1);
      pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 0.15);
    }
    return g;
  }, []);

  return (
    <mesh geometry={geo} position={position} scale={scale}>
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  );
}

// Animated seagull
function Seagull({ position }) {
  const ref = useRef();
  const wingRef1 = useRef();
  const wingRef2 = useRef();
  const startPos = useMemo(() => [...position], [position]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.x = startPos[0] + Math.sin(t * 0.3) * 8;
    ref.current.position.y = startPos[1] + Math.sin(t * 0.7) * 0.5;
    ref.current.position.z = startPos[2] + Math.cos(t * 0.2) * 3;
    if (wingRef1.current) wingRef1.current.rotation.z = Math.sin(t * 4) * 0.4;
    if (wingRef2.current) wingRef2.current.rotation.z = -Math.sin(t * 4) * 0.4;
  });

  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.15, 4, 3]} />
        <meshStandardMaterial color="#f0f0f0" flatShading />
      </mesh>
      {/* Wings */}
      <mesh ref={wingRef1} position={[0.3, 0, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.15]} />
        <meshStandardMaterial color="#e0e0e0" flatShading />
      </mesh>
      <mesh ref={wingRef2} position={[-0.3, 0, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.15]} />
        <meshStandardMaterial color="#e0e0e0" flatShading />
      </mesh>
    </group>
  );
}

// Low-poly cloud
function Cloud({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 5, 4]} />
        <meshStandardMaterial color="#ffffff" flatShading transparent opacity={0.9} />
      </mesh>
      <mesh position={[1.1, -0.1, 0]}>
        <sphereGeometry args={[0.8, 5, 4]} />
        <meshStandardMaterial color="#ffffff" flatShading transparent opacity={0.9} />
      </mesh>
      <mesh position={[-0.9, -0.2, 0.2]}>
        <sphereGeometry args={[0.7, 5, 4]} />
        <meshStandardMaterial color="#ffffff" flatShading transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

// Stars for night mode
function Stars({ visible }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < 200; i++) {
      pos.push(
        (Math.random() - 0.5) * 100,
        Math.random() * 30 + 10,
        (Math.random() - 0.5) * 100
      );
    }
    return new Float32Array(pos);
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.005;
    }
  });

  if (!visible) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={200} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.15} sizeAttenuation />
    </points>
  );
}

// Campfire effect for night (subtle glow on the sand)
function CampfireGlow({ visible }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current && visible) {
      ref.current.intensity = 1.5 + Math.sin(clock.getElapsedTime() * 3) * 0.3;
    }
  });

  if (!visible) return null;

  return <pointLight ref={ref} position={[4, 0.5, 7]} color="#ff9944" intensity={1.5} distance={12} />;
}

export default function BeachScene({ navTarget, onTerminalActivity }) {
  const { isDark } = useTheme();

  return (
    <Canvas
      camera={{ position: [0, 2.2, 6], fov: 60 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
      gl={{ antialias: true, alpha: false }}
    >
      {/* Sky */}
      <color attach="background" args={[isDark ? '#0a0a23' : '#87CEEB']} />

      {isDark ? (
        <>
          <ambientLight intensity={0.15} />
          <directionalLight position={[-5, 3, 5]} intensity={0.3} color="#4466aa" />
          <pointLight position={[10, 20, -10]} intensity={0.2} color="#aabbff" />
        </>
      ) : (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 15, 10]} intensity={1.2} color="#fff5e6" castShadow />
        </>
      )}

      {/* Sun/Moon indicator */}
      {!isDark && <Sky sunPosition={[50, 20, -30]} turbidity={8} rayleigh={2} />}

      <Water isDark={isDark} />
      <Sand isDark={isDark} />

      {/* Beach table and laptop */}
      <BeachTable />
      <LaptopModel navigateTo={navTarget} onActivity={onTerminalActivity} />

      {/* Palm trees */}
      <PalmTree position={[-8, 0, 4]} scale={1.2} />
      <PalmTree position={[9, 0, 6]} scale={0.9} />
      <PalmTree position={[-12, 0, 8]} scale={1} />
      <PalmTree position={[14, 0, 3]} scale={0.7} />

      {/* Rocks */}
      <Rock position={[-4, -0.2, 2]} scale={1.5} color="#7a7a7a" />
      <Rock position={[6, -0.3, 0]} scale={1} color="#8a8a7a" />
      <Rock position={[-7, -0.2, -1]} scale={0.8} color="#6a6a6a" />
      <Rock position={[11, -0.1, 1]} scale={1.2} color="#7a7a6a" />

      {/* Seagulls */}
      <Seagull position={[3, 8, -5]} />
      <Seagull position={[-5, 10, -8]} />
      <Seagull position={[8, 9, -3]} />

      {/* Clouds */}
      {!isDark && (
        <>
          <Cloud position={[-10, 12, -15]} scale={1.2} />
          <Cloud position={[8, 14, -20]} scale={0.8} />
          <Cloud position={[0, 11, -25]} scale={1.5} />
        </>
      )}

      {/* Night elements */}
      <Stars visible={isDark} />
      <CampfireGlow visible={isDark} />

      {/* String lights between the two flanking palm trees */}
      <StringLights
        startPoint={[-8, 3.8, 4]}
        endPoint={[9, 3.4, 6]}
        isDark={isDark}
        bulbCount={14}
      />

      {/* POV arms (rendered in camera local space) */}
      <POVArms />

      {/* Custom camera controller */}
      <CameraController />
    </Canvas>
  );
}
