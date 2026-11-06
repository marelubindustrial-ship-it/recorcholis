'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Search, Zap, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Gamepad2 } from 'lucide-react';
import HUDNav from '@/components/layout/HUDNav';
import Footer from '@/components/layout/Footer';
import { formatMXN } from '@/lib/utils';
import { ALLOWED_TOPUP_AMOUNTS, type RecorcardBalance, type TopUpResult } from '@/server/recorcard/types';

type Step = 'LOOKUP' | 'AMOUNT' | 'PAY' | 'DONE';

interface ApiError {
  error: string;
}

export default function RecargaExperience() {
  const [step, setStep] = useState<Step>('LOOKUP');
  const [card, setCard] = useState('');
  const [balance, setBalance] = useState<RecorcardBalance | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [method, setMethod] = useState<'CARD' | 'PAYPAL' | 'OXXO'>('CARD');
  const [result, setResult] = useState<TopUpResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/recorcard/saldo?card=${card.trim()}`);
      const data = (await res.json()) as RecorcardBalance | ApiError;
      if (!res.ok) throw new Error('error' in data ? data.error : 'No se pudo consultar.');
      setBalance(data as RecorcardBalance);
      setStep('AMOUNT');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de red.');
    } finally {
      setLoading(false);
    }
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/recorcard/recarga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber: card.trim(),
          amount,
          paymentMethod: method,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const data = (await res.json()) as TopUpResult | ApiError;
      if (!res.ok) throw new Error('error' in data ? data.error : 'Pago rechazado.');
      setResult(data as TopUpResult);
      setStep('DONE');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de red.');
    } finally {
      setLoading(false);
    }
  }

  // Variantes de animación para Framer Motion (Suaves y estilo Lusion)
  const fadeVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-dvh bg-[#FAFAFA] text-black selection:bg-[#FF003C] selection:text-white relative overflow-hidden">
      <HUDNav />

      {/* Marca de agua estilo videojuego en el fondo */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] flex items-center justify-center w-full overflow-hidden">
        <span className="font-arcade text-[15vw] whitespace-nowrap">INSERT COIN</span>
      </div>

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-32 pt-28 md:pt-40 md:pb-16 flex flex-col items-center">
        
        {/* TÍTULO HERO */}
        <div className="text-center mb-8 md:mb-12 w-full">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#0055FF] mb-3 font-bold">
            // Gateway Recorcard
          </p>
          <h1 className="font-arcade text-3xl sm:text-5xl leading-none text-black">
            RECARGA TU <br className="sm:hidden" />
            <span className="text-[#FF003C]">RECORCARD</span>
          </h1>
        </div>

        {/* INDICADOR DE PASOS (Estilo Progress Bar Minimalista) */}
        <div className="flex items-center justify-center gap-2 mb-10 font-mono text-[10px] tracking-[0.2em] font-bold">
          {(['LOOKUP', 'AMOUNT', 'PAY', 'DONE'] as Step[]).map((s, i) => {
            const isActive = step === s;
            const isPast = ['LOOKUP', 'AMOUNT', 'PAY', 'DONE'].indexOf(step) > i;
            const isDone = step === 'DONE' && s === 'DONE';
            
            return (
              <div key={s} className="flex items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-300 ${
                  isActive || isDone ? 'bg-[#FF003C] text-white' : isPast ? 'bg-black text-white' : 'bg-zinc-200 text-zinc-400'
                }`}>
                  {i + 1}
                </span>
                {i < 3 && (
                  <div className={`h-[2px] w-4 sm:w-8 transition-colors duration-300 ${isPast ? 'bg-black' : 'bg-zinc-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* CONTENEDOR ANIMADO DEL FORMULARIO */}
        <div className="w-full relative">
          <AnimatePresence mode="wait">
            
            {/* ERROR TOAST */}
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 flex items-center gap-3 rounded-xl border-l-4 border-[#FF003C] bg-white p-4 text-sm text-black shadow-lg"
              >
                <AlertTriangle className="h-5 w-5 shrink-0 text-[#FF003C]" />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}

            {/* PASO 1: LOOKUP (Ingresar Tarjeta) */}
            {step === 'LOOKUP' && (
              <motion.form
                key="lookup"
                onSubmit={lookup}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-zinc-100 w-full"
              >
                <label htmlFor="card" className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-3 block font-bold">
                  Número de Tarjeta
                </label>
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <CreditCard className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                    <input
                      id="card"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="6012 3456 7890 1234"
                      value={card}
                      onChange={(e) => setCard(e.target.value.replace(/\D/g, ''))}
                      className="w-full rounded-2xl bg-zinc-50 border-2 border-zinc-100 py-4 pl-14 pr-4 font-mono text-lg tracking-[0.2em] text-black outline-none transition-all placeholder:text-zinc-300 focus:border-[#FF003C] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,0,60,0.1)]"
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 font-mono text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-[#FF003C] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none" 
                    disabled={loading || card.length < 12}
                  >
                    {loading ? 'Consultando...' : 'Consultar Saldo'}
                    {!loading && <Search className="h-4 w-4 transition-transform group-hover:scale-110" />}
                  </button>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-400 font-mono">
                  <Gamepad2 className="h-4 w-4" />
                  <span>Demo: prueba con <code className="text-[#0055FF] font-bold">6012345678901234</code></span>
                </div>
              </motion.form>
            )}

            {/* PASO 2: AMOUNT (Elegir Monto) */}
            {step === 'AMOUNT' && balance && (
              <motion.div
                key="amount"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-zinc-100 w-full"
              >
                {/* HUD de Saldo */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 bg-black rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#FF003C] opacity-20 blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Saldo Actual</p>
                    <p className="font-arcade text-4xl text-white">
                      {formatMXN(balance.balance)}
                    </p>
                    <p className="mt-1 text-xs font-mono text-zinc-300">
                      JUGADOR: <span className="text-[#FF003C]">{balance.holder}</span> · XP: {balance.points.toLocaleString('es-MX')} PTS
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setStep('LOOKUP')}
                    className="relative z-10 text-[10px] font-mono uppercase tracking-widest underline decoration-zinc-600 underline-offset-4 hover:text-[#0055FF] transition-colors"
                  >
                    Cambiar tarjeta
                  </button>
                </div>

                <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-4 font-bold text-center">
                  Elige tu nivel de recarga
                </p>
                
                {/* Grid de Montos Estilo Arcade Buttons */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {ALLOWED_TOPUP_AMOUNTS.map((m) => {
                    const isSelected = amount === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setAmount(m)}
                        className={`rounded-xl border-2 py-4 font-arcade text-sm transition-all focus:outline-none ${
                          isSelected
                            ? 'border-[#FF003C] bg-[#FF003C] text-white shadow-[0_10px_20px_rgba(255,0,60,0.3)] scale-105 z-10'
                            : 'border-zinc-100 bg-zinc-50 text-black hover:border-zinc-300 hover:bg-zinc-100'
                        }`}
                      >
                        ${m}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0055FF] py-4 mt-8 font-mono text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-[0_10px_20px_rgba(0,85,255,0.2)]"
                  disabled={!amount}
                  onClick={() => setStep('PAY')}
                >
                  Continuar <Zap className="h-4 w-4 transition-transform group-hover:scale-125" />
                </button>
              </motion.div>
            )}

            {/* PASO 3: PAY (Pagar) */}
            {step === 'PAY' && (
              <motion.form
                key="pay"
                onSubmit={pay}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-zinc-100 w-full"
              >
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-4 font-bold text-center">
                  Método de Pago
                </p>
                
                <div className="grid gap-3 sm:grid-cols-3">
                  {(['CARD', 'PAYPAL', 'OXXO'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`rounded-xl border-2 px-2 py-4 font-mono text-[10px] font-bold uppercase tracking-widest transition-all focus:outline-none ${
                        method === m
                          ? 'border-black bg-black text-white shadow-lg scale-105 z-10'
                          : 'border-zinc-100 bg-zinc-50 text-zinc-500 hover:border-zinc-300 hover:text-black'
                      }`}
                    >
                      {m === 'CARD' ? 'Tarjeta' : m === 'PAYPAL' ? 'PayPal' : 'OXXO'}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between p-5 bg-zinc-50 border border-zinc-100 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#0055FF]" />
                    <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Total a recargar</span>
                  </div>
                  <span className="font-arcade text-2xl text-black">{formatMXN(amount ?? 0)}</span>
                </div>

                <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    type="button"
                    className="rounded-2xl border-2 border-zinc-200 bg-transparent py-4 px-6 font-mono text-xs font-bold uppercase tracking-widest text-zinc-600 transition-all hover:bg-zinc-50 hover:text-black sm:w-1/3 disabled:opacity-50"
                    onClick={() => setStep('AMOUNT')}
                    disabled={loading}
                  >
                    Atrás
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 rounded-2xl bg-[#FF003C] py-4 px-6 font-mono text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 shadow-[0_10px_20px_rgba(255,0,60,0.2)]" 
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : `Pagar ${formatMXN(amount ?? 0)}`}
                  </button>
                </div>
              </motion.form>
            )}

            {/* PASO 4: DONE (Éxito) */}
            {step === 'DONE' && result && (
              <motion.div
                key="done"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-zinc-100 w-full text-center relative overflow-hidden"
              >
                {/* Decoración de confeti/brillo sutil */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF003C] via-[#0055FF] to-[#FF003C]" />
                
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black mb-6"
                >
                  <CheckCircle2 className="h-10 w-10 text-[#0055FF]" />
                </motion.div>
                
                <h2 className="font-arcade text-xl sm:text-2xl text-black mb-2">
                  {result.status === 'PENDING' ? 'RECARGA PENDIENTE' : '¡RECARGA EXITOSA!'}
                </h2>
                
                <div className="inline-block mt-4 text-sm font-mono text-zinc-500 bg-zinc-50 border border-zinc-100 rounded-xl p-4 w-full">
                  <p className="mb-2">FOLIO: <span className="font-bold text-black">{result.transactionId}</span></p>
                  <p>NUEVO SALDO: <span className="font-bold text-[#FF003C] text-lg">{formatMXN(result.newBalance)}</span></p>
                </div>
                
                <div className="mt-8 flex flex-col gap-3">
                  <button
                    className="w-full rounded-2xl bg-black py-4 font-mono text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[#0055FF] active:scale-[0.98] shadow-lg"
                    onClick={() => {
                      setStep('LOOKUP');
                      setResult(null);
                      setAmount(null);
                      setCard(''); // Opcional: limpiar tarjeta para nueva recarga
                    }}
                  >
                    Hacer otra recarga
                  </button>
                  <a 
                    href="/" 
                    className="w-full rounded-2xl border-2 border-zinc-200 bg-transparent py-4 font-mono text-xs font-bold uppercase tracking-widest text-zinc-500 transition-all hover:bg-zinc-50 hover:text-black"
                  >
                    Volver al inicio
                  </a>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}