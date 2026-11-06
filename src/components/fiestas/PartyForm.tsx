'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, PartyPopper, CheckCircle2 } from 'lucide-react';
import HUDNav from '@/components/layout/HUDNav';
import Footer from '@/components/layout/Footer';
import { GlassPanel } from '@/components/ui/GlassPanel';
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
  { id: 'INFANTIL', label: 'Fiesta infantil', desc: 'Cumpleaños con temática arcade' },
  { id: 'ESCOLAR', label: 'Evento escolar', desc: 'Día del niño, graduaciones' },
  { id: 'CORPORATIVO', label: 'Corporativo', desc: 'Team building y fin de año' },
] as const;

type FormData = Partial<LeadInput>;

/**
 * Formulario multipaso B2B/B2C con validación Zod por paso.
 */
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

  if (done) {
    return (
      <div className="min-h-dvh">
        <HUDNav />
        <main className="flex min-h-dvh items-center justify-center px-6 pb-24 pt-24">
          <GlassPanel strong className="max-w-md p-10 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-neon-cyan" />
            <h1 className="mt-4 font-arcade text-sm leading-relaxed text-ink">
              ¡SOLICITUD ENVIADA!
            </h1>
            <p className="mt-4 text-sm text-ink-dim">
              Nuestro equipo de eventos te contactará en menos de 24 horas con tu cotización.
              Prepara el pastel.
            </p>
            <a href="/" className="btn-arcade mt-8 w-full">Volver al arcade</a>
          </GlassPanel>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <HUDNav />
      <main className="mx-auto max-w-2xl px-6 pb-32 pt-24 md:pb-16">
        <p className="hud-label mb-3">portal de eventos</p>
        <h1 className="font-arcade text-lg leading-relaxed text-ink sm:text-2xl sm:leading-relaxed">
          ARMA TU <span className="text-glow-red text-brand-bright">NIVEL DE FIESTA</span>
        </h1>

        {/* Progress bar HUD */}
        <div className="mt-6 flex gap-2" aria-label={`Paso ${step + 1} de 3`}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-neon-cyan"
                animate={{ width: step >= i ? '100%' : '0%' }}
                transition={{ duration: 0.35 }}
              />
            </div>
          ))}
        </div>

        <GlassPanel className="mt-8 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="s0"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                className="space-y-5"
              >
                <p className="hud-label">paso 01 · ¿qué celebramos?</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => update({ type: t.id })}
                      className={`rounded-xl border p-4 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan ${
                        data.type === t.id
                          ? 'border-brand bg-brand/15 shadow-neon-red'
                          : 'border-white/10 bg-void/50 hover:border-white/30'
                      }`}
                    >
                      <p className="font-arcade text-[9px] uppercase tracking-widest text-ink">{t.label}</p>
                      <p className="mt-2 text-xs text-ink-dim">{t.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="hud-label mb-2 block">nombre completo</label>
                    <input
                      id="fullName"
                      className="input-arcade"
                      placeholder="Ana Martínez"
                      value={data.fullName ?? ''}
                      onChange={(e) => update({ fullName: e.target.value })}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="hud-label mb-2 block">correo</label>
                    <input
                      id="email"
                      type="email"
                      className="input-arcade"
                      placeholder="ana@correo.com"
                      value={data.email ?? ''}
                      onChange={(e) => update({ email: e.target.value })}
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="hud-label mb-2 block">teléfono</label>
                    <input
                      id="phone"
                      type="tel"
                      className="input-arcade"
                      placeholder="+52 55 1234 5678"
                      value={data.phone ?? ''}
                      onChange={(e) => update({ phone: e.target.value })}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                className="space-y-5"
              >
                <p className="hud-label">paso 02 · fecha y sede</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="eventDate" className="hud-label mb-2 block">fecha del evento</label>
                    <input
                      id="eventDate"
                      type="date"
                      className="input-arcade"
                      value={data.eventDate ?? ''}
                      onChange={(e) => update({ eventDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="guests" className="hud-label mb-2 block">invitados</label>
                    <input
                      id="guests"
                      type="number"
                      min={10}
                      className="input-arcade"
                      placeholder="40"
                      value={data.guests ?? ''}
                      onChange={(e) => update({ guests: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="venue" className="hud-label mb-2 block">sucursal</label>
                  <select
                    id="venue"
                    className="input-arcade"
                    value={data.venueId ?? ''}
                    onChange={(e) => update({ venueId: e.target.value })}
                  >
                    <option value="" disabled>Elige una sucursal…</option>
                    {VENUES.map((v) => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                className="space-y-5"
              >
                <p className="hud-label">paso 03 · detalles finales</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="company" className="hud-label mb-2 block">
                      empresa <span className="text-ink-dim/50">(opcional)</span>
                    </label>
                    <input
                      id="company"
                      className="input-arcade"
                      placeholder="Grupo Ejemplo S.A."
                      value={data.company ?? ''}
                      onChange={(e) => update({ company: e.target.value })}
                      autoComplete="organization"
                    />
                  </div>
                  <div>
                    <label htmlFor="budget" className="hud-label mb-2 block">
                      presupuesto aprox. <span className="text-ink-dim/50">(opcional)</span>
                    </label>
                    <input
                      id="budget"
                      type="number"
                      min={0}
                      className="input-arcade"
                      placeholder="15000"
                      value={data.budget ?? ''}
                      onChange={(e) => update({ budget: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="hud-label mb-2 block">
                    cuéntanos más <span className="text-ink-dim/50">(opcional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="input-arcade resize-none"
                    placeholder="Temática, horario, alimentos, torneos…"
                    value={data.message ?? ''}
                    onChange={(e) => update({ message: e.target.value })}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-sm text-brand-bright"
            >
              {error}
            </motion.p>
          )}

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="btn-ghost" disabled={loading}>
                <ArrowLeft className="h-4 w-4" /> Atrás
              </button>
            )}
            <button onClick={next} className="btn-arcade flex-1" disabled={loading}>
              {loading ? 'Enviando…' : step === 2 ? (
                <>
                  <PartyPopper className="h-4 w-4" /> Solicitar cotización
                </>
              ) : (
                <>
                  Siguiente <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </GlassPanel>
      </main>
      <Footer />
    </div>
  );
}
