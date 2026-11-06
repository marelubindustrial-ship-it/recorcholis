'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment } from '@react-three/drei';
import { Gift, X } from 'lucide-react';
import HUDNav from '@/components/layout/HUDNav';
import Footer from '@/components/layout/Footer';

// --- FONDO DE GEL ROJO 3D (SÓLO SE MUEVE CON EL MOUSE/DEDO) ---
function GelBackground() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const targetRot = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!sphereRef.current) return;
    
    // Posición: Sigue al mouse/dedo de forma fluida
    const targetX = state.pointer.x * 2;
    const targetY = state.pointer.y * 2;
    sphereRef.current.position.x = THREE.MathUtils.lerp(sphereRef.current.position.x, targetX, 0.08);
    sphereRef.current.position.y = THREE.MathUtils.lerp(sphereRef.current.position.y, targetY, 0.08);
    
    // Rotación: Sólo rota cuando te mueves, NO gira solo con el tiempo
    targetRot.current.x = state.pointer.y * 0.8;
    targetRot.current.y = state.pointer.x * 0.8;
    sphereRef.current.rotation.x = THREE.MathUtils.lerp(sphereRef.current.rotation.x, targetRot.current.x, 0.08);
    sphereRef.current.rotation.y = THREE.MathUtils.lerp(sphereRef.current.rotation.y, targetRot.current.y, 0.08);
  });

  return (
    <Sphere ref={sphereRef} args={[12, 128, 128]} position={[0, 0, -5]}>
      <MeshDistortMaterial 
        color="#FF003C" 
        distort={0.4} 
        speed={0.5} // Velocidad interna muy baja para que mantenga textura de gel
        roughness={0.2} 
        metalness={0.6}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </Sphere>
  );
}

// --- CONFIGURACIÓN DE LA RULETA (Valores entre 3% y 10%) ---
const SEGMENTS = [
  { label: '3% OFF', color: '#111111' },
  { label: '8% OFF', color: '#222222' },
  { label: '5% OFF', color: '#111111' },
  { label: '10% OFF', color: '#222222' },
  { label: '4% OFF', color: '#111111' },
  { label: '7% OFF', color: '#222222' },
];

export default function PromocionesPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<string | null>(null);

  const spinRoulette = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setPrize(null);

    // Elegimos un premio al azar entre los 6 disponibles
    const targetIndex = Math.floor(Math.random() * SEGMENTS.length);
    
    // Matemática del giro para que la rebanada ganadora quede justo bajo la flecha de arriba
    const sliceAngle = 360 / SEGMENTS.length; // 60 grados cada rebanada
    const randomOffset = (Math.random() * 20) - 10; // Factor aleatorio para no caer siempre en el centro exacto
    
    // 6 vueltas completas (2160 grados) - la posición de la rebanada - 30 grados (para centrarla)
    const targetRotation = rotation + (360 * 6) - (targetIndex * sliceAngle) - (sliceAngle / 2) + randomOffset;

    setRotation(targetRotation);

    // Esperamos 5 segundos a que la ruleta frene por completo para mostrar el premio
    setTimeout(() => {
      setIsSpinning(false);
      setPrize(SEGMENTS[targetIndex].label);
    }, 5000);
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black selection:bg-white selection:text-black">
      <HUDNav />

      {/* FONDO 3D GELATINOSO INTERACTIVO */}
      <div className="fixed inset-0 z-0 pointer-events-auto cursor-crosshair touch-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={3} color="#ffffff" />
          <Environment preset="city" />
          <GelBackground />
        </Canvas>
      </div>

      <main className="relative z-10 mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center px-4 pt-24 pb-16">
        
        {/* TÍTULO */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/80 mb-2 font-bold drop-shadow-md">
            Prueba tu suerte
          </p>
          <h1 className="font-arcade text-4xl md:text-6xl leading-none drop-shadow-2xl">
            <span className="text-black drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">PROMOS</span>
            <br />
            <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">DEL MES</span>
          </h1>
        </motion.div>

        {/* RULETA INTERACTIVA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex flex-col items-center"
        >
          {/* Triángulo Apuntador (Fijo Arriba) */}
          <div className="absolute -top-4 z-20 h-8 w-8 text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21l-12-18h24z" />
            </svg>
          </div>

          {/* Contenedor de la Rueda */}
          <div className="relative h-64 w-64 sm:h-72 sm:w-72 md:h-96 md:w-96 rounded-full border-4 border-white/20 bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden p-1 backdrop-blur-xl">
            
            {/* Animación fluida delegada a Framer Motion */}
            <motion.div 
              className="relative h-full w-full rounded-full overflow-hidden"
              animate={{ rotate: rotation }}
              transition={{ 
                duration: 5, 
                ease: [0.2, 0.8, 0.1, 1] // Easing realista de fricción (frena suave al final)
              }}
            >
              {/* Rebanadas de la ruleta */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    ${SEGMENTS[0].color} 0deg 60deg,
                    ${SEGMENTS[1].color} 60deg 120deg,
                    ${SEGMENTS[2].color} 120deg 180deg,
                    ${SEGMENTS[3].color} 180deg 240deg,
                    ${SEGMENTS[4].color} 240deg 300deg,
                    ${SEGMENTS[5].color} 300deg 360deg
                  )`
                }}
              />
              
              {/* Textos de cada rebanada */}
              {SEGMENTS.map((seg, i) => {
                const angle = i * 60 + 30; // Centro de la rebanada
                return (
                  <div 
                    key={i}
                    className="absolute inset-0 flex items-start justify-center pt-4 md:pt-6"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <span className="font-arcade text-[10px] md:text-sm text-white drop-shadow-md">
                      {seg.label}
                    </span>
                  </div>
                );
              })}

              {/* Centro de la rueda */}
              <div className="absolute inset-0 m-auto h-12 w-12 md:h-16 md:w-16 rounded-full border-4 border-black bg-white shadow-inner flex items-center justify-center z-10">
                <Gift className="h-5 w-5 md:h-7 md:w-7 text-black" />
              </div>
            </motion.div>
          </div>

          {/* Botón Acción */}
          <button 
            onClick={spinRoulette}
            disabled={isSpinning}
            className={`mt-10 px-8 md:px-10 py-4 rounded-full font-mono text-xs md:text-sm font-black uppercase tracking-widest transition-all ${
              isSpinning 
                ? 'bg-white/20 text-white/50 cursor-not-allowed border border-transparent' 
                : 'bg-black text-white hover:scale-105 active:scale-95 border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
            }`}
          >
            {isSpinning ? 'GIRANDO...' : 'GIRAR RULETA'}
          </button>
        </motion.div>
      </main>

      {/* MODAL DE PREMIO DÍNAMICO */}
      <AnimatePresence>
        {prize && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white/10 p-8 text-center border border-white/20 shadow-2xl backdrop-blur-xl"
            >
              <button 
                onClick={() => setPrize(null)}
                className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              
              <h2 className="font-arcade text-3xl md:text-4xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] mb-2 mt-4">
                ¡GANASTE <br/>
                <span className="text-[#FF003C] drop-shadow-[0_0_10px_rgba(255,0,60,0.8)]">
                  {prize}
                </span>!
              </h2>
              
              {/* Mensaje que concuerda con lo que ganaste */}
              <p className="text-sm md:text-base text-white/90 font-sans font-medium mt-6 mb-8 uppercase tracking-wide">
                ¡Felicidades por tu descuento del {prize.replace(' OFF', '')}! <br/> Agrégalo a tu Recorcard en línea.
              </p>
              
              <button 
                onClick={() => setPrize(null)}
                className="w-full rounded-full bg-[#FF003C] py-4 font-mono text-xs font-bold uppercase tracking-widest text-white transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,0,60,0.5)]"
              >
                Agregar a mi Recorcard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-20 pointer-events-none">
        <Footer />
      </div>
    </div>
  );
}