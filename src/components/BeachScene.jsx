import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@hooks/useTheme';
import CameraController from './CameraController';
import BeachTable from './BeachTable';
import LaptopModel from './LaptopModel';
import StringLights from './StringLights';

// Low-poly water plane with animated vertices
function Water({ isDark }) {
  const meshRef = useRef();
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(250, 250, 60, 60);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Three overlapping wave layers for dramatic low-poly chop
      const primary   = Math.sin(x * 0.35 + t * 1.2) * 0.55;
      const secondary = Math.cos(z * 0.45 + t * 0.9) * 0.35;
      const tertiary  = Math.sin((x + z) * 0.2 + t * 0.6) * 0.2;
      pos.setY(i, primary + secondary + tertiary);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geo} position={[0, -1.0, 0]}>
      <meshStandardMaterial
        color={isDark ? '#0a2a4a' : '#2E8BC0'}
        flatShading
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// Low-poly sand island
function Sand({ isDark }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(60, 30, 50, 25);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Layered noise: broad dunes + medium ripples + fine grain
      const dune   = Math.sin(x * 0.18) * Math.cos(z * 0.22) * 0.35;
      const ripple = Math.sin(x * 0.6 + z * 0.4) * 0.12;
      const grain  = (Math.random() - 0.5) * 0.08;
      pos.setY(i, Math.max(0, dune + ripple + grain));
    }
    return g;
  }, []);

  return (
    // Raised to Y=0.1 — always above water (which sits at Y=-1.0, peak ≈ -0.75)
    <mesh geometry={geo} position={[0, 0.1, 10]}>
      <meshStandardMaterial color={isDark ? '#3d3522' : '#F4D58D'} flatShading />
    </mesh>
  );
}

// Low-poly palm tree — yRotation varies leaf orientation per instance
function PalmTree({ position, scale = 1, yRotation = 0 }) {
  return (
    <group position={position} scale={scale} rotation={[0, yRotation, 0]}>
      {/* Trunk — 3 segments with slight lean for organic look */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.20, 0.28, 2.0, 7]} />
        <meshStandardMaterial color="#7a5510" flatShading />
      </mesh>
      <mesh position={[0.07, 2.6, 0]}>
        <cylinderGeometry args={[0.15, 0.20, 1.6, 7]} />
        <meshStandardMaterial color="#8B6914" flatShading />
      </mesh>
      <mesh position={[0.13, 3.9, 0.04]}>
        <cylinderGeometry args={[0.11, 0.15, 1.0, 6]} />
        <meshStandardMaterial color="#9a7820" flatShading />
      </mesh>
      {/* Fronds — 8 wide flat leaves spread radially from crown */}
      {Array.from({ length: 8 }, (_, i) => {
        const yAngle = (i / 8) * Math.PI * 2;
        const droop = 0.28 + (i % 3) * 0.07; // downward droop 0.28–0.42 rad
        return (
          // Group rotates around Y axis — each frond faces a different compass direction
          <group key={i} position={[0.13, 4.4, 0.04]} rotation={[0, yAngle, 0]}>
            {/* Wide flat box extending outward in local +Z, angled downward */}
            <mesh position={[0, -droop * 0.9, 1.1]} rotation={[-droop, 0, 0]}>
              <boxGeometry args={[0.42, 0.04, 2.5]} />
              <meshStandardMaterial
                color={`hsl(${114 + (i % 5) * 6}, 62%, ${24 + (i % 4) * 6}%)`}
                flatShading
              />
            </mesh>
          </group>
        );
      })}
      {/* Coconuts nestled at crown */}
      <mesh position={[0.13, 4.05, 0.2]}>
        <sphereGeometry args={[0.11, 5, 4]} />
        <meshStandardMaterial color="#5C4033" flatShading />
      </mesh>
      <mesh position={[-0.07, 4.12, -0.12]}>
        <sphereGeometry args={[0.09, 5, 4]} />
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
    ref.current.position.z = startPos[2] + Math.cos(t * 0.2) * 15;
    if (wingRef1.current) wingRef1.current.rotation.z = Math.sin(t * 4) * 0.4;
    if (wingRef2.current) wingRef2.current.rotation.z = -Math.sin(t * 4) * 0.4;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 4, 3]} />
        <meshStandardMaterial color="#f0f0f0" flatShading />
      </mesh>
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

// Campfire light glow (night only)
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

// Campfire mesh — rock ring, crossed logs, animated dual flame
function Campfire({ isDark }) {
  const flameRef1 = useRef();
  const flameRef2 = useRef();
  const rockAngles = useMemo(() => [0, 1.05, 2.09, 3.14, 4.19, 5.24], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (flameRef1.current) {
      flameRef1.current.scale.y = 1 + Math.sin(t * 6) * 0.2;
      flameRef1.current.scale.x = 1 + Math.cos(t * 5) * 0.1;
    }
    if (flameRef2.current) {
      flameRef2.current.scale.y = 1 + Math.sin(t * 7 + 1) * 0.25;
      flameRef2.current.scale.x = 1 + Math.cos(t * 4 + 0.5) * 0.12;
    }
  });

  return (
    <group position={[4, 0.15, 7]}>
      {/* Rock ring */}
      {rockAngles.map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.35, 0, Math.sin(angle) * 0.35]}>
          <dodecahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial color="#6a6a6a" flatShading />
        </mesh>
      ))}
      {/* Log A */}
      <mesh rotation={[Math.PI / 2, 0, 0.5]} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.7, 5]} />
        <meshStandardMaterial color="#5a3a1a" flatShading />
      </mesh>
      {/* Log B (crossed) */}
      <mesh rotation={[Math.PI / 2, 0, -0.5]} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.7, 5]} />
        <meshStandardMaterial color="#4a2a10" flatShading />
      </mesh>
      {/* Flame A (large, orange) */}
      <mesh ref={flameRef1} position={[0, 0.35, 0]}>
        <coneGeometry args={[0.12, 0.4, 5]} />
        <meshStandardMaterial
          color="#ff6600"
          emissive="#ff4400"
          emissiveIntensity={isDark ? 1.2 : 0.5}
          flatShading
        />
      </mesh>
      {/* Flame B (inner, yellow) */}
      <mesh ref={flameRef2} position={[0.04, 0.28, 0.02]}>
        <coneGeometry args={[0.07, 0.3, 4]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ffcc00"
          emissiveIntensity={isDark ? 1.0 : 0.4}
          flatShading
        />
      </mesh>
    </group>
  );
}

// Tiki torch with animated flame and night glow
function TikiTorch({ position, isDark }) {
  const flameRef = useRef();
  const lightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(t * 8 + position[0]) * 0.18;
      flameRef.current.scale.x = 1 + Math.cos(t * 6 + position[2]) * 0.1;
    }
    if (lightRef.current && isDark) {
      lightRef.current.intensity = 0.6 + Math.sin(t * 5 + position[0]) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Stick */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 1.5, 6]} />
        <meshStandardMaterial color="#7a4a1a" flatShading />
      </mesh>
      {/* Basket cup */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.09, 0.06, 0.2, 6]} />
        <meshStandardMaterial color="#c8a060" flatShading />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 1.73, 0]}>
        <coneGeometry args={[0.07, 0.22, 5]} />
        <meshStandardMaterial
          color="#ff7722"
          emissive="#ff5500"
          emissiveIntensity={isDark ? 1.0 : 0.3}
          flatShading
        />
      </mesh>
      {isDark && <pointLight ref={lightRef} position={[0, 1.7, 0]} color="#ff6600" intensity={0.6} distance={5} />}
    </group>
  );
}

// Tiki beach bar — bamboo posts, thatch roof, stools, counter bottles
function TikiBar({ isDark }) {
  const postColor = isDark ? '#5a3a1a' : '#8a5a2a';
  const woodColor = isDark ? '#4a2a10' : '#a0714f';
  const thatchColor = isDark ? '#3a4a20' : '#6a7a30';

  return (
    <group position={[7, 0.15, 10]}>
      {/* Corner posts */}
      {[[-1.2, 0, -0.65], [1.2, 0, -0.65], [-1.2, 0, 0.65], [1.2, 0, 0.65]].map(([x, , z], i) => (
        <mesh key={i} position={[x, 1.25, z]}>
          <cylinderGeometry args={[0.08, 0.1, 2.5, 6]} />
          <meshStandardMaterial color={postColor} flatShading />
        </mesh>
      ))}
      {/* Bar counter */}
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[2.6, 0.12, 0.9]} />
        <meshStandardMaterial color={woodColor} flatShading />
      </mesh>
      {/* Under-counter shelf */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[2.4, 0.07, 0.8]} />
        <meshStandardMaterial color={postColor} flatShading />
      </mesh>
      {/* Roof frame */}
      <mesh position={[0, 2.6, 0]}>
        <boxGeometry args={[3.0, 0.07, 1.5]} />
        <meshStandardMaterial color={postColor} flatShading />
      </mesh>
      {/* Thatch strips */}
      {[-0.5, -0.25, 0, 0.25, 0.5].map((zOff, i) => (
        <mesh key={i} position={[0, 2.65 + i * 0.03, zOff]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[3.1, 0.1, 0.3]} />
          <meshStandardMaterial color={thatchColor} flatShading />
        </mesh>
      ))}
      {/* Bar stools */}
      {[-0.85, 0, 0.85].map((xOff, i) => (
        <group key={i} position={[xOff, 0, 0.9]}>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.06, 7]} />
            <meshStandardMaterial color={woodColor} flatShading />
          </mesh>
          <mesh position={[0, 0.27, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.5, 5]} />
            <meshStandardMaterial color={postColor} flatShading />
          </mesh>
        </group>
      ))}
      {/* Bottles/cups on counter */}
      {[[-0.6, -0.15], [0.1, -0.15], [0.7, -0.15]].map(([xOff, zOff], i) => (
        <mesh key={i} position={[xOff, 1.44, zOff]}>
          <cylinderGeometry args={[0.04, 0.035, 0.18, 6]} />
          <meshStandardMaterial color={i === 1 ? '#88cc44' : '#cc8833'} flatShading />
        </mesh>
      ))}
      {isDark && <pointLight position={[0, 1.8, 0]} color="#ffbb44" intensity={0.8} distance={6} />}
    </group>
  );
}

// Beach umbrella — proper upright cone with 8 alternating red/white stripe sectors
function BeachUmbrella({ position, isDark }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.6, 6]} />
        <meshStandardMaterial color="#c0c0c0" flatShading />
      </mesh>
      {/* 8 alternating red/white cone sectors — tip at top, skirt fans downward */}
      {Array.from({ length: 8 }, (_, i) => {
        const thetaStart = (i / 8) * Math.PI * 2;
        const isRed = i % 2 === 0;
        return (
          <mesh key={i} position={[0, 2.55, 0]}>
            <coneGeometry args={[1.35, 1.4, 4, 1, false, thetaStart, Math.PI / 4]} />
            <meshStandardMaterial
              color={isDark
                ? (isRed ? '#881111' : '#999999')
                : (isRed ? '#CC1111' : '#FFFFFF')}
              side={THREE.DoubleSide}
              flatShading
            />
          </mesh>
        );
      })}
      {/* Metal tip at top */}
      <mesh position={[0, 3.28, 0]}>
        <sphereGeometry args={[0.07, 6, 4]} />
        <meshStandardMaterial color="#aaaaaa" flatShading />
      </mesh>
    </group>
  );
}

// Beach lounger — reclined seat with four legs
function Lounger({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.22, 0.1]}>
        <boxGeometry args={[0.65, 0.08, 1.0]} />
        <meshStandardMaterial color="#c8a870" flatShading />
      </mesh>
      {/* Back rest (reclined angle) */}
      <mesh position={[0, 0.42, 0.62]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[0.65, 0.06, 0.75]} />
        <meshStandardMaterial color="#c8a870" flatShading />
      </mesh>
      {/* Legs */}
      {[[-0.28, -0.5], [0.28, -0.5], [-0.28, 0.5], [0.28, 0.5]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.1, lz]}>
          <cylinderGeometry args={[0.025, 0.025, 0.25, 4]} />
          <meshStandardMaterial color="#a07840" flatShading />
        </mesh>
      ))}
    </group>
  );
}

// Surfboard lying on sand
function Surfboard({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Board body */}
      <mesh>
        <boxGeometry args={[0.28, 0.04, 1.55]} />
        <meshStandardMaterial color="#00CED1" flatShading />
      </mesh>
      {/* Racing stripe */}
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[0.08, 0.005, 1.2]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
      {/* Fin */}
      <mesh position={[0, -0.07, 0.5]}>
        <boxGeometry args={[0.02, 0.14, 0.22]} />
        <meshStandardMaterial color="#009999" flatShading />
      </mesh>
    </group>
  );
}

// Sandcastle — main tower with battlements and side towers
function Sandcastle({ position, isDark }) {
  const sandColor = isDark ? '#4a4028' : '#c8a830';
  return (
    <group position={position}>
      {/* Main tower */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 8]} />
        <meshStandardMaterial color={sandColor} flatShading />
      </mesh>
      {/* Battlements around top */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[Math.cos((i / 8) * Math.PI * 2) * 0.22, 0.68, Math.sin((i / 8) * Math.PI * 2) * 0.22]}>
          <boxGeometry args={[0.08, 0.12, 0.08]} />
          <meshStandardMaterial color={sandColor} flatShading />
        </mesh>
      ))}
      {/* Side towers */}
      <mesh position={[0.38, 0.2, 0]}>
        <cylinderGeometry args={[0.11, 0.14, 0.4, 6]} />
        <meshStandardMaterial color={sandColor} flatShading />
      </mesh>
      <mesh position={[-0.38, 0.2, 0]}>
        <cylinderGeometry args={[0.11, 0.14, 0.4, 6]} />
        <meshStandardMaterial color={sandColor} flatShading />
      </mesh>
      <mesh position={[0, 0.2, 0.38]}>
        <cylinderGeometry args={[0.11, 0.14, 0.4, 6]} />
        <meshStandardMaterial color={sandColor} flatShading />
      </mesh>
      {/* Flag on top */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.28, 4]} />
        <meshStandardMaterial color="#888888" flatShading />
      </mesh>
      <mesh position={[0.07, 0.96, 0]}>
        <boxGeometry args={[0.14, 0.08, 0.01]} />
        <meshStandardMaterial color="#cc2222" flatShading />
      </mesh>
    </group>
  );
}

// Beach towel — flat coloured rectangle with centre stripe
function BeachTowel({ position, rotation = [0, 0, 0], color = '#e03030' }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.7, 0.02, 1.4]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[0.15, 0.005, 1.4]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
    </group>
  );
}

// Bucket and spade on sand
function BucketSpade({ position }) {
  return (
    <group position={position}>
      {/* Bucket */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.24, 7]} />
        <meshStandardMaterial color="#e8c030" flatShading />
      </mesh>
      {/* Spade handle */}
      <mesh position={[0.24, 0.2, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.015, 0.015, 0.44, 5]} />
        <meshStandardMaterial color="#c87030" flatShading />
      </mesh>
      {/* Spade blade */}
      <mesh position={[0.37, 0.02, 0]} rotation={[0.1, 0, -0.4]}>
        <boxGeometry args={[0.1, 0.02, 0.12]} />
        <meshStandardMaterial color="#c87030" flatShading />
      </mesh>
    </group>
  );
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

      {!isDark && <Sky sunPosition={[50, 20, -30]} turbidity={8} rayleigh={2} />}

      <Water isDark={isDark} />
      <Sand isDark={isDark} />

      {/* Beach table and laptop */}
      <BeachTable />
      <LaptopModel navigateTo={navTarget} onActivity={onTerminalActivity} />

      {/* Palm trees — each with unique yRotation so leaves face different directions */}
      <PalmTree position={[-8, 0, 4]}   scale={1.2}  yRotation={0} />
      <PalmTree position={[9, 0, 6]}    scale={0.9}  yRotation={1.1} />
      <PalmTree position={[-12, 0, 8]}  scale={1.0}  yRotation={2.4} />
      <PalmTree position={[14, 0, 3]}   scale={0.7}  yRotation={0.7} />
      {/* Additional trees filling flanks and behind camera */}
      <PalmTree position={[-5, 0, 9]}   scale={0.85} yRotation={1.8} />
      <PalmTree position={[4, 0, 10]}   scale={1.0}  yRotation={3.1} />
      <PalmTree position={[-14, 0, 5]}  scale={0.75} yRotation={2.0} />
      <PalmTree position={[16, 0, 8]}   scale={0.9}  yRotation={0.5} />
      <PalmTree position={[-10, 0, 12]} scale={0.8}  yRotation={1.3} />
      <PalmTree position={[10, 0, 13]}  scale={1.1}  yRotation={2.7} />
      {/* Dense grove behind camera */}
      <PalmTree position={[0, 0, 17]}   scale={1.1}  yRotation={0.9} />
      <PalmTree position={[-7, 0, 18]}  scale={0.9}  yRotation={2.1} />
      <PalmTree position={[8, 0, 17]}   scale={0.85} yRotation={1.5} />
      <PalmTree position={[-2, 0, 22]}  scale={1.0}  yRotation={3.3} />
      <PalmTree position={[6, 0, 21]}   scale={0.75} yRotation={0.4} />
      <PalmTree position={[-11, 0, 20]} scale={0.95} yRotation={1.9} />

      {/* Rocks — front */}
      <Rock position={[-4, 0.1, 2]}  scale={1.5} color="#7a7a7a" />
      <Rock position={[6, 0.1, 0]}   scale={1.0} color="#8a8a7a" />
      <Rock position={[-7, 0.1, -1]} scale={0.8} color="#6a6a6a" />
      <Rock position={[11, 0.1, 1]}  scale={1.2} color="#7a7a6a" />
      {/* Rocks — behind camera */}
      <Rock position={[-6, 0.1, 11]} scale={1.3} color="#7a7a7a" />
      <Rock position={[3, 0.1, 13]}  scale={0.9} color="#8a8a7a" />
      <Rock position={[-1, 0.1, 19]} scale={1.1} color="#6a6a6a" />
      <Rock position={[9, 0.1, 15]}  scale={0.7} color="#7a7a6a" />

      {/* Seagulls */}
      <Seagull position={[3, 8, -5]} />
      <Seagull position={[-5, 10, -8]} />
      <Seagull position={[8, 9, -3]} />
      <Seagull position={[2, 9, 18]} />
      <Seagull position={[-6, 8, 22]} />

      {/* Clouds (day only) — distributed 360° */}
      {!isDark && (
        <>
          {/* Front */}
          <Cloud position={[-10, 12, -15]} scale={1.2} />
          <Cloud position={[8, 14, -20]}   scale={0.8} />
          <Cloud position={[0, 11, -25]}   scale={1.5} />
          <Cloud position={[18, 12, -35]}  scale={1.4} />
          {/* Behind camera */}
          <Cloud position={[5, 13, 30]}    scale={1.0} />
          <Cloud position={[-12, 11, 38]}  scale={1.3} />
          {/* Left side */}
          <Cloud position={[-35, 12, -5]}  scale={1.1} />
          <Cloud position={[-28, 14, 15]}  scale={0.9} />
          {/* Right side */}
          <Cloud position={[30, 13, 2]}    scale={1.2} />
          <Cloud position={[38, 11, -12]}  scale={0.8} />
        </>
      )}

      {/* Night elements */}
      <Stars visible={isDark} />
      <CampfireGlow visible={isDark} />

      {/* Campfire mesh (always visible — glows brighter at night) */}
      <Campfire isDark={isDark} />

      {/* Tiki torches framing the seating area */}
      <TikiTorch position={[-3, 0.1, 4]} isDark={isDark} />
      <TikiTorch position={[ 3, 0.1, 4]} isDark={isDark} />
      <TikiTorch position={[-3, 0.1, 7]} isDark={isDark} />
      <TikiTorch position={[ 3, 0.1, 7]} isDark={isDark} />
      <TikiTorch position={[-9, 0.1, 6]} isDark={isDark} />
      <TikiTorch position={[ 9, 0.1, 8]} isDark={isDark} />

      {/* Tiki bar — right-rear of camera */}
      <TikiBar isDark={isDark} />

      {/* Beach umbrella + lounger — left of table */}
      <BeachUmbrella position={[-5, 0.1, 5]} isDark={isDark} />
      <Lounger position={[-5.5, 0.1, 5.5]} rotation={[0, 0.3, 0]} />

      {/* Surfboard on sand */}
      <Surfboard position={[-2.5, 0.15, 4.5]} rotation={[0, 0.6, 0]} />

      {/* ── BEHIND CAMERA ─────────────────────────────────── */}

      {/* Sandcastles */}
      <Sandcastle position={[-3, 0.1, 14]} isDark={isDark} />
      <Sandcastle position={[5, 0.1, 18]}  isDark={isDark} />

      {/* Beach towels spread on sand */}
      <BeachTowel position={[2, 0.12, 12]}   rotation={[0, 0.4, 0]}  color="#e03030" />
      <BeachTowel position={[-4, 0.12, 16]}  rotation={[0, -0.2, 0]} color="#3050e0" />
      <BeachTowel position={[7, 0.12, 14]}   rotation={[0, 1.2, 0]}  color="#30a070" />

      {/* Buckets and spades near the sandcastles */}
      <BucketSpade position={[-2.2, 0.1, 14.6]} />
      <BucketSpade position={[5.7, 0.1, 17.3]} />

      {/* Second umbrella + lounger setup */}
      <BeachUmbrella position={[5, 0.1, 15]}   isDark={isDark} />
      <Lounger      position={[5.5, 0.1, 16]}  rotation={[0, -0.5, 0]} />

      {/* Extra tiki torches marking the back area */}
      <TikiTorch position={[-3, 0.1, 14]} isDark={isDark} />
      <TikiTorch position={[ 3, 0.1, 15]} isDark={isDark} />

      {/* String lights between flanking palm trees */}
      <StringLights
        startPoint={[-8, 3.8, 4]}
        endPoint={[9, 3.4, 6]}
        isDark={isDark}
        bulbCount={14}
      />

      {/* Custom camera controller */}
      <CameraController />
    </Canvas>
  );
}
