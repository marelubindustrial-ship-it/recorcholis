'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  Disc,
  Snowflake,
  Baby,
  Gamepad2,
  Glasses,
  Trophy,
  Sparkles,
  Check,
  MapPin,
  Clock,
} from 'lucide-react';
import HUDNav from '@/components/layout/HUDNav';
import Footer from '@/components/layout/Footer';

interface Attraction {
  id: string;
  anchor: string;
  category: 'Boliche' | 'Pista de Hielo' | 'Zona Kids' | 'Juegos y VR';
  icon: React.ElementType;
  name: string;
  zone: string;
  level: string;
  desc: string;
  image: string;
}

// Atracciones reales de Recórcholis con tus imágenes locales
const ATTRACTIONS: Attraction[] = [
  {
    id: '01',
    anchor: 'boliche',
    category: 'Boliche',
    icon: Disc,
    name: 'Boliche Recórcholis',
    zone: 'Pistas Familiares',
    level: 'Todas las edades',
    desc: 'Pistas profesionales con pantallas interactivas, iluminación ambiental y barreras laterales automáticas para que los niños también hagan chuza.',
    image: '/images/boliche.jpg',
  },
  {
    id: '02',
    anchor: 'pista-hielo',
    category: 'Pista de Hielo',
    icon: Snowflake,
    name: 'Pista de Hielo',
    zone: 'Ice Rink Recórcholis',
    level: '4+ años',
    desc: 'Pista de hielo real con renta de patines en todas las tallas, sesiones libres y andaderas de apoyo para principiantes.',
    image: '/images/hielo.jpg',
  },
  {
    id: '03',
    anchor: 'zona-kids',
    category: 'Zona Kids',
    icon: Baby,
    name: 'Zona Kids & Playground',
    zone: 'Área Infantil',
    level: '1 a 10 años',
    desc: 'Laberintos multinivel, resbaladillas, albercas de pelotas y juegos didácticos diseñados en un entorno acolchado y seguro para los peques.',
    image: '/images/zonakid.jpg',
  },
  {
    id: '04',
    anchor: 'realidad-virtual',
    category: 'Juegos y VR',
    icon: Glasses,
    name: 'Simuladores y Realidad Virtual',
    zone: 'Zona VR',
    level: '7+ años',
    desc: 'Cabinas inmersivas con visores VR, plataformas con movimiento, montañas rusas virtuales y simuladores de carreras de alta velocidad.',
    image: '/images/simulador.jpg',
  },
  {
    id: '05',
    anchor: 'juegos',
    category: 'Juegos y VR',
    icon: Gamepad2,
    name: 'Máquinas de Videojuegos',
    zone: 'Arcade Central',
    level: 'Familiar',
    desc: 'Los últimos lanzamientos arcade, mesas de Air Hockey, basquetbol, baile y clásicos familiares que se activan al instante con tu Recorcard.',
    image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: '06',
    anchor: 'redencion',
    category: 'Juegos y VR',
    icon: Trophy,
    name: 'Juegos de Destreza y Premios',
    zone: 'Redemption & Tienda',
    level: 'Todos',
    desc: 'Pon a prueba tu puntería y reflejos para acumular tickets electrónicos en tu Recorcard y canjearlos por peluches, gadgets y juguetes.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85',
  },
];

const CATEGORIES = ['Todas', 'Boliche', 'Pista de Hielo', 'Zona Kids', 'Juegos y VR'] as const;

// Tarjeta más compacta y ligeramente desplazada para dejar ver la víbora lila
const AttractionCard = ({ attraction, index }: { attraction: Attraction; index: number }) => {
  const isEven = index % 2 === 0;
  const Icon = attraction.icon;

  return (
    <motion.article
      layout
      id={attraction.anchor}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col ${
        isEven ? 'lg:flex-row lg:mr-14' : 'lg:flex-row-reverse lg:ml-14'
      } overflow-hidden rounded-3xl bg-white/95 backdrop-blur-md border border-[#4A0D67]/12 shadow-md hover:shadow-xl hover:shadow-[#4A0D67]/15 transition-all duration-300`}
    >
      {/* Contenedor de Imagen más pequeño y compacto */}
      <div className="relative w-full lg:w-[38%] h-48 sm:h-52 lg:h-auto lg:min-h-[215px] shrink-0 overflow-hidden bg-[#4A0D67]">
        <img
          src={attraction.image}
          alt={attraction.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3B0A54]/60 via-transparent to-transparent" />

        {/* Categoría flotante */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-[#D4EB00] px-2.5 py-0.5 text-[11px] font-extrabold text-[#3B0A54] shadow-sm">
            {attraction.category}
          </span>
          <span className="rounded-full bg-[#3B0A54]/85 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white">
            {attraction.level}
          </span>
        </div>
      </div>

      {/* Contenedor de Información Compacta */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#FF5E7E]">
              <Icon className="h-3.5 w-3.5" />
              {attraction.zone}
            </span>
            <span className="font-mono text-xs font-black text-[#4A0D67]/30">
              #{attraction.id}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#3B0A54] group-hover:text-[#6A1B9A] transition-colors tracking-tight">
            {attraction.name}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-[#5C3A70] leading-relaxed">
            {attraction.desc}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#4A0D67]/10 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#4A0D67]/75">
            <Clock className="h-3.5 w-3.5 text-[#FF5E7E]" />
            Disponible con Recorcard
          </span>

          <button
            onClick={() => window.open('https://www.google.com/maps/search/Recorcholis', '_blank')}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#F6EFFA] hover:bg-[#D4EB00] px-3.5 py-1.5 text-xs font-extrabold text-[#3B0A54] transition-colors cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5 text-[#FF5E7E]" />
            Sucursales
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default function AtraccionesPage() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>('Todas');
  const listRef = useRef<HTMLDivElement>(null);

  // Seguimiento de scroll para dibujar la víbora lila detrás de las tarjetas
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 85%', 'end 35%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 20,
    restDelta: 0.001,
  });

  const pathLength = useTransform(smoothProgress, [0, 1], [0.04, 1]);

  const filteredAttractions =
    selectedCategory === 'Todas'
      ? ATTRACTIONS
      : ATTRACTIONS.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-dvh bg-[#F9F4FC] selection:bg-[#D4EB00] selection:text-[#3B0A54]">
      <HUDNav />

      {/* --- ENCABEZADO MORADO PREMIUM CON CURVA INFERIOR --- */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#4A0D67] via-[#5E1382] to-[#3B0A54] pt-28 pb-20 sm:pt-36 sm:pb-24 px-6 sm:px-10 text-white">
        <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-[#D4EB00]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-[#FF5E7E]/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-extrabold text-[#D4EB00] border border-white/20 mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Diversión en cada rincón
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
                Nuestras{' '}
                <span className="text-[#D4EB00]">atracciones</span>
              </h1>
            </div>

            <p className="max-w-md text-sm sm:text-base text-white/85 leading-relaxed">
              Arma tu plan en familia: desde chuzas en el boliche y patinaje sobre hielo, hasta Zona Kids y simuladores.
            </p>
          </motion.div>

          {/* Píldoras de filtro interactivo */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#D4EB00] text-[#3B0A54] shadow-lg scale-105'
                      : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'
                  }`}
                >
                  {category}
                  {isActive && <Check className="h-4 w-4 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Curva inferior coral y lavanda */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10 sm:h-14"
            preserveAspectRatio="none"
          >
            <path d="M0,15 C320,5 520,65 860,72 L860,80 L0,80 Z" fill="#FF5E7E" />
            <path d="M0,45 C420,85 960,75 1440,20 L1440,80 L0,80 Z" fill="#F9F4FC" />
          </svg>
        </div>
      </header>

      {/* --- CONTENEDOR PRINCIPAL CON VÍBORA / FRANJA LILA DELGADA Y AMPLIA AL HACER SCROLL --- */}
      <main ref={listRef} className="relative mx-auto max-w-5xl px-6 sm:px-10 py-16 sm:py-24 overflow-hidden">
        {/* VÍBORA LILA DELGADA ONDULANDO DE IZQUIERDA A DERECHA DETRÁS DE LAS ATRACCIONES */}
        <div className="pointer-events-none absolute inset-0 z-0 flex justify-center overflow-hidden">
          <svg
            viewBox="0 0 1000 2200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="lilacSnakeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" stopOpacity="0.85" />
                <stop offset="35%" stopColor="#A855F7" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#9333EA" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FF5E7E" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            {/* Riel guía lila muy suave para que se intuya el camino */}
            <path
              d="M 500 0 
                 C 960 150, 960 280, 500 380 
                 C 40 480, 40 620, 500 740 
                 C 960 860, 960 1000, 500 1120 
                 C 40 1240, 40 1380, 500 1500 
                 C 960 1620, 960 1760, 500 1880 
                 C 180 1980, 420 2120, 500 2200"
              stroke="#E9D5FF"
              strokeWidth="28"
              strokeLinecap="round"
            />

            {/* Víbora lila vibrante más delgada (28px) serpenteando de lado a lado con el scroll */}
            <motion.path
              d="M 500 0 
                 C 960 150, 960 280, 500 380 
                 C 40 480, 40 620, 500 740 
                 C 960 860, 960 1000, 500 1120 
                 C 40 1240, 40 1380, 500 1500 
                 C 960 1620, 960 1760, 500 1880 
                 C 180 1980, 420 2120, 500 2200"
              stroke="url(#lilacSnakeGradient)"
              strokeWidth="28"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>
        </div>

        {/* LISTA DE ATRACCIONES CON MÁS SEPARACIÓN VERTICAL PARA QUE LUZCA LA VÍBORA LILA */}
        <motion.div layout className="relative z-10 flex flex-col gap-14 sm:gap-20">
          <AnimatePresence mode="popLayout">
            {filteredAttractions.map((attraction, index) => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}