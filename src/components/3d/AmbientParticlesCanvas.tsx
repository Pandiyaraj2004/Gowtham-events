import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPerformanceTier, PerformanceTier } from '../../utils/performanceTier';

const ParticlesField: React.FC<{ count: number }> = ({ count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 6 - 2;
      const scale = Math.random() * 0.03 + 0.01;
      const speed = Math.random() * 0.15 + 0.05;
      const offset = Math.random() * Math.PI * 2;
      temp.push({ x, y, z, scale, speed, offset });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(time * p.speed + p.offset) * 0.2,
        p.y + Math.cos(time * p.speed + p.offset) * 0.3,
        p.z
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#c9a24b" transparent opacity={0.6} />
    </instancedMesh>
  );
};

export const AmbientParticlesCanvas: React.FC = () => {
  const tier = useMemo<PerformanceTier>(() => getPerformanceTier(), []);

  if (tier === 'low') {
    return null;
  }

  const count = tier === 'high' ? 60 : 30;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false }}
      >
        <Suspense fallback={null}>
          <ParticlesField count={count} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AmbientParticlesCanvas;
