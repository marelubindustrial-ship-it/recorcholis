'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Heart, Flag, Smile, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import HUDNav from '@/components/layout/HUDNav';
import Footer from '@/components/layout/Footer';

// --- HISTORIA REAL DE RECÓRCHOLIS (BREVE Y DIRECTA) ---
const TIMELINE = [
  {
    year: '1989',
    title: 'NACE EN TOLUCA, MÉXICO',
    text: 'En febrero de 1989 abre sus puertas el primer Recórcholis en Toluca, Estado de México, con una misión clara: hacer feliz a la gente.',
    image: '/images/boliche.jpg',
  },
  {
    year: '1999',
    title: 'EXPANSIÓN FAMILIAR',
    text: 'Como parte de Grupo Diniz, llevamos centros llenos de luz y diversión a las principales plazas comerciales de toda la República Mexicana.',
    image: '/images/zonakid.jpg',
  },
  {
    year: '2005',
    title: 'LLEGA LA RECORCARD',
    text: 'Evolucionamos la experiencia con tarjetas recargables y E-Tickets para que cada jugada sume puntos y premios en familia.',
    image: '/images/simulador.jpg',
  },
  {
    year: 'HOY',
    title: 'EL CORAZÓN DE LA DIVERSIÓN',
    text: 'Más de 35 años uniendo generaciones en México con boliche, pistas de hielo, Zona Kids y parques hermanos como ¡Kataplum!.',
    image: '/images/hielo.jpg',
  },
];

// --- VALORES CENTRADOS EN LA FAMILIA Y MÉXICO ---
const VALUES = [
  {
    icon: Heart,
    title: 'Primero la familia',
    text: 'Cada espacio está pensado para que hijos, papás y abuelos compartan juntos.',
  },
  {
    icon: Flag,
    title: 'Orgullo mexicano',
    text: 'Nacimos en México hace más de 35 años y seguimos creciendo para nuestras familias.',
  },
  {
    icon: Smile,
    title: 'Hacer feliz a la gente',
    text: 'Nuestra misión desde el primer día: crear sonrisas y recuerdos inolvidables.',
  },
  {
    icon: ShieldCheck,
    title: 'Diversión segura',
    text: 'Instalaciones cuidadas y un ambiente sano donde todos juegan con tranquilidad.',
  },
];

export default function NosotrosPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Scroll del Hero
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(heroProgress, [0, 0.9], [1, 0.25]);

  // 2. Scroll de la Línea del Tiempo Pinned
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(timelineProgress, 'change', (latest) => {
    if (latest < 0.25) setActiveIndex(0);
    else if (latest < 0.5) setActiveIndex(1);
    else if (latest < 0.75) setActiveIndex(2);
    else setActiveIndex(3);
  });

  return (
    <div className="relative min-h-dvh bg-[#F9F4FC] text-[#3B0A54] selection:bg-[#D4EB00] selection:text-[#3B0A54] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <HUDNav />

      {/* --- HERO SECTION CON IMAGEN DE FONDO BIEN VISIBLE --- */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative h-[92dvh] flex items-center justify-center px-6 sm:px-10 z-10 overflow-hidden bg-[#3B0A54]"
      >
        {/* Fotografía de familia jugando con alta visibilidad */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1800&q=85"
            alt="Familia mexicana divirtiéndose en Recórcholis"
            className="w-full h-full object-cover object-center opacity-70"
          />
          {/* Degradado morado suave para que la foto brille y el texto se lea nítido */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(59, 10, 84, 0.68) 0%, rgba(74, 13, 103, 0.55) 55%, rgba(59, 10, 84, 0.88) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-extrabold text-[#D4EB00] border border-white/25 mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              100% Orgullo Mexicano · Desde 1989
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-lg">
              Más de 35 años <br />
              <span className="text-[#D4EB00]">haciendo feliz a la gente</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-xl text-sm sm:text-lg text-white/95 font-medium leading-relaxed rounded-2xl bg-[#3B0A54]/45 backdrop-blur-md px-6 py-4 border border-white/15 shadow-lg"
          >
            Nacimos en Toluca con un sueño sencillo: crear el lugar favorito de las familias en México para reír, compartir y jugar juntos.
          </motion.p>
        </div>

        {/* Curva inferior coral y morado */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-9 sm:h-12"
            preserveAspectRatio="none"
          >
            <path d="M0,15 C320,5 520,55 860,62 L860,70 L0,70 Z" fill="#FF5E7E" />
            <path d="M0,40 C420,75 960,65 1440,18 L1440,70 L0,70 Z" fill="#3B0A54" />
          </svg>
        </div>
      </motion.section>

      {/* --- SECCIÓN TIMELINE PINNED (HISTORIA REAL CON FONDOS LUMINOSOS) --- */}
      <section ref={timelineRef} className="relative w-full bg-[#3B0A54] z-20 h-[320vh]">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          {/* FONDOS CON IMÁGENES MÁS VISIBLES Y A TODO COLOR */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={TIMELINE[activeIndex].image}
                  alt={TIMELINE[activeIndex].title}
                  className="w-full h-full object-cover object-center opacity-85"
                />
              </motion.div>
            </AnimatePresence>

            {/* Degradado lateral suave para que la foto luzca a la derecha y el texto se lea perfecto a la izquierda */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(43, 5, 72, 0.88) 0%, rgba(59, 10, 84, 0.62) 48%, rgba(59, 10, 84, 0.25) 100%)',
              }}
            />
          </div>

          {/* TARJETA DE HISTORIA */}
          <div className="absolute inset-0 z-10 flex items-center justify-center lg:justify-start px-6 sm:px-10 lg:px-[10%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -28 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md p-7 sm:p-9 rounded-3xl bg-[#3B0A54]/75 backdrop-blur-xl border border-white/20 shadow-2xl text-white"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="rounded-full bg-[#D4EB00] px-3 py-0.5 text-xs font-extrabold text-[#3B0A54]">
                    Capítulo 0{activeIndex + 1}
                  </span>
                  <div className="h-[1px] flex-1 bg-white/20" />
                </div>

                <h2 className="text-4xl sm:text-6xl font-black text-[#D4EB00] tracking-tight mb-1">
                  {TIMELINE[activeIndex].year}
                </h2>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mb-3">
                  {TIMELINE[activeIndex].title}
                </h3>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                  {TIMELINE[activeIndex].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicadores inferiores de años */}
          <div className="absolute bottom-8 left-0 w-full px-6 sm:px-[10%] z-20 flex gap-3">
            {TIMELINE.map((item, i) => (
              <button
                key={item.year}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="flex-1 text-left group cursor-pointer"
              >
                <span
                  className={`block text-xs font-extrabold mb-1.5 transition-colors ${
                    activeIndex === i ? 'text-[#D4EB00]' : 'text-white/60'
                  }`}
                >
                  {item.year}
                </span>
                <div className="h-1.5 w-full bg-white/25 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#D4EB00]"
                    initial={{ width: '0%' }}
                    animate={{ width: activeIndex >= i ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- VALORES SECTION: PRIMERO LA FAMILIA Y MÉXICO --- */}
      <section className="relative z-30 bg-[#F9F4FC] py-20 sm:py-24 px-6 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[#4A0D67]/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#4A0D67] mb-3">
              Nuestros Valores
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#3B0A54] tracking-tight">
              Primero la{' '}
              <span className="text-[#FF5E7E]">familia</span> y{' '}
              <span className="text-[#4A0D67]">México</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5C3A70]">
              Creemos en el poder de jugar juntos para fortalecer los lazos familiares en cada rincón de nuestro país.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-3xl bg-white border border-[#4A0D67]/10 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6EFFA] text-[#4A0D67] group-hover:bg-[#D4EB00] transition-colors mb-5">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-[#3B0A54] mb-2">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[#5C3A70]">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Banner CTA final */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#4A0D67] to-[#6A1B9A] p-7 sm:p-9 text-white shadow-lg">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold">
                Ven a vivir la experiencia en familia
              </h3>
              <p className="mt-1 text-sm text-white/85">
                Encuentra tu sucursal Recórcholis más cercana y arma tu plan hoy mismo.
              </p>
            </div>
            <Link
              href="/atracciones"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[#D4EB00] px-7 py-3.5 text-sm font-extrabold text-[#3B0A54] shadow-md transition-transform hover:scale-105"
            >
              Ver atracciones
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}