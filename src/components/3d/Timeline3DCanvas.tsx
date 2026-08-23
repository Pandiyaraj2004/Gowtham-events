import React, { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getPerformanceTier, PerformanceTier } from '../../utils/performanceTier';

gsap.registerPlugin(ScrollTrigger);

interface Timeline3DProps {
  timelineContainerRef: React.RefObject<HTMLDivElement | null>;
  totalMilestones: number;
}

const TimelineOrbits: React.FC<{
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalMilestones: number;
}> = ({ containerRef, totalMilestones }) => {
  const groupRef = useRef<THREE.Group>(null);
  const activeNodeIndex = useRef(0);
  const nodeMaterials = useRef<THREE.MeshPhysicalMaterial[]>([]);

  // Calculate nodes positioned in a spiral / 3D helical path
  const nodes = useMemo(() => {
    const list = [];
    for (let i = 0; i < totalMilestones; i++) {
      const angle = (i / totalMilestones) * Math.PI * 2;
      const radius = 1.4;
      const x = Math.cos(angle) * radius;
      const y = (i - totalMilestones / 2) * 0.8;
      const z = Math.sin(angle) * radius;
      list.push({ x, y, z, id: i });
    }
    return list;
  }, [totalMilestones]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const activeIdx = Math.min(
            totalMilestones - 1,
            Math.floor(progress * totalMilestones)
          );
          activeNodeIndex.current = activeIdx;

          if (groupRef.current) {
            groupRef.current.rotation.y = progress * Math.PI * 2;
            groupRef.current.position.y = (progress - 0.5) * -2;
          }
        },
      });
    });

    return () => ctx.revert();
  }, [containerRef, totalMilestones]);

  useFrame(() => {
    nodeMaterials.current.forEach((mat, idx) => {
      if (!mat) return;
      const isActive = idx === activeNodeIndex.current;
      const targetEmissive = isActive ? 2.5 : 0.2;
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        targetEmissive,
        0.1
      );
    });
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
        {/* Central Connecting Tube / Spiral */}
        <mesh>
          <torusGeometry args={[1.4, 0.03, 16, 64]} />
          <meshPhysicalMaterial
            color="#c9a24b"
            metalness={0.9}
            roughness={0.3}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Milestone Nodes */}
        {nodes.map((node, i) => (
          <mesh key={node.id} position={[node.x, node.y, node.z]}>
            <sphereGeometry args={[0.14, 24, 24]} />
            <meshPhysicalMaterial
              ref={(el) => {
                if (el) nodeMaterials.current[i] = el;
              }}
              color="#c9a24b"
              emissive="#f4dca8"
              emissiveIntensity={0.2}
              metalness={0.95}
              roughness={0.12}
              clearcoat={0.9}
            />
          </mesh>
        ))}
      </Float>
    </group>
  );
};

export const Timeline3DCanvas: React.FC<Timeline3DProps> = ({
  timelineContainerRef,
  totalMilestones,
}) => {
  const tier = useMemo<PerformanceTier>(() => getPerformanceTier(), []);

  if (tier === 'low') {
    return null;
  }

  return (
    <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block pointer-events-none z-0 opacity-80">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: tier === 'high' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 4, 2]} intensity={1.5} color="#fff2db" />
          <pointLight position={[-2, -1, 1]} intensity={0.8} color="#c9a24b" />
          <TimelineOrbits
            containerRef={timelineContainerRef}
            totalMilestones={totalMilestones}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Timeline3DCanvas;
