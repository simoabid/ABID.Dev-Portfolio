'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, OrbitControls } from '@react-three/drei';

function SceneLoadingFallback() {
  return (
    <Html center>
      <div className="rounded-xl border border-white/20 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
        Loading scene...
      </div>
    </Html>
  );
}

function PlaceholderHelmetScene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[3.5, 4.5, 3]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        position={[-4, 5, -2]}
        intensity={0.8}
        angle={0.45}
        penumbra={0.6}
      />

      <group position={[0, 0.2, 0]}>
        <mesh castShadow receiveShadow rotation={[0.2, 0.65, 0]}>
          <icosahedronGeometry args={[1.05, 1]} />
          <meshStandardMaterial
            color="#9ba9ff"
            roughness={0.28}
            metalness={0.68}
          />
        </mesh>

        <mesh position={[0, -0.15, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.72, 0.065, 16, 72]} />
          <meshStandardMaterial
            color="#44d8ff"
            roughness={0.22}
            metalness={0.78}
            emissive="#0b2931"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      <mesh
        receiveShadow
        position={[0, -1.25, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[3.4, 64]} />
        <meshStandardMaterial
          color="#090f1c"
          roughness={0.88}
          metalness={0.18}
        />
      </mesh>

      <Environment preset="city" />

      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={4.8}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(Math.PI * 2) / 3}
        rotateSpeed={0.8}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  );
}

export default function HelmetViewer() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#070b14]">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.35, 3.45], fov: 45 }}
      >
        <color attach="background" args={['#070b14']} />
        <fog attach="fog" args={['#070b14', 5.5, 13]} />
        <Suspense fallback={<SceneLoadingFallback />}>
          <PlaceholderHelmetScene />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-black/45 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
        Drag to rotate
      </div>
    </div>
  );
}
