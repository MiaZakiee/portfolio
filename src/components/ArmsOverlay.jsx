import { Canvas } from '@react-three/fiber';
import POVArms from './POVArms';

// Renders the POV arms in a separate transparent canvas layered above the
// main scene (including the Html terminal overlay), so hands always appear
// in front of the laptop screen.
export default function ArmsOverlay() {
  return (
    <Canvas
      camera={{ position: [0, 2.2, 6], fov: 60 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 50,
        pointerEvents: 'none',
      }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#fff5e6" />
      <POVArms />
    </Canvas>
  );
}
