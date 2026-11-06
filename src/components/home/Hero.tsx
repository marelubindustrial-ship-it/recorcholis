'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Environment } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";

// --- COMPONENTE DE LA MONEDA 3D DORADA (AHORA CON FÍSICAS DE GOLPE) ---
function CoinScene({ isStarting }: { isStarting: boolean }) {
  const tiltGroup = useRef<THREE.Group>(null);
  const coinGroup = useRef<THREE.Group>(null);
  
  // Variables físicas para el golpe interactivo
  const spinSpeed = useRef(0.8);
  const bumpScale = useRef(1);

  // Función que se dispara cuando el mouse "toca" la moneda
  const handleHit = () => {
    if (isStarting) return;
    spinSpeed.current = 35; // Acelera el giro violentamente
    bumpScale.current = 0.5; // Se comprime por el impacto
  };

  useFrame((state, delta) => {
    if (!tiltGroup.current || !coinGroup.current) return;

    if (isStarting) {
      // Animación de Play Start
      coinGroup.current.rotation.y += delta * 25;
      tiltGroup.current.position.z = THREE.MathUtils.lerp(tiltGroup.current.position.z, 6, delta * 3);
      tiltGroup.current.scale.lerp(new THREE.Vector3(0, 0, 0), delta * 4);
    } else {
      // Inclinación 3D general que sigue el mouse
      const targetRotX = (state.pointer.y * Math.PI) / 2.5; 
      const targetRotY = (state.pointer.x * Math.PI) / 2.5; 
      tiltGroup.current.rotation.x = THREE.MathUtils.lerp(tiltGroup.current.rotation.x, -targetRotX, 0.15);
      tiltGroup.current.rotation.y = THREE.MathUtils.lerp(tiltGroup.current.rotation.y, targetRotY, 0.15);

      // Parallax suave global
      const targetPosX = state.pointer.x * 1.8;
      const targetPosY = state.pointer.y * 1.8;
      tiltGroup.current.position.x = THREE.MathUtils.lerp(tiltGroup.current.position.x, targetPosX, 0.1);
      tiltGroup.current.position.y = THREE.MathUtils.lerp(tiltGroup.current.position.y, targetPosY, 0.1);

      // --- RECUPERACIÓN ELÁSTICA DEL GOLPE (FÍSICAS) ---
      // El giro desacelera suavemente de regreso a 0.8
      spinSpeed.current = THREE.MathUtils.lerp(spinSpeed.current, 0.8, 0.05);
      // La escala rebota de regreso a 1
      bumpScale.current = THREE.MathUtils.lerp(bumpScale.current, 1, 0.1);
      
      coinGroup.current.scale.setScalar(bumpScale.current);
      coinGroup.current.rotation.y += delta * spinSpeed.current;
    }
  });

  return (
    <group ref={tiltGroup}>
      {/* Evento onPointerOver para detectar cuando el cursor choca con la moneda */}
      <group ref={coinGroup} onPointerOver={handleHit}>
        
        {/* Base de la moneda - Más pequeña (0.55 en lugar de 0.85) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.08, 64]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#4A3B00" 
            emissiveIntensity={0.2}
            metalness={1} 
            roughness={0.15} 
            envMapIntensity={2} 
          />
        </mesh>
        
        {/* Letra R (Frente) */}
        <Text position={[0, 0, 0.05]} fontSize={0.65} color="#111" fontWeight="bold">
          R
        </Text>
        {/* Letra R (Reverso) */}
        <Text position={[0, 0, -0.05]} rotation={[0, Math.PI, 0]} fontSize={0.65} color="#111" fontWeight="bold">
          R
        </Text>
        
      </group>
    </group>
  );
}


// --- COMPONENTE HERO PRINCIPAL ---
export default function Hero({ started }: { started: boolean }) {
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isStarting, setIsStarting] = useState(false);

  // --- LOGICA DE SCROLL (FRAMER MOTION) ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transiciones de color (De Rojo a Blanco y viceversa)
  const bgColor = useTransform(scrollYProgress, [0, 0.8], ["#FF003C", "#FFFFFF"]);
  const textColor = useTransform(scrollYProgress, [0, 0.8], ["#FFFFFF", "#000000"]);
  const accentColor = useTransform(scrollYProgress, [0, 0.8], ["#000000", "#FF003C"]); 
  const descColor = useTransform(scrollYProgress, [0, 0.8], ["rgba(255,255,255,0.9)", "rgba(0,0,0,0.6)"]);
  
  // Botones secundarios
  const btnBorderColor = useTransform(scrollYProgress, [0, 0.8], ["rgba(255,255,255,0.3)", "rgba(0,0,0,0.2)"]);
  
  // Botón Principal (Play Start)
  const playBtnBg = useTransform(scrollYProgress, [0, 0.8], ["#000000", "#FF003C"]);
  const playBtnText = useTransform(scrollYProgress, [0, 0.8], ["#FFFFFF", "#FFFFFF"]); 
  const playBtnShadow = useTransform(scrollYProgress, [0, 0.8], ["0 0 20px rgba(0,0,0,0.4)", "0 0 30px rgba(255,0,60,0.4)"]);

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.2], [0.6, 0]);

  // --- ANIMACIÓN DE ENTRADA (GSAP) ---
  useEffect(() => {
    if (!started || !stickyRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(
        ".hero-line-inner",
        { yPercent: 110 },
        { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" }
      ).fromTo(
        ".hero-fade",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" },
        "-=0.8"
      );
    }, stickyRef);

    return () => ctx.revert();
  }, [started]);

  const handlePlayStart = () => {
    setIsStarting(true);
    gsap.to(".scanlines", { opacity: 0.8, duration: 0.1, yoyo: true, repeat: 5 });
    
    setTimeout(() => {
      setIsStarting(false);
      const section = document.getElementById("recocard");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }, 2000);
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={containerRef} className="relative h-[200vh] w-full" id="inicio">
      
      <motion.div 
        ref={stickyRef}
        style={{ backgroundColor: bgColor }}
        className="sticky top-0 flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden font-sans px-4 py-20 transition-colors duration-75"
      >
        
        {/* EFECTO CRT/SCANLINES */}
        <div 
          className="scanlines absolute inset-0 z-20 pointer-events-none opacity-10"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))",
            backgroundSize: "100% 4px"
          }}
        />

        {/* CANVAS 3D (z-10, pointer-events-auto para detectar el mouse) */}
        <div className="absolute inset-0 z-10 pointer-events-auto">
          <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={3} color="#ffffff" />
            <pointLight position={[-5, 5, 5]} intensity={4} color="#FFD700" />
            <Environment preset="studio" />
            <CoinScene isStarting={isStarting} />
          </Canvas>
        </div>

        {/* CONTENIDO DOM (z-30). Le ponemos pointer-events-none general para que el mouse pase hacia la moneda */}
        <div className="hero-content relative z-30 w-full max-w-6xl flex flex-col items-center text-center gap-6 md:gap-8 pointer-events-none mt-8 md:mt-0">
          
          <motion.p 
            style={{ color: textColor }}
            className="hero-fade text-[10px] sm:text-xs md:text-sm tracking-[0.3em] md:tracking-[0.4em] uppercase font-mono font-bold animate-pulse"
          >
            &gt; Insert Coin / ¡Bienvenido Jugador!
          </motion.p>
          
          <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-black drop-shadow-xl overflow-hidden py-2" aria-label="¡Recorcholis!">
            <span className="block overflow-hidden">
              <motion.span style={{ color: textColor }} className="hero-line-inner inline-block">¡Recor</motion.span>
              <motion.span style={{ color: accentColor }} className="hero-line-inner inline-block">chol</motion.span>
              <motion.span style={{ color: textColor }} className="hero-line-inner inline-block">is!</motion.span>
            </span>
          </h1>
          
          <motion.p 
            style={{ color: descColor }}
            className="hero-fade text-sm sm:text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-4 backdrop-blur-sm bg-black/5 rounded-xl py-4"
          >
            ¡Ven a vivir la mejor experiencia de entretenimiento familiar! Contamos con los mejores juegos de destreza, simuladores, redención y máquinas arcade. ¡La diversión nunca termina!
          </motion.p>

          {/* ACCIONES (Volvemos a poner pointer-events-auto aquí para que los botones sí sean clickeables) */}
          <div className="hero-fade flex flex-col md:flex-row gap-4 w-full sm:w-3/4 md:w-auto justify-center items-center mt-6 pointer-events-auto">
            
            {/* Botón Eventos -> Dirige a fiestas-y-eventos */}
            <motion.button 
              onClick={() => scrollToSection("fiestas-y-eventos")}
              style={{ borderColor: btnBorderColor, color: textColor }}
              className="w-full md:w-auto px-6 py-4 md:px-10 rounded-full border-[1px] bg-transparent font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 font-mono text-xs md:text-sm backdrop-blur-md"
            >
              Eventos
            </motion.button>

            {/* Botón Play Start Principal */}
            <motion.button 
              onClick={handlePlayStart}
              style={{ backgroundColor: playBtnBg, color: playBtnText, boxShadow: playBtnShadow }}
              className="w-full md:w-auto relative px-8 py-5 md:px-14 rounded-full font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 font-mono text-sm md:text-base border border-white/10"
            >
              {isStarting ? "LOADING..." : "PLAY START"}
            </motion.button>
            
            {/* Botón Mapa -> Link de Google Maps */}
            <motion.button 
              onClick={() => window.open("https://www.google.com/maps/search/Recorcholis", "_blank")}
              style={{ borderColor: btnBorderColor, color: textColor }}
              className="w-full md:w-auto px-6 py-4 md:px-10 rounded-full border-[1px] bg-transparent font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 font-mono text-xs md:text-sm flex justify-center items-center gap-2 backdrop-blur-md"
            >
              {/* Ícono de Pin de Mapa */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              Mapa
            </motion.button>

          </div>
        </div>

        {/* Indicador de Scroll */}
        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="hero-fade absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 font-mono z-30 pointer-events-none"
        >
          <motion.span style={{ color: textColor }} className="text-[10px] md:text-xs uppercase tracking-[0.3em]">
            Descubre
          </motion.span>
          <motion.div 
            style={{ backgroundColor: textColor }}
            className="w-[1px] h-10 md:h-16 opacity-30" 
          />
        </motion.div>
        
      </motion.div>
    </section>
  );
}