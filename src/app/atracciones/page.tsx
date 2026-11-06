'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, Gamepad2, Wind, Baby, Clapperboard, Car, ArrowUpRight } from 'lucide-react';
import HUDNav from '@/components/layout/HUDNav';
import Footer from '@/components/layout/Footer';

// Data con imágenes actualizadas (Bolera Cósmica ahora tiene una imagen específica de bowling neón)
const ATTRACTIONS = [
  { 
    id: '01',
    icon: Target, 
    name: 'Bolera Cósmica', 
    zone: 'Pista central', 
    level: 'Familiar', 
    desc: '8 pistas profesionales con iluminación reactiva, bumpers automatizados para niños y marcadores digitales animados. La experiencia clásica reinventada.',
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2000&auto=format&fit=crop' // Imagen de Bowling Neón
  },
  { 
    id: '02',
    icon: Gamepad2, 
    name: 'Arcade Dimension', 
    zone: 'Ala este', 
    level: 'Todos', 
    desc: 'Más de 200 máquinas de última generación. Desde simuladores de carreras hiperrealistas y VR, hasta los clásicos del pinball y air hockey.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop'
  },
  { 
    id: '03',
    icon: Wind, 
    name: 'Sky Trampolines', 
    zone: 'Nivel 2', 
    level: '6+ años', 
    desc: 'Desafía la gravedad en nuestros 400 m² de camas elásticas interconectadas. Incluye zonas de dodgeball, basketball slam y una fosa de espuma gigante.',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=2000&auto=format&fit=crop'
  },
  { 
    id: '04',
    icon: Baby, 
    name: 'Kiddie Universe', 
    zone: 'Ala oeste', 
    level: '1–5 años', 
    desc: 'Un ecosistema seguro y estimulante para los más pequeños. Estructuras acolchadas, albercas de pelotas y laberintos bajo supervisión constante.',
    image: 'https://images.unsplash.com/photo-1560662105-57f8ad6ae2d1?q=80&w=2000&auto=format&fit=crop'
  },
  { 
    id: '05',
    icon: Clapperboard, 
    name: 'Cine 7D', 
    zone: 'Entrada principal', 
    level: '4+ años', 
    desc: 'Sumérgete en la acción. Sillones con movimiento en 3 ejes, efectos de viento, agua y luces estroboscópicas sincronizadas con cortometrajes 3D.',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop'
  },
  { 
    id: '06',
    icon: Car, 
    name: 'Bumper Cars Neón', 
    zone: 'Pista norte', 
    level: '5+ años', 
    desc: 'Autos chocadores del futuro. Vehículos de rotación 360° con barras LED que reaccionan al impacto y a la música envolvente de la arena.',
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=2000&auto=format&fit=crop'
  },
];

// Componente individual para cada Atracción
const AttractionCard = ({ attraction, index }: { attraction: any, index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Parallax para la imagen
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  
  const isEven = index % 2 === 0;

  return (
    // Redujimos los márgenes en mobile (mb-16) y el gap (gap-6) para que sea más compacto
    <div ref={cardRef} className={`relative flex flex-col gap-6 md:gap-12 lg:items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} mb-16 sm:mb-24 md:mb-40`}>
      
      {/* Contenedor de Imagen */}
      <motion.div 
        // Cambiamos a aspect-video en móvil para que no ocupe toda la pantalla
        className="relative w-full lg:w-3/5 aspect-video md:aspect-[16/10] overflow-hidden rounded-md group cursor-pointer shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img 
          src={attraction.image} 
          alt={attraction.name}
          className="absolute inset-0 h-[120%] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ y: imageY }}
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
      </motion.div>

      {/* Contenedor de Texto */}
      <div className="flex w-full flex-col lg:w-2/5">
        <motion.div
          initial={{ opacity: 0, x: isEven ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header del texto */}
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <span className="font-mono text-lg md:text-2xl font-light text-zinc-300">
              {attraction.id}
            </span>
            <div className="h-[1px] flex-1 bg-zinc-200" />
            <span className="rounded-full border border-[#0055FF]/30 bg-[#0055FF]/5 px-3 py-1 font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-[#0055FF] uppercase">
              {attraction.level}
            </span>
          </div>

          {/* Título y Descripción */}
          <div className="group cursor-pointer">
            {/* Tamaño de texto reducido para que encaje perfecto en celular */}
            <h2 className="font-arcade text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black transition-colors duration-300 group-hover:text-[#FF003C] uppercase mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
              {attraction.name}
              <ArrowUpRight className="h-6 w-6 md:h-8 md:w-8 opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 text-[#FF003C] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 hidden md:block" />
            </h2>
            
            <div className="flex items-center gap-2 mb-4 md:mb-6 text-zinc-500 uppercase tracking-widest text-[10px] md:text-xs font-bold font-mono">
              <attraction.icon className="h-4 w-4 text-[#FF003C]" />
              {attraction.zone}
            </div>
            
            <p className="text-sm md:text-base lg:text-lg text-zinc-600 leading-relaxed font-sans font-light max-w-md">
              {attraction.desc}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


export default function AtraccionesPage() {
  return (
    <div className="min-h-dvh bg-white selection:bg-[#FF003C] selection:text-white">
      <HUDNav />

      {/* Paddings reducidos en móvil (pt-24) */}
      <main className="mx-auto max-w-[1400px] px-6 pb-20 pt-28 md:pt-40 md:pb-16 overflow-hidden">
        
        {/* Título Hero de la Página */}
        <div className="mb-16 md:mb-32 flex flex-col items-start justify-between gap-6 md:gap-8 md:flex-row md:items-end">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col"
          >
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#0055FF] mb-3 md:mb-4">
              // Selección de Niveles
            </p>
            {/* Título adaptado: text-4xl en móvil, escala hasta text-7xl en escritorio */}
            <h1 className="font-arcade text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] leading-none text-black drop-shadow-sm">
              ATRACCIONES
              <br />
              <span className="text-[#FF003C]">DISPONIBLES</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-sm text-zinc-500 text-xs sm:text-sm md:text-base font-light leading-relaxed border-l border-[#FF003C]/30 pl-4"
          >
            Cada sucursal combina zonas distintas. Descubre escenarios inmersivos y filtra por antojo: hay un nivel diseñado exactamente para cada tipo de jugador.
          </motion.p>
        </div>

        {/* Lista de Atracciones */}
        <div className="relative w-full">
          {ATTRACTIONS.map((attraction, index) => (
            <AttractionCard key={attraction.id} attraction={attraction} index={index} />
          ))}
        </div>

      </main>
      
      <Footer />
    </div>
  );
}