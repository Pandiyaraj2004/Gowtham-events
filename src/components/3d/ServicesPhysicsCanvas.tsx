import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, RapierRigidBody } from '@react-three/rapier';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { getPerformanceTier, PerformanceTier } from '../../utils/performanceTier';

// Interactive Draggable / Physics Ring
const PhysicsRing: React.FC<{
  position: [number, number, number];
  color: string;
  size: number;
}> = ({ position, color, size }) => {
  const rigidRef = useRef<RapierRigidBody>(null);
  const isDragging = useRef(false);

  const handlePointerDown = () => {
    isDragging.current = true;
    if (rigidRef.current) {
      // Apply gentle impulse
      rigidRef.current.applyImpulse({ x: 0, y: 1.5, z: 0 }, true);
      rigidRef.current.applyTorqueImpulse(
        {
          x: (Math.random() - 0.5) * 0.8,
          y: (Math.random() - 0.5) * 0.8,
          z: (Math.random() - 0.5) * 0.8,
        },
        true
      );
    }
  };

  const handlePointerOver = () => {
    if (rigidRef.current) {
      rigidRef.current.applyImpulse(
        {
          x: (Math.random() - 0.5) * 0.4,
          y: 0.6,
          z: (Math.random() - 0.5) * 0.4,
        },
        true
      );
    }
  };

  return (
    <RigidBody
      ref={rigidRef}
      position={position}
      colliders="hull"
      restitution={0.7}
      friction={0.2}
      linearDamping={0.6}
      angularDamping={0.6}
    >
      <mesh
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        castShadow
        receiveShadow
      >
        <torusGeometry args={[size, size * 0.18, 32, 64]} />
        <meshPhysicalMaterial
          color={color}
          emissive="#382506"
          emissiveIntensity={0.3}
          metalness={0.94}
          roughness={0.15}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          reflectivity={0.95}
        />
      </mesh>
    </RigidBody>
  );
};

// Smooth Floating Rings for Mid Tier (No Rapier physics overhead)
const FloatingRingsMid: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh position={[-1.2, 0, 0]}>
          <torusGeometry args={[0.9, 0.12, 24, 48]} />
          <meshPhysicalMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[1.2, 0.2, 0]} rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[0.7, 0.1, 24, 48]} />
          <meshPhysicalMaterial color="#dfb75f" metalness={0.95} roughness={0.15} />
        </mesh>
      </Float>
    </group>
  );
};

export const ServicesPhysicsCanvas: React.FC = () => {
  const tier = useMemo<PerformanceTier>(() => getPerformanceTier(), []);

  if (tier === 'low') {
    return null;
  }

  return (
    <div className="w-full h-72 md:h-80 relative overflow-hidden rounded-3xl border border-neutral-200/50 dark:border-zinc-800/60 bg-gradient-to-b from-neutral-100/40 to-transparent dark:from-zinc-900/40 dark:to-transparent">
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Interactive Material Physics &bull; Touch & Drag
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: tier === 'high' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 5, 3]} intensity={1.5} color="#fff1d6" />
          <pointLight position={[-3, -2, 2]} intensity={1} color="#c9a24b" />
          <Environment preset="city" />

          {tier === 'high' ? (
            <Physics gravity={[0, -1.8, 0]}>
              {/* Invisible floor & ceiling bounds */}
              <RigidBody type="fixed" position={[0, -2.2, 0]}>
                <mesh visible={false}>
                  <boxGeometry args={[10, 0.4, 6]} />
                  <meshBasicMaterial />
                </mesh>
              </RigidBody>
              <RigidBody type="fixed" position={[0, 2.2, 0]}>
                <mesh visible={false}>
                  <boxGeometry args={[10, 0.4, 6]} />
                  <meshBasicMaterial />
                </mesh>
              </RigidBody>
              <RigidBody type="fixed" position={[-3.5, 0, 0]}>
                <mesh visible={false}>
                  <boxGeometry args={[0.4, 6, 6]} />
                  <meshBasicMaterial />
                </mesh>
              </RigidBody>
              <RigidBody type="fixed" position={[3.5, 0, 0]}>
                <mesh visible={false}>
                  <boxGeometry args={[0.4, 6, 6]} />
                  <meshBasicMaterial />
                </mesh>
              </RigidBody>

              {/* Interactive Physical Objects */}
              <PhysicsRing position={[-1.2, 0.5, 0]} color="#c9a24b" size={0.8} />
              <PhysicsRing position={[0.8, -0.3, 0.2]} color="#dfb75f" size={0.65} />
              <PhysicsRing position={[0, 1.2, -0.2]} color="#ecc474" size={0.5} />
            </Physics>
          ) : (
            <FloatingRingsMid />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ServicesPhysicsCanvas;
