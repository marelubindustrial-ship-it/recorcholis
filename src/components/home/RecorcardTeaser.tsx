'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Ticket, Zap, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const PERKS = [
  { icon: Zap, text: 'Recarga en segundos, sin filas' },
  { icon: ShieldCheck, text: 'Saldo protegido con tu tarjeta' },
  { icon: Ticket, text: 'Cada $10 = 1 punto para premios' },
];

const AMOUNTS = [200, 350, 500];

export default function RecorcardTeaser() {
  const [selectedAmount, setSelectedAmount] = useState<number>(350);

  // Efecto Tilt 3D interactivo para la tarjeta Recorcard
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleCardLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section id="recocard" className="w-full bg-[#F9F4FC] py-12 px-6 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A0D67] via-[#5E1382] to-[#3B0A54] p-7 sm:p-10 text-white shadow-xl"
        >
          {/* Destellos decorativos */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[#D4EB00]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-[#FF5E7E]/25 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Columna Izquierda: Info + Selector rápido interactivo */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-extrabold text-[#D4EB00] mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Recorcard Digital
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                Tu diversión lista <span className="text-[#D4EB00]">sin hacer filas</span>
              </h2>

              {/* 3 Beneficios compactos */}
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                {PERKS.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center sm:items-start gap-2.5 rounded-2xl bg-white/10 p-3 text-xs font-medium text-white/90 backdrop-blur-sm"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D4EB00] text-[#3B0A54]">
                      <Icon className="h-4 w-4 stroke-[2.5]" />
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              {/* Selector interactivo de monto + Botón CTA */}
              <div className="mt-6 flex flex-wrap items-center gap-3 w-full">
                <div className="flex items-center gap-1.5 rounded-full bg-black/25 p-1.5 border border-white/15">
                  {AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setSelectedAmount(amount)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition-all cursor-pointer ${
                        selectedAmount === amount
                          ? 'bg-[#D4EB00] text-[#3B0A54] shadow-sm'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <Link
                  href={`/recargas?monto=${selectedAmount}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#D4EB00] px-6 py-3 text-sm font-extrabold text-[#3B0A54] shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  Recargar ${selectedAmount}
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>

            {/* Columna Derecha: Tarjeta Recorcard 3D interactiva con el mouse */}
            <div
              className="lg:col-span-5 flex justify-center"
              style={{ perspective: 900 }}
            >
              <motion.div
                onMouseMove={handleCardMove}
                onMouseLeave={handleCardLeave}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative w-full max-w-[320px] aspect-[1.6/1] rounded-2xl bg-gradient-to-tr from-[#2A053D] via-[#6A1B9A] to-[#FF5E7E] p-5 shadow-2xl border border-white/25 select-none cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Brillo metálico superior */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent" />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-black tracking-tight text-white">
                    Recórcholis
                  </span>
                  <span className="rounded-full bg-[#D4EB00] px-2.5 py-0.5 text-[10px] font-extrabold text-[#3B0A54] uppercase">
                    +{Math.floor(selectedAmount / 10)} pts
                  </span>
                </div>

                <div className="my-auto">
                  <p className="text-[11px] uppercase tracking-wider text-white/75 font-semibold">
                    Saldo seleccionado
                  </p>
                  <p className="text-3xl font-black text-[#D4EB00] tracking-tight">
                    ${selectedAmount}.00 <span className="text-xs font-bold text-white">MXN</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-white/80">
                  <span>•••• 4829</span>
                  <span className="font-sans font-bold text-white">Pasa el cursor ✨</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}