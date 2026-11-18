'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Environment } from "@react-three/drei";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

// --- COMPONENTE DE LA MONEDA 3D DORADA DETALLADA (CON FÍSICAS DE GOLPE) ---
function CoinScene({ isStarting }: { isStarting: boolean }) {
  const tiltGroup = useRef<THREE.Group>(null);
  const coinGroup = useRef<THREE.Group>(null);

  const spinSpeed = useRef(0.9);
  const bumpScale = useRef(1);

  const handleHit = () => {
    if (isStarting) return;
    spinSpeed.current = 35;
    bumpScale.current = 0.52;
  };

  useFrame((state, delta) => {
    if (!tiltGroup.current || !coinGroup.current) return;

    if (isStarting) {
      coinGroup.current.rotation.y += delta * 25;
      tiltGroup.current.position.z = THREE.MathUtils.lerp(tiltGroup.current.position.z, 6, delta * 3);
      tiltGroup.current.scale.lerp(new THREE.Vector3(0, 0, 0), delta * 4);
    } else {
      const targetRotX = (state.pointer.y * Math.PI) / 2.5;
      const targetRotY = (state.pointer.x * Math.PI) / 2.5;
      tiltGroup.current.rotation.x = THREE.MathUtils.lerp(tiltGroup.current.rotation.x, -targetRotX, 0.15);
      tiltGroup.current.rotation.y = THREE.MathUtils.lerp(tiltGroup.current.rotation.y, targetRotY, 0.15);

      const targetPosX = 0.75 + state.pointer.x * 1.4;
      const targetPosY = 0.25 + state.pointer.y * 1.4;
      tiltGroup.current.position.x = THREE.MathUtils.lerp(tiltGroup.current.position.x, targetPosX, 0.1);
      tiltGroup.current.position.y = THREE.MathUtils.lerp(tiltGroup.current.position.y, targetPosY, 0.1);

      spinSpeed.current = THREE.MathUtils.lerp(spinSpeed.current, 0.9, 0.05);
      bumpScale.current = THREE.MathUtils.lerp(bumpScale.current, 1, 0.1);

      coinGroup.current.scale.setScalar(bumpScale.current);
      coinGroup.current.rotation.y += delta * spinSpeed.current;
    }
  });

  const ridges = Array.from({ length: 72 });

  return (
    <group ref={tiltGroup} position={[0.75, 0.25, 0]}>
      <group ref={coinGroup} onPointerOver={handleHit}>
        {/* 1. Cuerpo principal de la moneda */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.52, 0.52, 0.09, 64]} />
          <meshStandardMaterial
            color="#FFD000"
            emissive="#523A00"
            emissiveIntensity={0.22}
            metalness={0.95}
            roughness={0.14}
            envMapIntensity={2.2}
          />
        </mesh>

        {/* 2. Canto estriado */}
        {ridges.map((_, i) => {
          const angle = (i / ridges.length) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.522, Math.sin(angle) * 0.522, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.015, 0.014, 0.088]} />
              <meshStandardMaterial
                color="#E5A900"
                metalness={0.95}
                roughness={0.22}
              />
            </mesh>
          );
        })}

        {/* 3. Aro exterior en relieve (Cara Frontal) */}
        <mesh position={[0, 0, 0.046]}>
          <torusGeometry args={[0.47, 0.024, 24, 64]} />
          <meshStandardMaterial
            color="#FFE047"
            metalness={1}
            roughness={0.1}
            envMapIntensity={2.5}
          />
        </mesh>

        {/* 4. Aro exterior en relieve (Cara Trasera) */}
        <mesh position={[0, 0, -0.046]}>
          <torusGeometry args={[0.47, 0.024, 24, 64]} />
          <meshStandardMaterial
            color="#FFE047"
            metalness={1}
            roughness={0.1}
            envMapIntensity={2.5}
          />
        </mesh>

        {/* 5. Aro interior grabado fino */}
        <mesh position={[0, 0, 0.046]}>
          <torusGeometry args={[0.38, 0.008, 16, 64]} />
          <meshStandardMaterial color="#B87D00" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, -0.046]}>
          <torusGeometry args={[0.38, 0.008, 16, 64]} />
          <meshStandardMaterial color="#B87D00" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* 6. Estrellas decorativas laterales (Frente) */}
        <Text position={[-0.28, 0, 0.049]} fontSize={0.09} color="#7A4F00" fontWeight="bold">
          ★
        </Text>
        <Text position={[0.28, 0, 0.049]} fontSize={0.09} color="#7A4F00" fontWeight="bold">
          ★
        </Text>

        {/* 7. Estrellas decorativas laterales (Reverso) */}
        <Text position={[-0.28, 0, -0.049]} rotation={[0, Math.PI, 0]} fontSize={0.09} color="#7A4F00" fontWeight="bold">
          ★
        </Text>
        <Text position={[0.28, 0, -0.049]} rotation={[0, Math.PI, 0]} fontSize={0.09} color="#7A4F00" fontWeight="bold">
          ★
        </Text>

        {/* 8. Letra R con sombra/bisel 3D (Frente) */}
        <Text position={[0.012, -0.012, 0.047]} fontSize={0.52} color="#6E4700" fontWeight="bold">
          R
        </Text>
        <Text position={[0, 0, 0.053]} fontSize={0.52} color="#3B0A54" fontWeight="bold">
          R
        </Text>

        {/* 9. Letra R con sombra/bisel 3D (Reverso) */}
        <Text position={[-0.012, -0.012, -0.047]} rotation={[0, Math.PI, 0]} fontSize={0.52} color="#6E4700" fontWeight="bold">
          R
        </Text>
        <Text position={[0, 0, -0.053]} rotation={[0, Math.PI, 0]} fontSize={0.52} color="#3B0A54" fontWeight="bold">
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

  // --- TRACKING DEL MOUSE PARA EFECTOS INTERACTIVOS ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  const smoothNormX = useSpring(normX, { stiffness: 120, damping: 25 });
  const smoothNormY = useSpring(normY, { stiffness: 120, damping: 25 });

  // Parallax inverso para la fotografía de la familia en el boliche/arcade
  const imgX = useTransform(smoothNormX, [-1, 1], [18, -18]);
  const imgY = useTransform(smoothNormY, [-1, 1], [12, -12]);

  // Spotlight radial que sigue el cursor
  const spotlightBg = useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(212, 235, 0, 0.18), rgba(255, 94, 126, 0.12) 40%, transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    normX.set((x / rect.width) * 2 - 1);
    normY.set((y / rect.height) * 2 - 1);
  };

  // --- LÓGICA DE SCROLL EN TODA LA PANTALLA (DE MORADO PROFUNDO A MORADO CLARO) ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Color global de toda la pantalla (cubre banner + zona de tarjetas)
  const fullScreenBg = useTransform(scrollYProgress, [0, 0.85], ["#4A0D67", "#9B4DCA"]);

  // Degradado lateral sincronizado con el color del scroll para fundir la foto sin cortes
  const sideGradient = useTransform(
    scrollYProgress,
    [0, 0.85],
    [
      "linear-gradient(90deg, rgba(74, 13, 103, 0.98) 0%, rgba(74, 13, 103, 0.78) 26%, rgba(74, 13, 103, 0.18) 58%, rgba(74, 13, 103, 0.05) 100%)",
      "linear-gradient(90deg, rgba(155, 77, 202, 0.98) 0%, rgba(155, 77, 202, 0.78) 26%, rgba(155, 77, 202, 0.18) 58%, rgba(155, 77, 202, 0.05) 100%)",
    ]
  );

  // Degradado inferior sincronizado con toda la pantalla
  const bottomGradient = useTransform(
    scrollYProgress,
    [0, 0.85],
    [
      "linear-gradient(to top, rgba(74, 13, 103, 0.75), transparent)",
      "linear-gradient(to top, rgba(155, 77, 202, 0.75), transparent)",
    ]
  );

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
        { yPercent: 0, duration: 1.1, stagger: 0.1, ease: "expo.out" }
      ).fromTo(
        ".hero-fade",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" },
        "-=0.7"
      );
    }, stickyRef);

    return () => ctx.revert();
  }, [started]);

  const handlePlayStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      const section = document.getElementById("recocard");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }, 1800);
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={containerRef} className="relative h-[180vh] w-full" id="inicio">
      {/* CONTENEDOR STICKY A PANTALLA COMPLETA QUE CAMBIA TODO DE COLOR */}
      <motion.div
        ref={stickyRef}
        onMouseMove={handleMouseMove}
        style={{ backgroundColor: fullScreenBg }}
        className="sticky top-0 flex h-[100dvh] w-full flex-col justify-between overflow-hidden font-sans pt-16 md:pt-20"
      >
        {/* Efecto Spotlight interactivo en toda la pantalla */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{ background: spotlightBg }}
        />

        {/* --- ÁREA PRINCIPAL DEL BANNER CON LA FAMILIA EN EL BOLICHE Y MAQUINITAS --- */}
        <div className="relative flex-1 w-full flex items-center overflow-hidden">
          {/* Imagen de Familia Jugando Boliche y Arcade (Lado derecho con Parallax) */}
          <motion.div
            style={{ x: imgX, y: imgY, scale: 1.06 }}
            className="hero-fade absolute inset-y-0 right-0 w-full lg:w-[68%] z-0 pointer-events-none select-none"
          >
            {/* Reemplaza este src por tu imagen local de familia en boliche/maquinitas cuando la subas */}
            <img
              src="https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1400&q=85"
              alt="Familia jugando boliche y maquinitas arcade en Recórcholis"
              className="h-full w-full object-cover object-center opacity-90 lg:opacity-100"
            />
            {/* Degradado lateral que cambia de color junto con el scroll */}
            <motion.div
              className="absolute inset-0"
              style={{ background: sideGradient }}
            />
            {/* Degradado inferior que cambia de color junto con el scroll */}
            <motion.div
              className="absolute inset-x-0 bottom-0 h-32"
              style={{ background: bottomGradient }}
            />
          </motion.div>

          {/* CANVAS 3D CON LA MONEDA DORADA DETALLADA (z-10) */}
          <div className="absolute inset-0 z-10 pointer-events-auto">
            <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
              <ambientLight intensity={1.2} />
              <directionalLight position={[10, 10, 5]} intensity={3.2} color="#ffffff" />
              <pointLight position={[-5, 5, 5]} intensity={4.5} color="#FFD700" />
              <Environment preset="studio" />
              <CoinScene isStarting={isStarting} />
            </Canvas>
          </div>

          {/* CONTENIDO DE TEXTO Y CTA (Alineado a la izquierda) */}
          <div className="relative z-30 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12 pointer-events-none pb-12">
            <div className="max-w-xl flex flex-col items-start text-left gap-5">
              {/* Badge superior */}
              <span className="hero-fade inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-xs font-semibold tracking-wide text-white border border-white/25">
                <span className="h-2 w-2 rounded-full bg-[#D4EB00] animate-ping" />
                ¡La diversión nunca termina!
              </span>

              {/* Título Principal */}
              <h1
                className="text-4xl sm:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.06] tracking-tight text-white drop-shadow-md"
                aria-label="Encuentra tu plan cerca de ti"
              >
                <span className="block overflow-hidden pb-1">
                  <span className="hero-line-inner inline-block">
                    Encuentra tu
                  </span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <span className="hero-line-inner inline-block">
                    plan cerca de ti
                  </span>
                </span>
              </h1>

              {/* Botones de Acción */}
              <div className="hero-fade flex flex-wrap items-center gap-3.5 pt-2 pointer-events-auto">
                {/* Botón Principal Verde Lima */}
                <motion.button
                  onClick={() => window.open("https://www.google.com/maps/search/Recorcholis", "_blank")}
                  whileHover={{ scale: 1.04, boxShadow: "0 10px 28px rgba(212, 235, 0, 0.45)" }}
                  whileTap={{ scale: 0.96 }}
                  className="rounded-full bg-[#D4EB00] px-8 py-4 text-sm sm:text-base font-extrabold text-[#3B0A54] shadow-lg transition-colors hover:bg-[#dff514] cursor-pointer"
                >
                  Encuentra tu sucursal
                </motion.button>

                {/* Botón Secundario Recorcard */}
                <motion.button
                  onClick={handlePlayStart}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="rounded-full border border-white/40 bg-white/15 backdrop-blur-md px-6 py-4 text-sm sm:text-base font-bold text-white transition-colors hover:bg-white/25 cursor-pointer"
                >
                  {isStarting ? "Cargando..." : "Recargar Recorcard"}
                </motion.button>
              </div>
            </div>
          </div>

          {/* CURVA INFERIOR CON ACENTO CORAL/ROSA Y TRANSLÚCIDO */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 w-full overflow-hidden leading-none">
            <svg
              viewBox="0 0 1440 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-14 sm:h-20 md:h-24 preserve-3d"
              preserveAspectRatio="none"
            >
              {/* Ola secundaria color rosa/coral (#FF5E7E) */}
              <path
                d="M0,15 C240,5 420,85 720,95 L720,110 L0,110 Z"
                fill="#FF5E7E"
              />
              {/* Ola principal translúcida que deja ver el cambio de morado en toda la pantalla */}
              <path
                d="M0,55 C320,115 880,105 1440,35 L1440,110 L0,110 Z"
                fill="rgba(255, 255, 255, 0.14)"
              />
            </svg>
          </div>
        </div>

        {/* --- SECCIÓN INFERIOR DE 3 CATEGORÍAS INTEGRADA AL MISMO FONDO MORADO --- */}
        <div className="relative z-30 w-full bg-white/15 backdrop-blur-md border-t border-white/15 py-4 sm:py-6 px-6 sm:px-10 lg:px-12">
          <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tarjeta 1: Boliche */}
            <motion.button
              onClick={() => scrollToSection("boliche")}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="hero-fade group flex items-center justify-center gap-4 rounded-2xl bg-white/95 hover:bg-white border border-white/30 px-6 py-4 transition-all shadow-md cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F6EFFA] shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
                  <circle cx="13" cy="22" r="8" fill="#4A0D67" />
                  <circle cx="11" cy="19" r="1.2" fill="#FFFFFF" />
                  <circle cx="14.5" cy="19.5" r="1.2" fill="#FFFFFF" />
                  <circle cx="12.5" cy="22.5" r="1.2" fill="#FFFFFF" />
                  <path
                    d="M24 6C22.3 6 21 7.3 21 9C21 10.2 21.7 11.2 22.6 11.7C21.6 14.2 20.5 17.5 20.5 21.5C20.5 25.5 22 29 24 29C26 29 27.5 25.5 27.5 21.5C27.5 17.5 26.4 14.2 25.4 11.7C26.3 11.2 27 10.2 27 9C27 7.3 25.7 6 24 6Z"
                    stroke="#FF5E7E"
                    strokeWidth="2.2"
                    fill="#FFFFFF"
                  />
                  <line x1="21.5" y1="14" x2="26.5" y2="14" stroke="#FF5E7E" strokeWidth="2" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-[#3B0A54] tracking-tight">Boliche</span>
            </motion.button>

            {/* Tarjeta 2: Zona Kids */}
            <motion.button
              onClick={() => scrollToSection("zona-kids")}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="hero-fade group flex items-center justify-center gap-4 rounded-2xl bg-white/95 hover:bg-white border border-white/30 px-6 py-4 transition-all shadow-md cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F6EFFA] shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
                  <path
                    d="M7 28V15H11V18H15V12H21V18H25V15H29V28H7Z"
                    stroke="#FF5E7E"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                  <path d="M18 6L15 12H21L18 6Z" fill="#FF5E7E" />
                  <path d="M15 28V23C15 21.3431 16.3431 20 18 20C19.6569 20 21 21.3431 21 23V28" stroke="#FF5E7E" strokeWidth="2.2" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-[#3B0A54] tracking-tight">Zona Kids</span>
            </motion.button>

            {/* Tarjeta 3: Juegos */}
            <motion.button
              onClick={() => scrollToSection("juegos")}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="hero-fade group flex items-center justify-center gap-4 rounded-2xl bg-white/95 hover:bg-white border border-white/30 px-6 py-4 transition-all shadow-md cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F6EFFA] shadow-xs group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
                  <rect x="5" y="11" width="26" height="15" rx="7.5" fill="#FF5E7E" />
                  <path d="M12 16V21M9.5 18.5H14.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="23.5" cy="17" r="1.4" fill="#FFFFFF" />
                  <circle cx="26.5" cy="19.5" r="1.4" fill="#FFFFFF" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-[#3B0A54] tracking-tight">Juegos</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}