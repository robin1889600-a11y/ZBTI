import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Pattern config ───────────────────────────────────────────
interface PatternConfig {
  src: string;
  scale: [number, number, number];
  rotZ: number;
  floatAmp: number;
  floatSpeed: number;
  floatPhase: number;
  desktopPos: [number, number, number];
  mobilePos: [number, number, number];
}

const PATTERNS: PatternConfig[] = [
  {
    src: '/pattern1.png',
    scale: [0.55, 0.55, 1],
    rotZ: 12,
    floatAmp: 0.05,
    floatSpeed: 0.5,
    floatPhase: 0,
    desktopPos: [-2.6, 1.5, 0],
    mobilePos: [-0.75, 1.35, 0],
  },
  {
    src: '/pattern2.png',
    scale: [0.62, 0.62, 1],
    rotZ: -8,
    floatAmp: 0.04,
    floatSpeed: 0.4,
    floatPhase: 1.5,
    desktopPos: [2.6, 1.5, 0],
    mobilePos: [0.75, 1.35, 0],
  },
  {
    src: '/pattern3.png',
    scale: [0.62, 0.62, 1],
    rotZ: 6,
    floatAmp: 0.045,
    floatSpeed: 0.6,
    floatPhase: 2.5,
    desktopPos: [-2.4, -1.5, 0],
    mobilePos: [-0.65, -1.45, 0],
  },
  {
    src: '/pattern4.png',
    scale: [0.62, 0.62, 1],
    rotZ: -10,
    floatAmp: 0.04,
    floatSpeed: 0.35,
    floatPhase: 3.5,
    desktopPos: [2.4, -1.5, 0],
    mobilePos: [0.65, -1.45, 0],
  },
];

// ─── Single floating pattern ──────────────────────────────────
function FloatingPattern({ config }: { config: PatternConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, config.src);

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const { viewport } = useThree();
  const isMobile = viewport.width < 3;

  const targetPos = useMemo(() => {
    return isMobile ? config.mobilePos : config.desktopPos;
  }, [isMobile, config.mobilePos, config.desktopPos]);

  const initialRot = useMemo(() => (config.rotZ * Math.PI) / 180, [config.rotZ]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y =
      targetPos[1] + Math.sin(t * config.floatSpeed + config.floatPhase) * config.floatAmp;
    meshRef.current.rotation.z =
      initialRot + Math.sin(t * 0.2 + config.floatPhase) * 0.03;
  });

  return (
    <mesh
      ref={meshRef}
      position={[targetPos[0], targetPos[1], targetPos[2]]}
      scale={config.scale}
      rotation={[0, 0, initialRot]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.45}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Scene content ────────────────────────────────────────────
function SceneContent() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotation = useMemo(() => new THREE.Euler(0, 0, 0), []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, targetRotation.x, 0.05
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, targetRotation.y, 0.05
    );
  });

  const handlePointerMove = (e: THREE.Event & { pointer: { x: number; y: number } }) => {
    const nativeEvent = e as unknown as { pointer: { x: number; y: number } };
    mouseRef.current.x = nativeEvent.pointer.x;
    mouseRef.current.y = nativeEvent.pointer.y;
    targetRotation.x = nativeEvent.pointer.y * 0.03;
    targetRotation.y = nativeEvent.pointer.x * 0.03;
  };

  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} />
      {PATTERNS.map((config, i) => (
        <FloatingPattern key={i} config={config} />
      ))}
    </group>
  );
}

// ─── Main export ──────────────────────────────────────────────
export default function GeometricScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
