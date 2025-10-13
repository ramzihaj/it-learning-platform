import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Text3D, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Composant Sphère 3D avec déformation
function AnimatedSphere() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 100, 200]} scale={2.4}>
        <MeshDistortMaterial
          color="#4f46e5"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

// Composant Particules flottantes
function FloatingParticles({ count = 100 }) {
  const mesh = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.025;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#60a5fa" transparent opacity={0.6} />
    </points>
  );
}

// Composant Texte 3D (si disponible)
function AnimatedText({ children, position = [0, 0, 0] }) {
  const textRef = useRef();
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Text3D
      ref={textRef}
      font="/fonts/helvetiker_regular.typeface.json"
      size={0.5}
      height={0.1}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.02}
      bevelOffset={0}
      bevelSegments={5}
      position={position}
    >
      {children}
      <meshNormalMaterial />
    </Text3D>
  );
}

// Composant principal Hero3D
function Hero3D() {
  return (
    <div className="w-full h-96 md:h-[500px] lg:h-[600px] relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4f46e5" />
        
        <AnimatedSphere />
        <FloatingParticles count={150} />
        
        {/* Contrôles orbitaux pour interaction */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Overlay de texte par-dessus le Canvas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            IT Learn Pro
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Apprenez sans limites avec nos cours interactifs et animations 3D
          </p>
        </div>
      </div>
      
      {/* Effet de particules CSS en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
}

export default Hero3D;
