import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroBackgroundMaterialShader } from './HeroShader';
import { getPerformanceTier, PerformanceTier } from '../../utils/performanceTier';

gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------------------------
// 1. Custom GLSL Background Shimmer Plane
// ----------------------------------------------------------------------
const BackgroundShimmer: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uGoldColor: { value: new THREE.Color('#c9a24b') },
      uDarkColor: { value: new THREE.Color('#0c0a08') },
      uAmbientGlow: { value: new THREE.Color('#2e1f0a') },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      // Lerp mouse position to shader
      const mx = (state.pointer.x + 1) * 0.5;
      const my = (state.pointer.y + 1) * 0.5;
      materialRef.current.uniforms.uMouse.value.lerp(new THREE.Vector2(mx, my), 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -8]}>
      <planeGeometry args={[30, 20]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={HeroBackgroundMaterialShader.vertexShader}
        fragmentShader={HeroBackgroundMaterialShader.fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

// ----------------------------------------------------------------------
// 2. Interlocked Architectural Proscenium Centerpiece
// ----------------------------------------------------------------------
const ArchCenterpiece: React.FC<{ tier: PerformanceTier }> = ({ tier }) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);

  // Subtle pointer-damped rotation
  useFrame((state) => {
    if (groupRef.current) {
      const targetRotX = -state.pointer.y * 0.18;
      const targetRotY = state.pointer.x * 0.25;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.04);
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
        {/* Primary Outer Arch (Gold Physical Material) */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1.8, 0.09, 32, 100, Math.PI * 1.6]} />
          <meshPhysicalMaterial
            color="#c9a24b"
            emissive="#45310a"
            emissiveIntensity={0.2}
            metalness={0.94}
            roughness={0.16}
            clearcoat={0.9}
            clearcoatRoughness={0.1}
            reflectivity={0.9}
          />
        </mesh>

        {/* Secondary Interlocking Arch (Echoing 'G' and 'E' monogram) */}
        <mesh position={[0.45, -0.2, 0.3]} rotation={[0.4, 0.3, Math.PI * 0.85]}>
          <torusGeometry args={[1.4, 0.07, 32, 100, Math.PI * 1.5]} />
          <meshPhysicalMaterial
            color="#dfb75f"
            emissive="#382506"
            emissiveIntensity={0.25}
            metalness={0.96}
            roughness={0.14}
            clearcoat={0.95}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* Cross Proscenium Beam */}
        <mesh position={[-0.2, 0.8, -0.1]} rotation={[0, 0, Math.PI * 0.15]}>
          <cylinderGeometry args={[0.045, 0.045, 2.8, 32]} />
          <meshPhysicalMaterial
            color="#c9a24b"
            metalness={0.92}
            roughness={0.2}
            clearcoat={0.8}
          />
        </mesh>

        {/* Inner Glass Lens / Ring with Transmission */}
        <group ref={innerRingRef} position={[0, 0, -0.1]}>
          {tier === 'high' ? (
            <mesh>
              <torusGeometry args={[1.1, 0.05, 32, 80]} />
              <MeshTransmissionMaterial
                backside
                samples={4}
                thickness={0.3}
                chromaticAberration={0.08}
                anisotropy={0.1}
                distortion={0.2}
                distortionScale={0.3}
                temporalDistortion={0.1}
                ior={1.5}
                color="#f8ecd0"
              />
            </mesh>
          ) : (
            <mesh>
              <torusGeometry args={[1.1, 0.05, 24, 60]} />
              <meshPhysicalMaterial
                color="#f8ecd0"
                transmission={0.85}
                opacity={0.85}
                transparent
                roughness={0.1}
                ior={1.45}
              />
            </mesh>
          )}
        </group>
      </Float>
    </group>
  );
};

// ----------------------------------------------------------------------
// 3. Instanced Gold Particles Field
// ----------------------------------------------------------------------
const InstancedGoldParticles: React.FC<{ count: number }> = ({ count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 8 - 1;
      const scale = Math.random() * 0.035 + 0.015;
      const speed = Math.random() * 0.2 + 0.1;
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
        p.x + Math.sin(time * p.speed + p.offset) * 0.3,
        p.y + Math.cos(time * p.speed + p.offset) * 0.4,
        p.z + Math.sin(time * 0.2 + p.offset) * 0.2
      );
      dummy.scale.setScalar(p.scale);
      dummy.rotation.set(time * 0.2, time * 0.3, 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshPhysicalMaterial
        color="#c9a24b"
        emissive="#f4dca8"
        emissiveIntensity={1.5}
        metalness={0.9}
        roughness={0.1}
      />
    </instancedMesh>
  );
};

// ----------------------------------------------------------------------
// 4. Scroll Choreographed Camera Controller
// ----------------------------------------------------------------------
const CameraScrollRig: React.FC<{ scrollContainerRef: React.RefObject<HTMLDivElement | null> }> = ({
  scrollContainerRef,
}) => {
  const { camera } = useThree();

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const ctx = gsap.context(() => {
      // ScrollTrigger scrubs camera position and subtle rotation
      gsap.to(camera.position, {
        z: 3.2,
        y: -0.6,
        x: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      gsap.to(camera.rotation, {
        x: 0.12,
        y: -0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    });

    return () => ctx.revert();
  }, [camera, scrollContainerRef]);

  return null;
};

// ----------------------------------------------------------------------
// 5. Post Processing Stack
// ----------------------------------------------------------------------
const PostEffects: React.FC<{ tier: PerformanceTier }> = ({ tier }) => {
  if (tier === 'low') return null;

  return (
    <EffectComposer multisampling={tier === 'high' ? 4 : 0}>
      {/* Bloom specifically targeted to gold emissive tones */}
      <Bloom
        luminanceThreshold={0.65}
        luminanceSmoothing={0.4}
        intensity={tier === 'high' ? 0.9 : 0.6}
        radius={0.7}
      />
      {tier === 'high' && (
        <>
          <ChromaticAberration
            offset={new THREE.Vector2(0.0008, 0.0008)}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.25} darkness={0.6} />
          <Noise opacity={0.018} />
        </>
      )}
    </EffectComposer>
  );
};

// ----------------------------------------------------------------------
// 6. Static Luxury Fallback Poster (Low Tier / Reduced Motion)
// ----------------------------------------------------------------------
const StaticPosterFallback: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
    {/* Dark luxury radial glow */}
    <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-500/15 via-amber-600/5 to-transparent blur-[120px]" />
    
    {/* High-res rendered monogram proscenium illustration */}
    <svg
      className="w-72 sm:w-96 h-72 sm:h-96 text-amber-500/80 drop-shadow-[0_0_40px_rgba(201,162,75,0.4)] animate-pulse-slow"
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
      <path
        d="M68 28a22 22 0 1 0 0 44h-14v-16M32 72a22 22 0 1 0 0-44h14v16"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// ----------------------------------------------------------------------
// 7. Main Hero 3D Component
// ----------------------------------------------------------------------
interface HeroCanvasProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ containerRef }) => {
  const tier = useMemo<PerformanceTier>(() => getPerformanceTier(), []);

  if (tier === 'low') {
    return <StaticPosterFallback />;
  }

  const particleCount = tier === 'high' ? 110 : 50;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: tier === 'high',
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#0c0a08']} />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 6, 4]} intensity={1.8} color="#fff4db" />
          <pointLight position={[-4, -3, 2]} intensity={1.2} color="#c9a24b" />
          <pointLight position={[3, -2, -2]} intensity={0.8} color="#ecc474" />

          {/* HDR Environment */}
          <Environment preset="city" />

          {/* Background Shimmer & 3D Centerpiece */}
          <BackgroundShimmer />
          <ArchCenterpiece tier={tier} />
          <InstancedGoldParticles count={particleCount} />

          {/* Scroll & Parallax Controller */}
          <CameraScrollRig scrollContainerRef={containerRef} />

          {/* Post Processing */}
          <PostEffects tier={tier} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
