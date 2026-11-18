'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  PartyPopper,
  CheckCircle2,
  Sparkles,
  Cake,
  GraduationCap,
  Briefcase,
  Calendar,
  Users,
  MapPin,
  User,
  Mail,
  Phone,
  Building2,
  Wallet,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import HUDNav from '@/components/layout/HUDNav';
import Footer from '@/components/layout/Footer';
import {
  leadStepOneSchema,
  leadStepTwoSchema,
  leadStepThreeSchema,
  type LeadInput,
} from '@/lib/validators/leads';

const VENUES = [
  { id: 'coapa', label: 'Coapa, CDMX' },
  { id: 'santa-fe', label: 'Santa Fe, CDMX' },
  { id: 'guadalajara', label: 'Guadalajara, Jal.' },
  { id: 'monterrey', label: 'San Pedro, N.L.' },
  { id: 'puebla', label: 'Puebla, Pue.' },
  { id: 'cancun', label: 'Cancún, Q.Roo' },
];

const TYPES = [
  {
    id: 'INFANTIL',
    label: 'Fiesta infantil',
    desc: 'Cumpleaños inolvidable con juegos, pastel y regalos',
    icon: Cake,
    badge: '¡La más pedida!',
  },
  {
    id: 'ESCOLAR',
    label: 'Evento escolar',
    desc: 'Día del niño, excursiones y graduaciones',
    icon: GraduationCap,
    badge: 'Grupos',
  },
  {
    id: 'CORPORATIVO',
    label: 'Corporativo',
    desc: 'Integración de equipos y fiestas de fin de año',
    icon: Briefcase,
    badge: 'Empresas',
  },
] as const;

const STEP_LABELS = ['¿Qué celebramos?', 'Fecha y sede', 'Detalles finales'];

type FormData = Partial<LeadInput>;

export default function PartyForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>({ type: 'INFANTIL' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const update = (patch: FormData) => setData((d) => ({ ...d, ...patch }));

  async function next() {
    setError(null);
    const payload = {
      0: leadStepOneSchema.safeParse({
        type: data.type,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      }),
      1: leadStepTwoSchema.safeParse({
        eventDate: data.eventDate,
        guests: data.guests,
        venueId: data.venueId,
      }),
      2: leadStepThreeSchema.safeParse({
        company: data.company ?? '',
        budget: data.budget,
        message: data.message ?? '',
      }),
    }[step as 0 | 1 | 2];

    if (!payload.success) {
      setError(payload.error.issues[0].message);
      return;
    }

    if (step < 2) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ...payload.data }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'No pudimos registrar tu solicitud.');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de red.');
    } finally {
      setLoading(false);
    }
  }

  const selectedVenueLabel =
    VENUES.find((v) => v.id === data.venueId)?.label ?? 'Sucursal por definir';
  const selectedTypeLabel =
    TYPES.find((t) => t.id === data.type)?.label ?? 'Fiesta infantil';

  return (
    <div className="relative min-h-dvh bg-[#F9F4FC] text-[#3B0A54] selection:bg-[#D4EB00] selection:text-[#3B0A54] overflow-hidden">
      <HUDNav />

      {/* --- FONDO CON IMAGEN DE FAMILIA DIVIRTIÉNDOSE + OVERLAY MORADO SUAVE --- */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1800&q=85"
          alt="Familia celebrando y divirtiéndose en Recórcholis"
          className="h-full w-full object-cover object-center opacity-20"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(74, 13, 103, 0.92) 0%, rgba(249, 244, 252, 0.88) 42%, rgba(249, 244, 252, 0.94) 100%)',
          }}
        />
      </div>

      {/* --- ENCABEZADO MORADO CON CURVA INFERIOR --- */}
      <header className="relative z-10 overflow-hidden bg-gradient-to-br from-[#4A0D67]/95 via-[#5E1382]/90 to-[#3B0A54]/95 pt-28 pb-20 sm:pt-32 sm:pb-24 px-6 text-white">
        {/* Foto de la familia integrada sutilmente en el header */}
        <img
          src="https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1600&q=80"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-25 mix-blend-luminosity"
        />
        <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-[#D4EB00]/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-[#FF5E7E]/25 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-extrabold text-[#D4EB00] border border-white/20 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Fiestas y Eventos Recórcholis
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Celebra tu fiesta{' '}
            <span className="text-[#D4EB00]">a lo grande</span>
          </h1>
          <p className="mx-auto mt-2.5 max-w-lg text-sm sm:text-base text-white/90">
            Cumpleaños infantiles, salidas escolares o eventos de empresa. Arma tu cotización en menos de 1 minuto.
          </p>
        </div>

        {/* Curva inferior coral y lavanda */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-9 sm:h-12"
            preserveAspectRatio="none"
          >
            <path d="M0,15 C320,5 520,55 860,62 L860,70 L0,70 Z" fill="#FF5E7E" />
            <path d="M0,40 C420,75 960,65 1440,18 L1440,70 L0,70 Z" fill="#F9F4FC" />
          </svg>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 pb-28 pt-6 sm:pt-8 sm:pb-16">
        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl p-8 sm:p-12 text-center shadow-2xl border border-[#4A0D67]/12"
          >
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#D4EB00] via-[#FF5E7E] to-[#9B4DCA]" />

            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.15 }}
              className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#D4EB00] text-[#3B0A54] shadow-lg"
            >
              <CheckCircle2 className="h-11 w-11 stroke-[2.5]" />
            </motion.div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6EFFA] px-3.5 py-1 text-xs font-extrabold text-[#4A0D67] mb-2">
              <PartyPopper className="h-3.5 w-3.5 text-[#FF5E7E]" />
              ¡Prepara el pastel!
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#3B0A54]">
              ¡Solicitud enviada!
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm sm:text-base text-[#5C3A70] leading-relaxed">
              Nuestro equipo de eventos te contactará en menos de{' '}
              <strong className="text-[#3B0A54]">24 horas</strong> con tu cotización personalizada para{' '}
              <strong className="text-[#4A0D67]">{selectedTypeLabel}</strong>.
            </p>

            {/* Resumen rápido del evento registrado */}
            <div className="mt-6 rounded-2xl bg-[#F9F4FC] border border-[#4A0D67]/10 p-4 text-left text-xs sm:text-sm space-y-1.5 text-[#5C3A70]">
              <p>
                <span className="font-bold text-[#3B0A54]">Anfitrión:</span>{' '}
                {data.fullName}
              </p>
              <p>
                <span className="font-bold text-[#3B0A54]">Sede:</span>{' '}
                {selectedVenueLabel}
              </p>
              {data.eventDate && (
                <p>
                  <span className="font-bold text-[#3B0A54]">Fecha:</span>{' '}
                  {data.eventDate} ({data.guests ?? 0} invitados)
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setDone(false);
                  setStep(0);
                  setData({ type: 'INFANTIL' });
                }}
                className="flex-1 rounded-full border border-[#4A0D67]/20 bg-[#F6EFFA] py-3.5 px-6 text-xs sm:text-sm font-extrabold text-[#3B0A54] hover:bg-[#EFE2F7] transition-colors cursor-pointer"
              >
                Cotizar otro evento
              </button>
              <Link
                href="/"
                className="flex-1 rounded-full bg-[#D4EB00] py-3.5 px-6 text-xs sm:text-sm font-extrabold text-[#3B0A54] shadow-md transition-transform hover:scale-[1.02]"
              >
                Volver al inicio
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* --- BARRA DE PROGRESO DE 3 PASOS --- */}
            <div className="mb-6 flex items-center justify-between px-2" aria-label={`Paso ${step + 1} de 3`}>
              {STEP_LABELS.map((label, i) => {
                const isActive = step === i;
                const isPast = step > i;
                return (
                  <div key={label} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold transition-all duration-300 ${
                          isActive
                            ? 'bg-[#D4EB00] text-[#3B0A54] shadow-md scale-110 ring-4 ring-[#D4EB00]/35'
                            : isPast
                            ? 'bg-[#4A0D67] text-white'
                            : 'bg-white text-[#5C3A70]/50 border border-[#4A0D67]/15'
                        }`}
                      >
                        {isPast ? '✓' : i + 1}
                      </span>
                      <span
                        className={`text-[11px] font-extrabold text-center ${
                          isActive || isPast ? 'text-[#3B0A54]' : 'text-[#5C3A70]/60'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div
                        className={`mx-2 h-1 flex-1 rounded-full transition-colors duration-300 -mt-5 ${
                          isPast ? 'bg-[#4A0D67]' : 'bg-[#4A0D67]/15'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* --- TARJETA PRINCIPAL DEL FORMULARIO --- */}
            <div className="rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-9 shadow-xl border border-[#4A0D67]/10">
              <AnimatePresence mode="wait">
                {/* PASO 1: TIPO DE CELEBRACIÓN Y DATOS DE CONTACTO */}
                {step === 0 && (
                  <motion.div
                    key="s0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF5E7E]">
                        Paso 1 de 3
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#3B0A54]">
                        ¿Qué vamos a celebrar?
                      </h2>
                    </div>

                    {/* Selector visual de tipo de fiesta */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      {TYPES.map((t) => {
                        const Icon = t.icon;
                        const isSelected = data.type === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => update({ type: t.id })}
                            className={`relative flex flex-col items-start rounded-2xl border-2 p-4 text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#4A0D67] bg-[#4A0D67] text-white shadow-lg scale-[1.02]'
                                : 'border-[#4A0D67]/12 bg-[#F9F4FC] text-[#3B0A54] hover:border-[#4A0D67]/40 hover:bg-white'
                            }`}
                          >
                            <div className="flex w-full items-center justify-between mb-2.5">
                              <span
                                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                  isSelected
                                    ? 'bg-[#D4EB00] text-[#3B0A54]'
                                    : 'bg-white text-[#FF5E7E] shadow-xs'
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                  isSelected
                                    ? 'bg-white/20 text-[#D4EB00]'
                                    : 'bg-[#EFE2F7] text-[#4A0D67]'
                                }`}
                              >
                                {t.badge}
                              </span>
                            </div>
                            <p className="text-sm font-extrabold">{t.label}</p>
                            <p
                              className={`mt-1 text-xs leading-snug ${
                                isSelected ? 'text-white/80' : 'text-[#5C3A70]'
                              }`}
                            >
                              {t.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Campos de contacto */}
                    <div className="grid gap-4 sm:grid-cols-2 pt-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="fullName"
                          className="mb-1.5 block text-xs font-extrabold text-[#3B0A54]"
                        >
                          Nombre completo
                        </label>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B4DCA]" />
                          <input
                            id="fullName"
                            placeholder="Ana Martínez"
                            value={data.fullName ?? ''}
                            onChange={(e) => update({ fullName: e.target.value })}
                            autoComplete="name"
                            className="w-full rounded-2xl bg-[#F9F4FC] border-2 border-[#4A0D67]/12 py-3.5 pl-11 pr-4 text-sm font-semibold text-[#3B0A54] outline-none transition-all placeholder:text-[#5C3A70]/40 focus:border-[#4A0D67] focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="mb-1.5 block text-xs font-extrabold text-[#3B0A54]"
                        >
                          Correo electrónico
                        </label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B4DCA]" />
                          <input
                            id="email"
                            type="email"
                            placeholder="ana@correo.com"
                            value={data.email ?? ''}
                            onChange={(e) => update({ email: e.target.value })}
                            autoComplete="email"
                            className="w-full rounded-2xl bg-[#F9F4FC] border-2 border-[#4A0D67]/12 py-3.5 pl-11 pr-4 text-sm font-semibold text-[#3B0A54] outline-none transition-all placeholder:text-[#5C3A70]/40 focus:border-[#4A0D67] focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-1.5 block text-xs font-extrabold text-[#3B0A54]"
                        >
                          Teléfono / WhatsApp
                        </label>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B4DCA]" />
                          <input
                            id="phone"
                            type="tel"
                            placeholder="55 1234 5678"
                            value={data.phone ?? ''}
                            onChange={(e) => update({ phone: e.target.value })}
                            autoComplete="tel"
                            className="w-full rounded-2xl bg-[#F9F4FC] border-2 border-[#4A0D67]/12 py-3.5 pl-11 pr-4 text-sm font-semibold text-[#3B0A54] outline-none transition-all placeholder:text-[#5C3A70]/40 focus:border-[#4A0D67] focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PASO 2: FECHA, INVITADOS Y SUCURSAL */}
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF5E7E]">
                        Paso 2 de 3
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#3B0A54]">
                        ¿Cuándo y dónde será la fiesta?
                      </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="eventDate"
                          className="mb-1.5 block text-xs font-extrabold text-[#3B0A54]"
                        >
                          Fecha estimada del evento
                        </label>
                        <div className="relative">
                          <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B4DCA]" />
                          <input
                            id="eventDate"
                            type="date"
                            value={data.eventDate ?? ''}
                            onChange={(e) => update({ eventDate: e.target.value })}
                            className="w-full rounded-2xl bg-[#F9F4FC] border-2 border-[#4A0D67]/12 py-3.5 pl-11 pr-4 text-sm font-semibold text-[#3B0A54] outline-none transition-all focus:border-[#4A0D67] focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="guests"
                          className="mb-1.5 block text-xs font-extrabold text-[#3B0A54]"
                        >
                          Número aproximado de invitados
                        </label>
                        <div className="relative">
                          <Users className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B4DCA]" />
                          <input
                            id="guests"
                            type="number"
                            min={10}
                            placeholder="40"
                            value={data.guests ?? ''}
                            onChange={(e) => update({ guests: Number(e.target.value) })}
                            className="w-full rounded-2xl bg-[#F9F4FC] border-2 border-[#4A0D67]/12 py-3.5 pl-11 pr-4 text-sm font-semibold text-[#3B0A54] outline-none transition-all placeholder:text-[#5C3A70]/40 focus:border-[#4A0D67] focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selector visual de Sucursal */}
                    <div>
                      <label className="mb-2 block text-xs font-extrabold text-[#3B0A54]">
                        Elige tu sucursal Recórcholis
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {VENUES.map((v) => {
                          const isSelected = data.venueId === v.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => update({ venueId: v.id })}
                              className={`flex items-center gap-2 rounded-2xl border-2 px-3.5 py-3 text-left text-xs font-extrabold transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#4A0D67] bg-[#4A0D67] text-white shadow-md'
                                  : 'border-[#4A0D67]/12 bg-[#F9F4FC] text-[#3B0A54] hover:border-[#4A0D67]/40 hover:bg-white'
                              }`}
                            >
                              <MapPin
                                className={`h-4 w-4 shrink-0 ${
                                  isSelected ? 'text-[#D4EB00]' : 'text-[#FF5E7E]'
                                }`}
                              />
                              <span className="truncate">{v.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PASO 3: DETALLES FINALES */}
                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF5E7E]">
                        Paso 3 de 3
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#3B0A54]">
                        ¡Últimos detalles para tu cotización!
                      </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="company"
                          className="mb-1.5 block text-xs font-extrabold text-[#3B0A54]"
                        >
                          Empresa o Escuela{' '}
                          <span className="font-normal text-[#5C3A70]">(opcional)</span>
                        </label>
                        <div className="relative">
                          <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B4DCA]" />
                          <input
                            id="company"
                            placeholder="Colegio / Empresa S.A."
                            value={data.company ?? ''}
                            onChange={(e) => update({ company: e.target.value })}
                            autoComplete="organization"
                            className="w-full rounded-2xl bg-[#F9F4FC] border-2 border-[#4A0D67]/12 py-3.5 pl-11 pr-4 text-sm font-semibold text-[#3B0A54] outline-none transition-all placeholder:text-[#5C3A70]/40 focus:border-[#4A0D67] focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="budget"
                          className="mb-1.5 block text-xs font-extrabold text-[#3B0A54]"
                        >
                          Presupuesto aprox. MXN{' '}
                          <span className="font-normal text-[#5C3A70]">(opcional)</span>
                        </label>
                        <div className="relative">
                          <Wallet className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B4DCA]" />
                          <input
                            id="budget"
                            type="number"
                            min={0}
                            placeholder="15000"
                            value={data.budget ?? ''}
                            onChange={(e) => update({ budget: Number(e.target.value) })}
                            className="w-full rounded-2xl bg-[#F9F4FC] border-2 border-[#4A0D67]/12 py-3.5 pl-11 pr-4 text-sm font-semibold text-[#3B0A54] outline-none transition-all placeholder:text-[#5C3A70]/40 focus:border-[#4A0D67] focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-1.5 block text-xs font-extrabold text-[#3B0A54]"
                      >
                        Cuéntanos qué te gustaría incluir{' '}
                        <span className="font-normal text-[#5C3A70]">(opcional)</span>
                      </label>
                      <div className="relative">
                        <MessageSquare className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-[#9B4DCA]" />
                        <textarea
                          id="message"
                          rows={3}
                          placeholder="Ej. Pistas de boliche, paquetes de comida, tarjetas Recorcard con saldo..."
                          value={data.message ?? ''}
                          onChange={(e) => update({ message: e.target.value })}
                          className="w-full resize-none rounded-2xl bg-[#F9F4FC] border-2 border-[#4A0D67]/12 py-3.5 pl-11 pr-4 text-sm font-semibold text-[#3B0A54] outline-none transition-all placeholder:text-[#5C3A70]/40 focus:border-[#4A0D67] focus:bg-white"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MENSAJE DE VALIDACIÓN / ERROR */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex items-center gap-2.5 rounded-2xl border border-[#FF5E7E]/30 bg-[#FFF0F3] px-4 py-3 text-xs sm:text-sm font-bold text-[#9E1936]"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 text-[#FF5E7E]" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* BOTONES DE NAVEGACIÓN */}
              <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#4A0D67]/20 bg-[#F6EFFA] py-3.5 px-6 text-xs sm:text-sm font-extrabold text-[#3B0A54] hover:bg-[#EFE2F7] transition-colors sm:w-1/3 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> Atrás
                  </button>
                )}
                <button
                  type="button"
                  onClick={next}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#D4EB00] py-4 px-6 text-sm sm:text-base font-extrabold text-[#3B0A54] shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    'Enviando solicitud...'
                  ) : step === 2 ? (
                    <>
                      <PartyPopper className="h-5 w-5" /> ¡Cotizar mi fiesta!
                    </>
                  ) : (
                    <>
                      Siguiente paso <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}