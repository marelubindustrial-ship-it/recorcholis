'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Ticket, Zap, ShieldCheck } from 'lucide-react';

const PERKS = [
  { icon: Zap, text: 'Recarga en segundos, sin filas' },
  { icon: ShieldCheck, text: 'Saldo protegido con tu número de tarjeta' },
  { icon: Ticket, text: 'Cada $10 = 1 punto canjeable por premios' },
];

export default function RecorcardTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <motion.div
        className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-neon-cyan/15 blur-3xl" />

        <p className="hud-label mb-3">pase premium</p>
        <h2 className="max-w-xl font-arcade text-lg leading-relaxed text-ink sm:text-2xl sm:leading-relaxed">
          TU <span className="text-glow-red text-brand-bright">RECORCARD</span>, AHORA EN MODO DIGITAL
        </h2>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {PERKS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-sm text-ink-dim">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neon-cyan/10 text-neon-cyan">
                <Icon className="h-4 w-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>

        <Link href="/recargas" className="btn-arcade mt-10">
          Consultar saldo o recargar
        </Link>
      </motion.div>
    </section>
  );
}
