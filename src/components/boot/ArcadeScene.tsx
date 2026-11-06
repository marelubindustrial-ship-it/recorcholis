'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';

interface SimpleSceneProps {
  /** 0 → intro (lejana), 1 → zoom final dentro del dashboard */
  progress: number;
}

/** 
 * Loader tipo Videojuego: Una moneda Arcade flotante girando.
 * Es un modelo 3D muy ligero y clásico para pantallas de carga.
 */
function GameLoaderToken() {
  const coinRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (coinRef.current) {
      // Giro constante estilo "Loading..." de videojuego clásico
      coinRef.current.rotation.y = clock.getElapsedTime() * 2.5; 
    }
  });

  return (
    <Float speed={4} rotationIntensity={0.3} floatIntensity={1.5}>
      <group ref={coinRef} rotation={[0.2, 0, 0]}>
        
        {/* Cuerpo de la moneda roja */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.25, 32]} />
          <meshStandardMaterial color="#FF003C" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Anillo plateado interior (detalle Arcade) */}
        <mesh>
          <torusGeometry args={[1.2, 0.06, 16, 32]} />
          <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Letra R - Frente */}
        <Text position={[0, 0, 0.13]} fontSize={1.4} color="#ffffff" fontWeight="900">
          R
        </Text>
        
        {/* Letra R - Reverso */}
        <Text position={[0, 0, -0.13]} rotation={[0, Math.PI, 0]} fontSize={1.4} color="#ffffff" fontWeight="900">
          R
        </Text>
        
      </group>
    </Float>
  );
}

/**
 * Cámara sencilla: Hace un acercamiento (zoom in) cuando 'progress' avanza.
 */
function CameraRig({ progress }: SimpleSceneProps) {
  useFrame(({ camera }, delta) => {
    // Cuando progress es 0, la moneda está lejos (Z=10). Cuando es 1, la cámara se mete en la pantalla (Z=2)
    const targetZ = THREE.MathUtils.lerp(10, 2, progress);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4, delta);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function ArcadeScene({ progress }: SimpleSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]} // Soporte para pantallas de alta resolución
      camera={{ position: [0, 0, 10], fov: 45 }}
      className="!absolute inset-0"
      aria-hidden="true"
    >
      {/* Fondo fundido a negro */}
      <fog attach="fog" args={['#000000', 5, 15]} />
      
      {/* Iluminación básica y rápida de procesar */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-5, -5, 2]} intensity={2} color="#FF003C" /> {/* Luz roja de rebote */}

      {/* El Token de carga */}
      <GameLoaderToken />

      {/* Partículas tipo chispas/estrellas de juego */}
      <Sparkles count={40} scale={10} size={3} speed={0.4} color="#FF003C" opacity={0.8} />
      <Sparkles count={20} scale={8} size={1.5} speed={0.6} color="#ffffff" opacity={0.6} />

      {/* Manejador de Zoom para el Dashboard */}
      <CameraRig progress={progress} />
    </Canvas>
  );
}