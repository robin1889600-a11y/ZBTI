import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function LetterO({ progress }: { progress: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = lerp(0, -4, progress);
    ref.current.position.y = lerp(0, 2, progress);
    ref.current.position.z = lerp(0, -1, progress);
    ref.current.rotation.z = lerp(0, Math.PI / 4, progress);
  });

  return (
    <group ref={ref}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.2}
          height={0.3}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={3}
        >
          O
          <meshPhysicalMaterial color="#C53030" metalness={0.3} roughness={0.2} />
        </Text3D>
      </Center>
    </group>
  );
}

function LetterE({ progress }: { progress: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = lerp(0, 4, progress);
    ref.current.position.y = lerp(0, 2, progress);
    ref.current.position.z = lerp(0, -1, progress);
    ref.current.rotation.x = lerp(0, Math.PI / 2, progress);
  });

  return (
    <group ref={ref}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.2}
          height={0.3}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={3}
        >
          E
          <meshPhysicalMaterial color="#1E3A5F" metalness={0.3} roughness={0.2} />
        </Text3D>
      </Center>
    </group>
  );
}

function LetterP({ progress }: { progress: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = lerp(0, -4, progress);
    ref.current.position.y = lerp(0, -2, progress);
    ref.current.position.z = lerp(0, 1, progress);
    ref.current.rotation.y = lerp(0, Math.PI, progress);
  });

  return (
    <group ref={ref}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.2}
          height={0.3}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={3}
        >
          P
          <meshPhysicalMaterial color="#6B8AC9" metalness={0.3} roughness={0.2} />
        </Text3D>
      </Center>
    </group>
  );
}

function LetterM({ progress }: { progress: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x = lerp(0, 4, progress);
    ref.current.position.y = lerp(0, -2, progress);
    ref.current.position.z = lerp(0, 1, progress);
    const s = lerp(1, 1.5, progress);
    ref.current.scale.set(s, s, s);
  });

  return (
    <group ref={ref}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.2}
          height={0.3}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={3}
        >
          M
          <meshPhysicalMaterial color="#C9CED6" metalness={0.3} roughness={0.2} />
        </Text3D>
      </Center>
    </group>
  );
}

function Scene() {
  const scrollProgress = useRef(0.4);

  // Scroll-driven progress tracking (useEffect for proper cleanup)
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) {
        containerRef.current = document.getElementById('scatter-container') as HTMLDivElement;
      }
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementHeight = el.offsetHeight;

      // progress: 0 when top hits viewport bottom, 1 when bottom hits viewport top
      const scrollRange = elementHeight + viewportHeight;
      const scrolled = viewportHeight - rect.top;
      // Start from 0.4 so letters are already partially spread
      scrollProgress.current = Math.max(0.4, Math.min(1, 0.4 + (scrolled / scrollRange) * 0.6));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(() => {
    // No per-frame updates needed beyond the children components
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, 0, 2]} intensity={1.5} color="#6B8AC9" />
      <LetterO progress={scrollProgress.current} />
      <LetterE progress={scrollProgress.current} />
      <LetterP progress={scrollProgress.current} />
      <LetterM progress={scrollProgress.current} />
    </>
  );
}

export default function DimensionScatter() {
  return (
    <div id="scatter-container" className="w-full h-full relative" style={{ background: 'linear-gradient(180deg, #F7F5F2 0%, rgba(107,138,201,0.06) 100%)' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
        <p className="text-xs text-[#C9CED6] tracking-widest uppercase">Scroll to explore</p>
      </div>
    </div>
  );
}
