import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RedCone() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = 1.2 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={[-2.5, 1.2, 0]} rotation={[0, 0, 0.2]} castShadow>
      <coneGeometry args={[0.8, 1.5, 4]} />
      <meshPhysicalMaterial
        color="#C53030"
        metalness={0.1}
        roughness={0.2}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

function NavyCapsule() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = 0.5 + Math.sin(clock.getElapsedTime() * 0.4 + 1) * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} position={[2.0, 0.5, 0.5]} rotation={[0, 0, -0.4]} castShadow>
      <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
      <meshPhysicalMaterial
        color="#1E3A5F"
        metalness={0.4}
        roughness={0.1}
        clearcoat={0.5}
      />
    </mesh>
  );
}

function BlueCapsule() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = -1.5 + Math.sin(clock.getElapsedTime() * 0.6 + 2) * 0.09;
    }
  });

  return (
    <mesh ref={meshRef} position={[1.2, -1.5, 1.0]} rotation={[0, 0, 1.0]} castShadow>
      <capsuleGeometry args={[0.25, 0.9, 4, 8]} />
      <meshPhysicalMaterial
        color="#6B8AC9"
        metalness={0.3}
        roughness={0.15}
        clearcoat={0.5}
      />
    </mesh>
  );
}

function BlueIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = -0.8 + Math.sin(clock.getElapsedTime() * 0.35 + 3) * 0.07;
      meshRef.current.rotation.y -= 0.003;
      meshRef.current.rotation.x += 0.002;
    }
  });

  return (
    <mesh ref={meshRef} position={[-1.5, -0.8, 1.5]} castShadow>
      <icosahedronGeometry args={[0.6, 0]} />
      <meshPhysicalMaterial
        color="#6B8AC9"
        metalness={0.2}
        roughness={0.1}
        flatShading
        clearcoat={0.3}
      />
    </mesh>
  );
}

function SceneContent() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const targetRotation = useMemo(() => new THREE.Euler(0, 0, 0), []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.x,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.y,
        0.05
      );
    }
  });

  // Track mouse for parallax effect
  const handlePointerMove = (e: THREE.Event & { pointer: { x: number; y: number } }) => {
    const nativeEvent = e as unknown as { pointer: { x: number; y: number } };
    mouseRef.current.x = nativeEvent.pointer.x;
    mouseRef.current.y = nativeEvent.pointer.y;
    targetRotation.x = nativeEvent.pointer.y * 0.05;
    targetRotation.y = nativeEvent.pointer.x * 0.05;
  };

  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <pointLight position={[-5, 0, 2]} intensity={2.0} color="#6B8AC9" />
      <RedCone />
      <NavyCapsule />
      <BlueCapsule />
      <BlueIcosahedron />
    </group>
  );
}

export default function GeometricScene() {
  return (
    <div className="absolute inset-0 z-0">
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
