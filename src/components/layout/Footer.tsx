import Link from 'next/link';
import { Gamepad2, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-white/10 pb-28 pt-12 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand font-arcade text-sm text-white shadow-neon-red">
              R
            </span>
            <span className="font-arcade text-[10px] tracking-widest text-ink">RECÓRCHOLIS</span>
          </div>
          <p className="text-sm text-ink-dim">
            Más de 30 años creando sonrisas. La nueva era arcade de la diversión familiar en México.
          </p>
        </div>
        <div>
          <p className="hud-label mb-4">Mapa del nivel</p>
          <ul className="space-y-2 text-sm text-ink-dim">
            {[
              ['Atracciones', '/atracciones'],
              ['Promociones', '/promociones'],
              ['Recarga tu Recorcard', '/recargas'],
              ['Fiestas y eventos', '/fiestas-y-eventos'],
              ['Nosotros', '/nosotros'],
              ['CRM interno', '/admin'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-neon-cyan">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="hud-label mb-4">Contacto</p>
          <ul className="space-y-3 text-sm text-ink-dim">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-bright" /> 54 sucursales en México
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-bright" /> hola@recorcholis.example
            </li>
            <li className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-brand-bright" /> Lun–Dom 11:00–22:00
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-10 text-center font-arcade text-[9px] tracking-widest text-ink-dim/60">
        © 2026 RECÓRCHOLIS · GAME OVER = NUEVA PARTIDA
      </p>
    </footer>
  );
}
