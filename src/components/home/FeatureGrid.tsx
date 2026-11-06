'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gamepad2, Disc, Wind, Baby } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';

const FEATURES = [
  {
    icon: Disc,
    title: 'Boleras cósmicas',
    desc: 'Pistas neón, efectos especiales y torneos familiares cada fin de semana.',
    tag: 'nivel 01',
    href: '/atracciones',
  },
  {
    icon: Gamepad2,
    title: 'Arcade legendario',
    desc: 'Más de 200 máquinas: clásicos retro, simuladores y VR de última generación.',
    tag: 'nivel 02',
    href: '/atracciones',
  },
  {
    icon: Wind,
    title: 'Zona de trampolines',
    desc: 'Parques de aire libre con dodgeball, canasta slam y foam pit gigante.',
    tag: 'nivel 03',
    href: '/atracciones',
  },
  {
    icon: Baby,
    title: 'Kiddie zone',
    desc: 'Universo seguro para los más pequeños con juegos didácticos y suaves.',
    tag: 'nivel 04',
    href: '/atracciones',
  },
];

export default function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="hud-label mb-3">elige tu nivel</p>
      <h2 className="font-arcade text-xl text-ink sm:text-3xl">
        ATRACCIONES <span className="text-glow-red text-brand-bright">ESTRELLA</span>
      </h2>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc, tag, href }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <Link
              href={href}
              className="group block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan"
            >
              <GlassPanel className="h-full p-6 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-brand/50 group-hover:shadow-neon-red">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 text-brand-bright transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-arcade text-[8px] tracking-widest text-ink-dim/60">{tag}</span>
                </div>
                <h3 className="mt-5 font-arcade text-xs leading-relaxed text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-dim">{desc}</p>
                <p className="mt-5 font-arcade text-[9px] uppercase tracking-widest text-neon-cyan opacity-0 transition-opacity group-hover:opacity-100">
                  jugar →
                </p>
              </GlassPanel>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
