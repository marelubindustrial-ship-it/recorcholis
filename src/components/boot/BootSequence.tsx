'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBootStore } from '@/store/boot';

export default function BootSequence() {
  const { phase, skipBoot } = useBootStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Si ya pasamos la fase inicial, no hacemos nada
    if (phase !== 'TERMINAL') return;

    // Configuración de la carga (2 segundos de duración)
    const duration = 2000; 
    const intervalTime = 20;
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const percent = (currentStep / totalSteps) * 100;
      setProgress(Math.min(percent, 100));

      // Cuando la barra llega al 100%
      if (currentStep >= totalSteps) {
        clearInterval(progressInterval);
        
        // Hacemos una pausa muy breve de medio segundo y entramos automáticamente al sitio
        setTimeout(() => {
          skipBoot();
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(progressInterval);
  }, [phase, skipBoot]);

  return (
    <AnimatePresence>
      {/* Solo se renderiza mientras estemos en la fase inicial */}
      {phase === 'TERMINAL' && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030303] px-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }} // Desvanecimiento suave al terminar
          transition={{ duration: 0.8, ease: "easeInOut" }}
          aria-label="Pantalla de carga"
        >
          <div className="w-full max-w-xs flex flex-col items-center gap-4">
            
            {/* Texto Arcade */}
            <p className="font-mono text-xs tracking-[0.3em] text-white/70 uppercase animate-pulse">
              Cargando Juego...
            </p>
            
            {/* Barra de Progreso Minimalista */}
            <div className="h-1 w-full overflow-hidden bg-white/10 rounded-full">
              <motion.div
                className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Porcentaje en números (Opcional, le da buen toque) */}
            <p className="font-mono text-[10px] text-white/40">
              {Math.floor(progress)}%
            </p>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}