import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { cameraCurve, lookAtCurve } from './cameraPath';
import { isZoneActive } from './zoneManager';
import { createAmbientFieldMaterial } from './shaders/ambientField';
import { usePerfTier, PerfTier } from '../components/PerfTierProvider';
import { DISCIPLINE_EMBLEMS } from './content/ActOfferings.content';

// ==========================================
// 1. Camera Controller Rig
// ==========================================
interface CameraRigProps {
  progress: number;
  reducedMotion: boolean;
}

const JourneyCameraRig: React.FC<CameraRigProps> = ({ progress, reducedMotion }) => {
  const { camera, pointer } = useThree();
  const currentPos = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const mouseOffset = useRef(new THREE.Vector2(0, 0));

  useFrame((_, delta) => {
    const t = Math.max(0, Math.min(1, progress));

    // Spline trajectory points
    const targetPos = cameraCurve.getPointAt(t);
    const targetLookAt = lookAtCurve.getPointAt(t);

    // Cursor Parallax offset (damped)
    if (!reducedMotion) {
      mouseOffset.current.x = THREE.MathUtils.damp(mouseOffset.current.x, pointer.x * 0.4, 4, delta);
      mouseOffset.current.y = THREE.MathUtils.damp(mouseOffset.current.y, pointer.y * 0.25, 4, delta);
    }

    targetPos.x += mouseOffset.current.x;
    targetPos.y += mouseOffset.current.y;

    // Smooth camera motion
    currentPos.current.lerp(targetPos, Math.min(1, delta * 5));
    currentLookAt.current.lerp(targetLookAt, Math.min(1, delta * 5));

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

// ==========================================
// 2. Ambient Shader Background Field
// ==========================================
const AmbientShaderPlane: React.FC<{ progress: number }> = ({ progress }) => {
  const { camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => createAmbientFieldMaterial(), []);

  useFrame((state) => {
    if (meshRef.current) {
      // Keep background positioned directly behind camera along look vector
      meshRef.current.position.copy(camera.position);
      meshRef.current.quaternion.copy(camera.quaternion);
      meshRef.current.translateZ(-30);
    }
    material.uniforms.uProgress.value = progress;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[120, 80]} />
    </mesh>
  );
};

// ==========================================
// 3. Act I: Arrival Centerpiece Arch
// ==========================================
const ActIArrival3D: React.FC = () => {
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
            <torusGeometry args={[2.2, 0.08, 32, 100]} />
          </mesh>

          {/* Interlocked Orthogonal Arch */}
          <mesh material={goldMaterial} rotation={[Math.PI / 3, 0, Math.PI / 4]}>
            <torusGeometry args={[1.8, 0.06, 32, 100]} />
          </mesh>

          {/* Inner Optical Transmission Lens Ring */}
          <mesh>
            <torusGeometry args={[1.3, 0.05, 32, 80]} />
            <MeshTransmissionMaterial
              backside
              samples={4}
              thickness={0.5}
              chromaticAberration={0.06}
              anisotropy={0.2}
              distortion={0.3}
              color="#faeed4"
              ior={1.4}
            />
          </mesh>

          {/* Core Gold Monogram Sphere */}
          <mesh position={[0, 0, 0]} material={goldMaterial}>
            <octahedronGeometry args={[0.3, 2]} />
          </mesh>
        </group>
      </Float>

      {/* Floating Gold Sparkle Field */}
      <Sparkles count={45} scale={[6, 6, 6]} size={2.5} speed={0.4} color="#f4dca8" />
    </group>
  );
};

// ==========================================
// 4. Act II: Story Milestone Helix
// ==========================================
const ActIIStory3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const goldMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#dfb75f'),
        metalness: 0.9,
        roughness: 0.2,
        emissive: new THREE.Color('#c9a24b'),
        emissiveIntensity: 0.3,
      }),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
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
          <torusGeometry args={[2.5, 0.04, 24, 80]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Milestone Node Spheres */}
        {nodePositions.map((pos, idx) => (
          <mesh key={idx} position={pos} material={goldMaterial}>
            <sphereGeometry args={[0.16, 24, 24]} />
          </mesh>
        ))}
      </group>
      <Sparkles count={30} scale={[5, 4, 5]} size={2} speed={0.3} color="#ecc474" />
    </group>
  );
};

// ==========================================
// 5. Act III: Offerings Physical Emblems
// ==========================================
const ActIIIOfferings3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const emblemKeys = Object.keys(DISCIPLINE_EMBLEMS);

  return (
    <group position={[0, 1.8, -8]}>
      <group ref={groupRef}>
        {/* Outer Orbit Guide Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.2, 0.03, 16, 80]} />
          <meshStandardMaterial color="#a97d1f" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* Floating Emblems */}
        {emblemKeys.map((key, i) => {
          const angle = (i / emblemKeys.length) * Math.PI * 2;
          const radius = 3.2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          return (
            <mesh key={key} position={[x, Math.sin(i * 1.5) * 0.4, z]}>
              <octahedronGeometry args={[0.28, 0]} />
              <meshPhysicalMaterial
                color="#c9a24b"
                metalness={0.95}
                roughness={0.15}
                clearcoat={1.0}
              />
            </mesh>
          );
        })}

        {/* Central Core Sphere */}
        <mesh>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshPhysicalMaterial
            color="#dfb75f"
            metalness={0.8}
            roughness={0.1}
            transmission={0.4}
            thickness={0.8}
          />
        </mesh>
      </group>

      <Sparkles count={40} scale={[7, 4, 7]} size={2.2} speed={0.4} color="#fdfaf3" />
    </group>
  );
};

// ==========================================
// 6. Act IV & V: Proof & Moments 3D Depth Planes
// ==========================================
const ActIVProof3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  return (
    <group position={[-1.0, 1.2, -12]}>
      <group ref={groupRef}>
        {/* Curated Frame Ring */}
        <mesh rotation={[0, 0, Math.PI / 6]}>
          <torusGeometry args={[2.8, 0.05, 16, 64]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0, -0.5]}>
          <ringGeometry args={[1.5, 2.0, 32]} />
          <meshStandardMaterial color="#a97d1f" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <Sparkles count={35} scale={[6, 5, 6]} size={2} speed={0.3} color="#ecc474" />
    </group>
  );
};

const ActVMoments3D: React.FC = () => {
  return (
    <group position={[0, 0.8, -16]}>
      <Sparkles count={50} scale={[8, 6, 8]} size={2.5} speed={0.35} color="#c9a24b" />
    </group>
  );
};

// ==========================================
// 7. Act VI & VII: What's Next & Begin Atmosphere
// ==========================================
const ActVIWhatsNext3D: React.FC = () => {
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
          <torusGeometry args={[3.5, 0.04, 16, 64]} />
          <meshStandardMaterial color="#c9a24b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      <Sparkles count={35} scale={[7, 5, 7]} size={2.2} speed={0.3} color="#f4dca8" />
    </group>
  );
};

const ActVIIBegin3D: React.FC = () => {
  return (
    <group position={[0, 1.3, -24]}>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[2.0, 0.04, 24, 64]} />
        <meshStandardMaterial color="#c9a24b" metalness={0.95} roughness={0.15} />
      </mesh>
      <Sparkles count={40} scale={[6, 6, 6]} size={2.5} speed={0.25} color="#ecc474" />
    </group>
  );
};

// ==========================================
// 8. Main Scene Coordinator
// ==========================================
interface SceneContentProps {
  progress: number;
  tier: PerfTier;
  reducedMotion: boolean;
}

const SceneContent: React.FC<SceneContentProps> = ({ progress, tier: _tier, reducedMotion }) => {
  return (
    <>
      {/* 1. Camera Spline Controller */}
      <JourneyCameraRig progress={progress} reducedMotion={reducedMotion} />

      {/* 2. Ambient Procedural Background */}
      <AmbientShaderPlane progress={progress} />

      {/* 3. Physically-Based Lighting Rig */}
      <ambientLight intensity={0.65} color="#faeed4" />
      <directionalLight position={[10, 15, 10]} intensity={1.8} color="#ffffff" castShadow />
      <directionalLight position={[-10, 5, -10]} intensity={0.8} color="#c9a24b" />
      <pointLight position={[0, 2, 0]} intensity={1.2} color="#ecc474" distance={15} />

      {/* 4. Dynamic Zone Geometries (Mount/Dispose via Scroll Proximity) */}
      <Suspense fallback={null}>
        {isZoneActive('arrival', progress) && <ActIArrival3D />}
        {isZoneActive('story', progress) && <ActIIStory3D />}
        {isZoneActive('offerings', progress) && <ActIIIOfferings3D />}
        {isZoneActive('proof', progress) && <ActIVProof3D />}
        {isZoneActive('moments', progress) && <ActVMoments3D />}
        {isZoneActive('whatsnext', progress) && <ActVIWhatsNext3D />}
        {isZoneActive('begin', progress) && <ActVIIBegin3D />}
      </Suspense>
    </>
  );
};

// ==========================================
// 9. Root Canvas Component
// ==========================================
interface JourneyCanvasProps {
  progress: number;
}

export const JourneyCanvas: React.FC<JourneyCanvasProps> = ({ progress }) => {
  const { tier, reducedMotion, dpr } = usePerfTier();

  // On Low tier or prefers-reduced-motion, do not mount WebGL canvas to preserve resources
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
        camera={{ position: [0, 1.6, 6], fov: 45, near: 0.1, far: 100 }}
        dpr={dpr}
        gl={{
          antialias: tier === 'high',
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
        }}
      >
        <SceneContent progress={progress} tier={tier} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};

export default JourneyCanvas;
