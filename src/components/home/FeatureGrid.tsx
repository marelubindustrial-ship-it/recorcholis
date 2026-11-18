'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ATTRACTIONS = [
  {
    id: 'boliche',
    title: 'Boliche',
    desc: 'Pistas iluminadas y carriles familiares para jugar con todos.',
    image: '/images/boliche.jpg',
    badge: 'Plan Favorito',
    href: '/atracciones#boliche',
  },
  {
    id: 'pista-hielo',
    title: 'Pista de Hielo',
    desc: 'Deslízate en familia con renta de patines y apoyo para principiantes.',
    image: '/images/hielo.jpg',
    badge: 'Diversión en familia',
    href: '/atracciones#pista-hielo',
  },
];

export default function FeatureGrid() {
  return (
    <section
      id="atracciones"
      className="w-full bg-[#F9F4FC] py-12 px-6 sm:px-10 lg:px-12"
    >
      <div className="mx-auto max-w-5xl">
        {/* Encabezado compacto */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B0A54] tracking-tight">
            Atracciones destacadas
          </h2>
          <Link
            href="/atracciones"
            className="inline-flex items-center gap-1 text-sm font-extrabold text-[#4A0D67] hover:text-[#FF5E7E] transition-colors"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid de 2 tarjetas compactas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ATTRACTIONS.map((item, i) => (
            <motion.div
              key={item.id}
              id={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                href={item.href}
                className="group block overflow-hidden rounded-2xl bg-white border border-[#4A0D67]/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                {/* Imagen */}
                <div className="relative h-48 w-full overflow-hidden bg-[#4A0D67]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-[#D4EB00] px-3 py-1 text-xs font-extrabold text-[#3B0A54]">
                    {item.badge}
                  </span>
                </div>

                {/* Texto corto */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#3B0A54]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#5C3A70] line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F6EFFA] text-[#4A0D67] group-hover:bg-[#D4EB00] transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}