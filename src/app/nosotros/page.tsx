'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Heart, Rocket, Target, Trophy, ArrowRight } from 'lucide-react';
import HUDNav from '@/components/layout/HUDNav';
import Footer from '@/components/layout/Footer';

// --- DATA ---
const TIMELINE = [
  { 
    year: '1993', 
    title: 'EL ORIGEN',
    text: 'Nace la primera bolera Recórcholis en la Ciudad de México. El inicio de una obsesión por la diversión y el entretenimiento de calidad.',
    image: 'https://images.unsplash.com/photo-1551818012-c2e71d3780d6?q=80&w=2000&auto=format&fit=crop'
  },
  { 
    year: '2005', 
    title: 'REVOLUCIÓN DIGITAL',
    text: 'Llega la tarjeta Recorcard: adiós a las fichas de metal. La tecnología transforma la forma de jugar y premia la lealtad.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000&auto=format&fit=crop'
  },
  { 
    year: '2016', 
    title: 'EXPANSIÓN MASIVA',
    text: '50 sucursales y la primera kiddie zone del país. Nos convertimos en el referente absoluto del entretenimiento nacional.',
    image: 'https://images.unsplash.com/photo-1560662105-57f8ad6ae2d1?q=80&w=2000&auto=format&fit=crop'
  },
  { 
    year: '2026', 
    title: 'NUEVA ERA',
    text: 'Experiencia Web Arcade: la diversión, ahora también digital. Mundos inmersivos, VR y conexión total con nuestros jugadores.',
    video: 'https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4'
  },
];

const VALUES = [
  { icon: Heart, title: 'Familia primero', text: 'Diseñamos cada espacio para que niños, papás y abuelos jueguen juntos.', color: 'from-[#FF003C]/20 to-transparent' },
  { icon: Rocket, title: 'Innovación', text: 'Del pinball al VR: siempre un paso adelante en entretenimiento.', color: 'from-[#0055FF]/20 to-transparent' },
  { icon: Target, title: 'Accesibilidad', text: 'Diversión de calidad a precios justos, en toda la República.', color: 'from-[#00FFCC]/20 to-transparent' },
  { icon: Trophy, title: 'Excelencia', text: 'Seguridad certificada y servicio que sorprende en cada visita.', color: 'from-[#FFD700]/20 to-transparent' },
];

export default function NosotrosPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // 1. Scroll del Hero
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  // 2. Scroll de la Línea del Tiempo Pinned
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start start", "end end"]
  });

  // Mapeamos el progreso (0 a 1) para cambiar el slide activo
  useMotionValueEvent(timelineProgress, "change", (latest) => {
    if (latest < 0.25) setActiveIndex(0);
    else if (latest < 0.50) setActiveIndex(1);
    else if (latest < 0.75) setActiveIndex(2);
    else setActiveIndex(3);
  });

  return (
    // Las clases de scrollbar-hide ocultan visualmente la barra de desplazamiento
    <div className="relative min-h-dvh bg-black selection:bg-[#FF003C] selection:text-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <HUDNav />

      {/* --- HERO SECTION LUSION STYLE --- */}
      <motion.section 
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative h-[100dvh] flex items-center justify-center px-4 md:px-12 z-10"
      >
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay muted loop playsInline 
            className="w-full h-full object-cover opacity-20 mix-blend-screen grayscale"
            src="https://videos.pexels.com/video-files/5192085/5192085-uhd_2560_1440_25fps.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/70 to-black" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] text-zinc-500 mb-6 font-bold flex items-center justify-center gap-4">
              <span className="w-6 md:w-8 h-[1px] bg-zinc-500" />
              Historia Principal
              <span className="w-6 md:w-8 h-[1px] bg-zinc-500" />
            </p>
            {/* TÍTULO MÁS PEQUEÑO: text-3xl en móvil, escala máximo a text-7xl */}
            <h1 className="font-arcade text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.9] text-white drop-shadow-2xl">
              30+ AÑOS
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF003C] to-[#80001e]">JUGANDO</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="mt-8 max-w-2xl text-xs sm:text-sm md:text-base text-zinc-400 font-light leading-relaxed backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10"
          >
            Recórcholis nació con una bolera y una obsesión: que la diversión familiar fuera el
            mejor plan de la semana. Hoy somos 54 sucursales, millones de sonrisas y una
            comunidad que sigue coleccionando momentos.
          </motion.p>
        </div>
      </motion.section>


      {/* --- SECCIÓN TIMELINE PINNED (400vh de scroll invisible) --- */}
      <section ref={timelineRef} className="relative w-full bg-black z-20 h-[400vh]">
        
        {/* Contenedor Sticky: Se queda pegado a la pantalla mientras scrolleas los 400vh */}
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          
          {/* FONDOS (Crossfade dinámico) */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                {TIMELINE[activeIndex].video ? (
                  <video autoPlay muted loop playsInline src={TIMELINE[activeIndex].video} className="w-full h-full object-cover mix-blend-screen opacity-80" />
                ) : (
                  <img src={TIMELINE[activeIndex].image} alt="Background" className="w-full h-full object-cover mix-blend-luminosity opacity-60" />
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Overlays de contraste */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/80" />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* CONTENIDO DE TEXTO (Aparece y desaparece) */}
          <div className="absolute inset-0 z-10 flex items-center justify-center lg:justify-start lg:px-[10%] px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[2px] w-8 bg-[#FF003C]" />
                  <span className="font-mono text-[10px] md:text-xs tracking-widest text-[#FF003C] uppercase font-bold">
                    Fase 0{activeIndex + 1}
                  </span>
                </div>
                <h2 className="font-arcade text-5xl md:text-6xl text-white mb-2 drop-shadow-lg">
                  {TIMELINE[activeIndex].year}
                </h2>
                <h3 className="font-arcade text-xl md:text-2xl text-[#FF003C] mb-4 drop-shadow-md">
                  {TIMELINE[activeIndex].title}
                </h3>
                <p className="text-sm md:text-base text-zinc-300 font-light leading-relaxed">
                  {TIMELINE[activeIndex].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Indicador de progreso visual estilo Lusion */}
          <div className="absolute bottom-10 left-0 w-full px-[10%] z-20 flex gap-2">
            {TIMELINE.map((_, i) => (
              <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#FF003C]"
                  initial={{ width: "0%" }}
                  animate={{ width: activeIndex >= i ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* --- VALORES SECTION --- */}
      <section className="relative z-30 bg-black py-32 md:py-48 px-6 border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF003C] rounded-full opacity-[0.04] blur-[100px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="font-arcade text-3xl md:text-5xl text-white mb-4">
              NUESTROS <span className="text-[#FF003C]">PODERES</span>
            </h2>
            <p className="font-mono text-[10px] md:text-xs tracking-widest text-zinc-500 uppercase">
              El código fuente de nuestra experiencia
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, text, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 hover:border-zinc-700 transition-colors duration-500 cursor-default"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black border border-zinc-800 text-white group-hover:scale-110 transition-transform duration-500 mb-8 shadow-xl">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-arcade text-lg md:text-xl text-white mb-4 group-hover:text-[#FF003C] transition-colors duration-500">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400 font-light flex-1">
                    {text}
                  </p>
                  <div className="mt-8 flex items-center justify-end overflow-hidden">
                    <ArrowRight className="h-5 w-5 text-[#FF003C] translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <div className="relative z-40 bg-black">
        <Footer />
      </div>
    </div>
  );
}