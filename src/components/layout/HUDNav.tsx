'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Ticket, Sparkles, Gift, Info, LayoutDashboard, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Inicio', icon: Gamepad2 },
  { href: '/atracciones', label: 'Atracciones', icon: Sparkles },
  { href: '/promociones', label: 'Promos', icon: Gift },
  { href: '/recargas', label: 'Recorcard', icon: Ticket },
  { href: '/fiestas-y-eventos', label: 'Eventos', icon: LayoutDashboard },
  { href: '/nosotros', label: 'Nosotros', icon: Info },
] as const;

export default function HUDNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Bloquear el scroll de la página cuando el menú móvil fullscreen esté abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* --- LOGO FLOTANTE (Ajustado con z-50 para estar sobre el menú) --- */}
      <Link
        href="/"
        onClick={() => setIsMobileMenuOpen(false)}
        className="fixed left-4 top-4 z-50 flex items-center gap-2 rounded-2xl glass-strong px-4 py-2.5 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan bg-black/20 backdrop-blur-md border border-white/10 shadow-lg"
        aria-label="Recórcholis — inicio"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF003C] font-arcade text-sm text-white shadow-[0_0_15px_rgba(255,0,60,0.5)]">
          R
        </span>
        <span className="hidden font-arcade text-[10px] tracking-widest text-white sm:inline">
          RECÓRCHOLIS
        </span>
      </Link>

      {/* --- HUD ESCRITORIO (Se mantiene igual, oculto en móvil) --- */}
      <nav
        aria-label="Navegación principal"
        className="fixed left-1/2 top-4 z-40 hidden -translate-x-1/2 items-center gap-1 rounded-2xl glass-strong px-2 py-2 md:flex bg-black/20 backdrop-blur-md border border-white/10 shadow-lg"
      >
        {NAV_ITEMS.map(({ href, label }) => {
          const active = href === '/' ? isHome : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative rounded-xl px-4 py-2 font-arcade text-[10px] uppercase tracking-widest transition-colors',
                active ? 'text-white' : 'text-white/60 hover:text-white',
              )}
            >
              {active && (
                <motion.span
                  layoutId="hud-pill"
                  className="absolute inset-0 rounded-xl bg-[#FF003C] shadow-[0_0_15px_rgba(255,0,60,0.5)]"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- BOTÓN HAMBURGUESA MÓVIL (Lusion Style) --- */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed right-4 top-4 z-50 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 text-white md:hidden shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Alternar menú móvil"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* --- MENÚ MÓVIL FULLSCREEN INMERSIVO (En lugar del dock inferior) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            /* Animación premium de revelado circular desde el botón */
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-black/95 backdrop-blur-2xl px-6 md:hidden"
          >
            {/* Glow decorativo de fondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#FF003C] rounded-full opacity-10 blur-[100px] pointer-events-none" />

            <nav className="relative z-10 flex flex-col gap-6">
              {NAV_ITEMS.map(({ href, label, icon: Icon }, i) => {
                const active = href === '/' ? isHome : pathname.startsWith(href);
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                  >
                    <Link
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'group flex items-center gap-6 font-arcade text-3xl uppercase tracking-widest transition-colors',
                        active ? 'text-white' : 'text-white/40 hover:text-white'
                      )}
                    >
                      <span className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300",
                        active 
                          ? "bg-[#FF003C] text-white shadow-[0_0_20px_rgba(255,0,60,0.5)]" 
                          : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white"
                      )}>
                        <Icon className="h-7 w-7" />
                      </span>
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            
            {/* Footer del menú móvil */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-10 left-6 right-6 flex justify-between items-center border-t border-white/10 pt-6"
            >
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em]">
                System Menu
              </span>
              <span className="font-mono text-[10px] text-[#FF003C] uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF003C] animate-pulse" />
                Online
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}