'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function SpaceshipScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rastrea el scroll relativo a este contenedor
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Mapeamos el progreso del scroll (0 a 1)
  // Ahora la nave vuela de Izquierda (-50vw) a Derecha (50vw)
  // El eje Y se mantiene en 0 para un vuelo completamente recto y horizontal
  const x = useTransform(scrollYProgress, [0, 1], ['-50vw', '50vw']);
  const y = useTransform(scrollYProgress, [0, 1], ['0px', '0px']);

  return (
    <div
      ref={containerRef}
      // Altura reducida (h-24) y un degradado horizontal elegante hacia blanco
      className="relative flex h-24 w-full items-center justify-center overflow-hidden border-y border-white/20 bg-gradient-to-r from-transparent via-white/10 to-transparent py-2"
    >
      <motion.div
        style={{ x, y }}
        className="flex items-center gap-3"
      >
        {/* Nave apuntando completamente a la derecha (rotate-45 corrige su ángulo natural) */}
        <span className="rotate-45 text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          🚀
        </span>
        
        {/* Láseres disparando en línea recta hacia la derecha */}
        <div className="flex items-center gap-2">
          <span className="h-1 w-6 rounded-full bg-red-500 shadow-[0_0_8px_theme(colors.red.500)]"></span>
          <span className="h-1 w-6 rounded-full bg-red-500 shadow-[0_0_8px_theme(colors.red.500)]"></span>
          <span className="text-xl animate-pulse">💥</span>
        </div>
        
        {/* Enemigo o meteorito recibiendo el disparo */}
        <span className="text-3xl animate-bounce ml-4">
          👾
        </span>
      </motion.div>
    </div>
  );
}