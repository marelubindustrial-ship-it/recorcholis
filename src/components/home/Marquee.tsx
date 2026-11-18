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

  // La nave vuela de Izquierda (-50vw) a Derecha (50vw) en línea recta
  const x = useTransform(scrollYProgress, [0, 1], ['-50vw', '50vw']);
  const y = useTransform(scrollYProgress, [0, 1], ['0px', '0px']);

  return (
    <div
      ref={containerRef}
      // Mismo tono morado claro con el que termina el Hero (#9B4DCA -> #A864D4) para continuidad total
      className="relative flex h-24 w-full items-center justify-center overflow-hidden border-y border-white/20 bg-gradient-to-b from-[#A864D4] via-[#9B4DCA] to-[#8A3AB9] py-2"
    >
      {/* Brillo central sutil */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <motion.div
        style={{ x, y }}
        className="relative z-10 flex items-center gap-3"
      >
        {/* Nave apuntando completamente a la derecha */}
        <span className="rotate-45 text-4xl drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
          🚀
        </span>
        
        {/* Láseres disparando en línea recta hacia la derecha (en verde lima o rojo vibrante para destacar sobre morado) */}
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-6 rounded-full bg-[#D4EB00] shadow-[0_0_10px_#D4EB00]"></span>
          <span className="h-1.5 w-6 rounded-full bg-[#D4EB00] shadow-[0_0_10px_#D4EB00]"></span>
          <span className="text-xl animate-pulse">💥</span>
        </div>
        
        {/* Enemigo recibiendo el disparo */}
        <span className="text-3xl animate-bounce ml-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
          👾
        </span>
      </motion.div>
    </div>
  );
}