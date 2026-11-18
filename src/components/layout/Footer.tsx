import Link from 'next/link';
import { Gamepad2, MapPin, Mail, ArrowUpRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Atracciones', href: '/atracciones' },
  { label: 'Promociones', href: '/promociones' },
  { label: 'Recarga tu Recorcard', href: '/recargas' },
  { label: 'Fiestas y eventos', href: '/fiestas-y-eventos' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'CRM interno', href: '/admin' },
];

export default function Footer() {
  return (
    <footer className="relative z-10 w-full overflow-hidden bg-gradient-to-b from-[#4A0D67] to-[#2B0548] text-white pt-14 pb-28 md:pb-12">
      {/* Línea superior decorativa con los colores de marca */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#D4EB00] via-[#FF5E7E] to-[#9B4DCA]" />

      {/* Destellos suaves de fondo */}
      <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-[#FF5E7E]/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-64 w-64 rounded-full bg-[#D4EB00]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Columna 1: Marca y descripción */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="/" className="group mb-4 inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4EB00] text-xl font-black text-[#3B0A54] shadow-md transition-transform group-hover:scale-105">
                R
              </span>
              <span className="text-2xl font-black tracking-tight text-white">
                Recórcholis
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-white/80">
              Más de 30 años creando sonrisas. El punto de encuentro favorito para la diversión familiar en México.
            </p>

            <Link
              href="/recargas"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D4EB00] px-5 py-2.5 text-xs font-extrabold text-[#3B0A54] shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              Recargar Recorcard
              <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Columna 2: Navegación */}
          <div className="md:col-span-4">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-wider text-[#D4EB00]">
              Explora Recórcholis
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2.5 text-sm">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-[#D4EB00] font-medium"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF5E7E]" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contacto y Horarios */}
          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-wider text-[#D4EB00]">
              Contacto
            </p>
            <ul className="space-y-3.5 text-sm text-white/85">
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D4EB00]">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="pt-1">54 sucursales en México</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#FF5E7E]">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="pt-1 break-all">hola@recorcholis.example</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D4EB00]">
                  <Gamepad2 className="h-4 w-4" />
                </span>
                <span className="pt-1">Lun–Dom 11:00–22:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior de Copyright */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-white/60">
          <p>© 2026 Recórcholis · ¡La diversión nunca termina!</p>
          <p className="font-semibold text-white/75">
            Boliche · Pista de Hielo · Zona Kids · Juegos
          </p>
        </div>
      </div>
    </footer>
  );
}