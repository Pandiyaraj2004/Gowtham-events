import React, { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { cameraCurve, lookAtCurve } from './cameraPath';
import { isZoneActive } from './zoneManager';
import { ZoneId } from './content/zoneRegistry';
import { createAmbientFieldMaterial } from './shaders/ambientField';
import { usePerfTier } from '../components/PerfTierProvider';
import { DISCIPLINE_EMBLEMS } from './content/ActOfferings.content';
import { getJourneyProgress } from './useJourneyScroll';

// ==========================================
// 1. Camera Controller Rig (reads progress in useFrame directly)
// ==========================================
interface CameraRigProps {
  reducedMotion: boolean;
}

const JourneyCameraRig: React.FC<CameraRigProps> = ({ reducedMotion }) => {
  const { camera, pointer } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 1.6, 6));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.3, 0));
  const mouseOffset = useRef(new THREE.Vector2(0, 0));

  useFrame((_, delta) => {
    const t = getJourneyProgress();

    // Spline trajectory points
    const targetPos = cameraCurve.getPointAt(t);
    const targetLookAt = lookAtCurve.getPointAt(t);

    // Cursor Parallax offset (damped)
    if (!reducedMotion) {
      mouseOffset.current.x = THREE.MathUtils.damp(mouseOffset.current.x, pointer.x * 0.35, 4, delta);
      mouseOffset.current.y = THREE.MathUtils.damp(mouseOffset.current.y, pointer.y * 0.2, 4, delta);
    }

    targetPos.x += mouseOffset.current.x;
    targetPos.y += mouseOffset.current.y;

    // Smooth camera motion
    const lerpFactor = Math.min(1, delta * 6);
    currentPos.current.lerp(targetPos, lerpFactor);
    currentLookAt.current.lerp(targetLookAt, lerpFactor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

// ==========================================
// 2. Ambient Shader Background Field
// ==========================================
const AmbientShaderPlane: React.FC = () => {
  const { camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => createAmbientFieldMaterial(), []);

  useFrame((state) => {
    const p = getJourneyProgress();
    if (meshRef.current) {
      meshRef.current.position.copy(camera.position);
      meshRef.current.quaternion.copy(camera.quaternion);
      meshRef.current.translateZ(-30);
    }
    material.uniforms.uProgress.value = p;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[120, 80]} />
    </mesh>
  );
};

// ==========================================
// High-Performance Visibility Container
// Keeps geometries in GPU memory without unmounting
// ==========================================
const ZoneContainer: React.FC<{
  zoneId: ZoneId;
  children: React.ReactNode;
}> = ({ zoneId, children }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const p = getJourneyProgress();
      const active = isZoneActive(zoneId, p);
      groupRef.current.visible = active;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

// ==========================================
// 3. Section 1: Arrival Centerpiece Arch
// ==========================================
const Arrival3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const goldMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#c9a24b'),
        metalness: 0.95,
        roughness: 0.16,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
      }),
    []
  );

  const glassRingMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#faeed4'),
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.6,
        transparent: true,
        opacity: 0.75,
        clearcoat: 1.0,
      }),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group position={[0, 1.2, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={groupRef}>
          {/* Main Continuous GE Proscenium Torus */}
          <mesh material={goldMaterial}>
            <torusGeometry args={[2.2, 0.08, 24, 64]} />
          </mesh>

          {/* Interlocked Orthogonal Arch */}
          <mesh material={goldMaterial} rotation={[Math.PI / 3, 0, Math.PI / 4]}>
            <torusGeometry args={[1.8, 0.06, 24, 64]} />
          </mesh>

          {/* Inner Optical Transmission Lens Ring */}
          <mesh material={glassRingMaterial}>
            <torusGeometry args={[1.3, 0.05, 24, 64]} />
          </mesh>

          {/* Core Gold Monogram Octahedron */}
          <mesh position={[0, 0, 0]} material={goldMaterial}>
            <octahedronGeometry args={[0.3, 1]} />
          </mesh>
        </group>
      </Float>

      {/* Floating Gold Sparkle Field */}
      <Sparkles count={35} scale={[6, 6, 6]} size={2.2} speed={0.4} color="#f4dca8" />
    </group>
  );
};

// ==========================================
// 4. Section 2: Story Milestone Helix
// ==========================================
const Story3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const goldMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#dfb75f'),
        metalness: 0.9,
        roughness: 0.2,
        emissive: new THREE.Color('#c9a24b'),
        emissiveIntensity: 0.25,
      }),
    []
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }
  });

  const nodePositions: [number, number, number][] = [
    [-1.8, 1.2, -1],
    [-0.8, 0.6, 0.5],
    [0.2, -0.2, -0.5],
    [1.2, -0.8, 0.8],
    [2.0, -1.4, -0.2],
  ];

  return (
    <group position={[0.5, 1.5, -4]}>
      <group ref={groupRef}>
        {/* Helical Ring */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.5, 0.04, 20, 64]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Milestone Node Spheres */}
        {nodePositions.map((pos, idx) => (
          <mesh key={idx} position={pos} material={goldMaterial}>
            <sphereGeometry args={[0.16, 16, 16]} />
          </mesh>
        ))}
      </group>
      <Sparkles count={25} scale={[5, 4, 5]} size={2} speed={0.3} color="#ecc474" />
    </group>
  );
};

// ==========================================
// 5. Section 3: Offerings Physical Emblems
// ==========================================
const Offerings3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const goldMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#c9a24b'),
        metalness: 0.95,
        roughness: 0.15,
        clearcoat: 1.0,
      }),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
    }
  });

  const emblemKeys = Object.keys(DISCIPLINE_EMBLEMS);

  return (
    <group position={[0, 1.8, -8]}>
      <group ref={groupRef}>
        {/* Outer Orbit Guide Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.2, 0.03, 16, 64]} />
          <meshStandardMaterial color="#a97d1f" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* Floating Emblems */}
        {emblemKeys.map((key, i) => {
          const angle = (i / emblemKeys.length) * Math.PI * 2;
          const radius = 3.2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          return (
            <mesh key={key} position={[x, Math.sin(i * 1.5) * 0.35, z]} material={goldMaterial}>
              <octahedronGeometry args={[0.26, 0]} />
            </mesh>
          );
        })}

        {/* Central Core */}
        <mesh>
          <dodecahedronGeometry args={[0.65, 0]} />
          <meshPhysicalMaterial
            color="#dfb75f"
            metalness={0.8}
            roughness={0.15}
            clearcoat={1.0}
          />
        </mesh>
      </group>

      <Sparkles count={30} scale={[6, 4, 6]} size={2} speed={0.35} color="#fdfaf3" />
    </group>
  );
};

// ==========================================
// 6. Sections 4 & 5: Proof & Moments 3D Depth Planes
// ==========================================
const Proof3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.12;
    }
  });

  return (
    <group position={[-1.0, 1.2, -12]}>
      <group ref={groupRef}>
        <mesh rotation={[0, 0, Math.PI / 6]}>
          <torusGeometry args={[2.8, 0.05, 16, 48]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0, -0.5]}>
          <ringGeometry args={[1.5, 2.0, 24]} />
          <meshStandardMaterial color="#a97d1f" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <Sparkles count={25} scale={[5, 4, 5]} size={2} speed={0.25} color="#ecc474" />
    </group>
  );
};

const Moments3D: React.FC = () => {
  return (
    <group position={[0, 0.8, -16]}>
      <Sparkles count={35} scale={[7, 5, 7]} size={2.2} speed={0.3} color="#c9a24b" />
    </group>
  );
};

// ==========================================
// 7. Sections 6 & 7: What's Next & Begin Atmosphere
// ==========================================
const WhatsNext3D: React.FC = () => {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.08;
    }
  });

  return (
    <group position={[0.5, 1.0, -20]}>
      <group ref={ref}>
        <mesh>
          <torusGeometry args={[3.5, 0.04, 16, 48]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      <Sparkles count={25} scale={[6, 4, 6]} size={2} speed={0.25} color="#f4dca8" />
    </group>
  );
};

const Begin3D: React.FC = () => {
  return (
    <group position={[0, 1.3, -24]}>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[2.0, 0.04, 20, 48]} />
        <meshStandardMaterial color="#c9a24b" metalness={0.95} roughness={0.15} />
      </mesh>
      <Sparkles count={30} scale={[5, 5, 5]} size={2.2} speed={0.2} color="#ecc474" />
    </group>
  );
};

// ==========================================
// 8. Main Scene Coordinator
// ==========================================
interface SceneContentProps {
  reducedMotion: boolean;
}

const SceneContent: React.FC<SceneContentProps> = ({ reducedMotion }) => {
  return (
    <>
      {/* 1. Camera Spline Controller */}
      <JourneyCameraRig reducedMotion={reducedMotion} />

      {/* 2. Ambient Procedural Background */}
      <AmbientShaderPlane />

      {/* 3. Physically-Based Lighting Rig */}
      <ambientLight intensity={0.65} color="#faeed4" />
      <directionalLight position={[10, 15, 10]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-10, 5, -10]} intensity={0.8} color="#c9a24b" />
      <pointLight position={[0, 2, 0]} intensity={1.2} color="#ecc474" distance={15} />

      {/* 4. Persistent 3D Geometries with zero-cost visibility toggling */}
      <ZoneContainer zoneId="arrival">
        <Arrival3D />
      </ZoneContainer>

      <ZoneContainer zoneId="story">
        <Story3D />
      </ZoneContainer>

      <ZoneContainer zoneId="offerings">
        <Offerings3D />
      </ZoneContainer>

      <ZoneContainer zoneId="proof">
        <Proof3D />
      </ZoneContainer>

      <ZoneContainer zoneId="moments">
        <Moments3D />
      </ZoneContainer>

      <ZoneContainer zoneId="whatsnext">
        <WhatsNext3D />
      </ZoneContainer>

      <ZoneContainer zoneId="begin">
        <Begin3D />
      </ZoneContainer>
    </>
  );
};

// ==========================================
// 9. Root Canvas Component (Memoized, zero re-renders during scroll)
// ==========================================
export const JourneyCanvas: React.FC = memo(() => {
  const { tier, reducedMotion, dpr } = usePerfTier();

  if (tier === 'low' || reducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-zinc-950 via-neutral-950 to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,162,75,0.12),transparent_70%)]" />
        <div className="absolute inset-0 grid-bg opacity-15" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
      <Canvas
        camera={{ position: [0, 1.6, 6], fov: 45, near: 0.1, far: 80 }}
        dpr={dpr}
        gl={{
          antialias: tier === 'high',
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <SceneContent reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
});

JourneyCanvas.displayName = 'JourneyCanvas';

export default JourneyCanvas;
