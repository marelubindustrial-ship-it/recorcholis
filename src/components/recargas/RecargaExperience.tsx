'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Search,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Ticket,
  Store,
  Wallet,
  ArrowLeft,
  Gift,
} from 'lucide-react';
import HUDNav from '@/components/layout/HUDNav';
import Footer from '@/components/layout/Footer';
import { formatMXN } from '@/lib/utils';
import {
  ALLOWED_TOPUP_AMOUNTS,
  type RecorcardBalance,
  type TopUpResult,
} from '@/server/recorcard/types';

type Step = 'LOOKUP' | 'AMOUNT' | 'PAY' | 'DONE';

interface ApiError {
  error: string;
}

const STEPS_META: { key: Step; label: string }[] = [
  { key: 'LOOKUP', label: 'Tarjeta' },
  { key: 'AMOUNT', label: 'Monto' },
  { key: 'PAY', label: 'Pago' },
  { key: 'DONE', label: '¡Listo!' },
];

function formatCardDisplay(digits: string) {
  if (!digits) return '••••  ••••  ••••  ••••';
  const padded = digits.padEnd(16, '•');
  return padded.match(/.{1,4}/g)?.join('  ') ?? digits;
}

// --- COMPONENTE 3D DE LA RECORCARD COMPACTA (SOLO SE MUEVE AL TOCARLA CON MOUSE O DEDO) ---
interface Recorcard3DProps {
  card: string;
  balance: RecorcardBalance | null;
  amount: number | null;
  result: TopUpResult | null;
  bonusPoints: number;
  isInteracting: boolean;
  pointerPos: React.MutableRefObject<{ x: number; y: number }>;
}

function Recorcard3DModel({
  card,
  balance,
  amount,
  result,
  bonusPoints,
  isInteracting,
  pointerPos,
}: Recorcard3DProps) {
  const cardGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!cardGroupRef.current) return;

    // Solo gira/inclina mientras el mouse está encima o el dedo está tocando la tarjeta;
    // al salir o soltar, regresa suavemente a 0 (completamente de frente).
    const targetRotY = isInteracting ? pointerPos.current.x * 0.75 : 0;
    const targetRotX = isInteracting ? -pointerPos.current.y * 0.45 : 0;

    cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      cardGroupRef.current.rotation.y,
      targetRotY,
      0.12
    );
    cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      cardGroupRef.current.rotation.x,
      targetRotX,
      0.12
    );
  });

  const mainValueText = balance
    ? formatMXN(result ? result.newBalance : balance.balance)
    : formatCardDisplay(card);

  const subLabelText = balance
    ? result
      ? 'NUEVO SALDO DISPONIBLE'
      : 'SALDO ACTUAL'
    : 'NÚMERO DE TARJETA';

  const holderText = balance ? balance.holder.toUpperCase() : 'JUGADOR RECÓRCHOLIS';
  const pointsText = balance
    ? `${(balance.points + bonusPoints).toLocaleString('es-MX')} PTS`
    : 'RECORCARD VIP';

  return (
    <group ref={cardGroupRef} scale={0.78}>
      {/* 1. Cuerpo principal de la tarjeta con bordes redondeados y acabado metálico */}
      <RoundedBox args={[3.4, 2.12, 0.07]} radius={0.14} smoothness={6}>
        <meshStandardMaterial
          color="#4A0D67"
          emissive="#250436"
          emissiveIntensity={0.35}
          metalness={0.65}
          roughness={0.22}
          envMapIntensity={1.6}
        />
      </RoundedBox>

      {/* 2. Marco / Filo luminoso verde lima alrededor del borde */}
      <RoundedBox args={[3.43, 2.15, 0.04]} radius={0.145} smoothness={6}>
        <meshStandardMaterial
          color="#D4EB00"
          emissive="#7D8C00"
          emissiveIntensity={0.25}
          metalness={0.85}
          roughness={0.18}
        />
      </RoundedBox>

      {/* ================= CARA FRONTAL (Z = +0.038) ================= */}
      <group position={[0, 0, 0.038]}>
        {/* Franja decorativa rosa coral en diagonal sutil */}
        <mesh position={[0.95, -0.55, 0.001]} rotation={[0, 0, 0.35]}>
          <planeGeometry args={[1.6, 0.95]} />
          <meshStandardMaterial
            color="#FF5E7E"
            transparent
            opacity={0.35}
            roughness={0.3}
          />
        </mesh>

        {/* Logo Recórcholis */}
        <Text
          position={[-1.45, 0.76, 0.005]}
          anchorX="left"
          anchorY="middle"
          fontSize={0.22}
          color="#FFFFFF"
          fontWeight="bold"
        >
          Recórcholis
        </Text>

        {/* Píldora Verde Lima de Puntos */}
        <RoundedBox
          args={[0.96, 0.26, 0.012]}
          radius={0.12}
          smoothness={4}
          position={[1.02, 0.76, 0.004]}
        >
          <meshStandardMaterial color="#D4EB00" roughness={0.25} />
        </RoundedBox>
        <Text
          position={[1.02, 0.76, 0.013]}
          anchorX="center"
          anchorY="middle"
          fontSize={0.1}
          color="#3B0A54"
          fontWeight="bold"
        >
          {pointsText}
        </Text>

        {/* Chip EMV Dorado en relieve */}
        <group position={[-1.18, 0.24, 0.005]}>
          <RoundedBox args={[0.42, 0.32, 0.014]} radius={0.05} smoothness={4}>
            <meshStandardMaterial
              color="#FFD000"
              metalness={0.95}
              roughness={0.16}
            />
          </RoundedBox>
          <mesh position={[0, 0.05, 0.008]}>
            <boxGeometry args={[0.38, 0.012, 0.002]} />
            <meshStandardMaterial color="#8A6000" />
          </mesh>
          <mesh position={[0, -0.05, 0.008]}>
            <boxGeometry args={[0.38, 0.012, 0.002]} />
            <meshStandardMaterial color="#8A6000" />
          </mesh>
          <mesh position={[-0.07, 0, 0.008]}>
            <boxGeometry args={[0.012, 0.28, 0.002]} />
            <meshStandardMaterial color="#8A6000" />
          </mesh>
          <mesh position={[0.07, 0, 0.008]}>
            <boxGeometry args={[0.012, 0.28, 0.002]} />
            <meshStandardMaterial color="#8A6000" />
          </mesh>
        </group>

        {/* Símbolo Contactless junto al chip */}
        <Text
          position={[-0.82, 0.24, 0.006]}
          anchorX="center"
          anchorY="middle"
          fontSize={0.16}
          color="#D4EB00"
        >
          )))
        </Text>

        {/* Etiqueta Superior (Saldo Actual / Número de Tarjeta) */}
        <Text
          position={[-1.45, -0.14, 0.005]}
          anchorX="left"
          anchorY="middle"
          fontSize={0.085}
          color="#E9D5FF"
          letterSpacing={0.08}
        >
          {subLabelText}
        </Text>

        {/* Dato Principal Dinámico (Saldo o los 16 dígitos) */}
        <Text
          position={[-1.45, -0.38, 0.006]}
          anchorX="left"
          anchorY="middle"
          fontSize={balance ? 0.28 : 0.175}
          color={balance ? '#D4EB00' : '#FFFFFF'}
          fontWeight="bold"
          letterSpacing={balance ? 0.02 : 0.06}
        >
          {mainValueText}
        </Text>

        {/* Badge flotante del monto seleccionado (+ $350) */}
        {balance && amount && !result && (
          <group position={[1.05, -0.36, 0.006]}>
            <RoundedBox args={[0.82, 0.26, 0.01]} radius={0.08} smoothness={4}>
              <meshStandardMaterial color="#FF5E7E" />
            </RoundedBox>
            <Text
              position={[0, 0, 0.008]}
              anchorX="center"
              anchorY="middle"
              fontSize={0.105}
              color="#FFFFFF"
              fontWeight="bold"
            >
              +${amount}
            </Text>
          </group>
        )}

        {/* Pie de tarjeta: Nombre del Titular y Terminación */}
        <Text
          position={[-1.45, -0.78, 0.005]}
          anchorX="left"
          anchorY="middle"
          fontSize={0.095}
          color="#FFFFFF"
          fontWeight="bold"
          letterSpacing={0.05}
        >
          {holderText}
        </Text>

        <Text
          position={[1.45, -0.78, 0.005]}
          anchorX="right"
          anchorY="middle"
          fontSize={0.09}
          color="#D4EB00"
          fontWeight="bold"
        >
          {card ? `•••• ${card.slice(-4)}` : 'PLAY PASS'}
        </Text>
      </group>

      {/* ================= CARA TRASERA (Z = -0.038, rotada 180°) ================= */}
      <group position={[0, 0, -0.038]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.56, 0.004]}>
          <boxGeometry args={[3.36, 0.34, 0.006]} />
          <meshStandardMaterial
            color="#1A0426"
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>

        <mesh position={[-0.35, 0.12, 0.004]}>
          <boxGeometry args={[2.2, 0.26, 0.006]} />
          <meshStandardMaterial color="#F9F4FC" roughness={0.6} />
        </mesh>
        <Text
          position={[-1.35, 0.12, 0.009]}
          anchorX="left"
          anchorY="middle"
          fontSize={0.08}
          color="#5C3A70"
        >
          FIRMA AUTORIZADA · RECÓRCHOLIS
        </Text>

        <RoundedBox
          args={[0.62, 0.26, 0.008]}
          radius={0.05}
          smoothness={4}
          position={[1.15, 0.12, 0.004]}
        >
          <meshStandardMaterial color="#D4EB00" />
        </RoundedBox>
        <Text
          position={[1.15, 0.12, 0.01]}
          anchorX="center"
          anchorY="middle"
          fontSize={0.1}
          color="#3B0A54"
          fontWeight="bold"
        >
          {card ? card.slice(-3) : '777'}
        </Text>

        <Text
          position={[0, -0.35, 0.005]}
          anchorX="center"
          anchorY="middle"
          fontSize={0.08}
          color="#E9D5FF"
          maxWidth={2.9}
          textAlign="center"
        >
          Válida en todas las sucursales Recórcholis de México. Recarga saldo y acumula tickets para canjear por premios.
        </Text>

        <mesh position={[1.22, -0.74, 0.005]}>
          <circleGeometry args={[0.16, 32]} />
          <meshStandardMaterial
            color="#FFD000"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
        <Text
          position={[1.22, -0.74, 0.008]}
          anchorX="center"
          anchorY="middle"
          fontSize={0.15}
          color="#3B0A54"
          fontWeight="bold"
        >
          R
        </Text>
      </group>
    </group>
  );
}

export default function RecargaExperience() {
  const [step, setStep] = useState<Step>('LOOKUP');
  const [card, setCard] = useState('');
  const [balance, setBalance] = useState<RecorcardBalance | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [method, setMethod] = useState<'CARD' | 'PAYPAL' | 'OXXO'>('CARD');
  const [coupon, setCoupon] = useState<string>('');
  const [result, setResult] = useState<TopUpResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado y coordenadas normalizadas (-1 a 1) para mover la tarjeta SOLO al tocarla
  const [isInteracting, setIsInteracting] = useState(false);
  const pointerPos = useRef({ x: 0, y: 0 });

  const updatePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerPos.current = {
      x: Math.max(-1, Math.min(1, nx)),
      y: Math.max(-1, Math.min(1, ny)),
    };
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlMonto = Number(params.get('monto'));
    const urlCupon = params.get('cupon');

    if (urlMonto && ALLOWED_TOPUP_AMOUNTS.includes(urlMonto)) {
      setAmount(urlMonto);
    }
    if (urlCupon) {
      setCoupon(urlCupon.toUpperCase());
    }
  }, []);

  const discountRate =
    coupon === 'RECOR10' ? 0.1 : coupon === 'RECOR5' ? 0.05 : 0;
  const discountAmount = amount ? Math.round(amount * discountRate) : 0;
  const finalToPay = amount ? Math.max(0, amount - discountAmount) : 0;
  const bonusPoints = amount ? Math.floor(amount / 10) : 0;

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
          couponCode: coupon || undefined,
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

  const cardVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, y: -18, scale: 0.98, transition: { duration: 0.25 } },
  };

  const currentStepIndex = STEPS_META.findIndex((s) => s.key === step);

  return (
    <div className="min-h-dvh bg-[#F9F4FC] text-[#3B0A54] selection:bg-[#D4EB00] selection:text-[#3B0A54] relative overflow-hidden">
      <HUDNav />

      {/* --- ENCABEZADO MORADO CON CURVA INFERIOR --- */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#4A0D67] via-[#5E1382] to-[#3B0A54] pt-28 pb-20 sm:pt-32 sm:pb-24 px-6 text-white">
        <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-[#D4EB00]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-[#FF5E7E]/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-extrabold text-[#D4EB00] border border-white/20 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Recarga en línea al instante
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Recarga tu{' '}
            <span className="text-[#D4EB00]">Recorcard</span>
          </h1>
          <p className="mx-auto mt-2.5 max-w-lg text-sm sm:text-base text-white/85">
            Consulta tu saldo, elige cuánto quieres jugar y evita filas al llegar a tu sucursal.
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

      <main className="relative z-10 mx-auto max-w-xl px-4 pb-28 pt-4 sm:pt-6 sm:pb-16 flex flex-col items-center">
        {/* --- INDICADOR DE PASOS AMIGABLE --- */}
        <div className="mb-3 flex w-full items-center justify-between px-2">
          {STEPS_META.map((s, i) => {
            const isActive = i === currentStepIndex;
            const isPast = i < currentStepIndex;
            return (
              <div key={s.key} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold transition-all duration-300 ${
                      isActive
                        ? 'bg-[#D4EB00] text-[#3B0A54] shadow-md scale-110 ring-4 ring-[#D4EB00]/30'
                        : isPast
                        ? 'bg-[#4A0D67] text-white'
                        : 'bg-white text-[#5C3A70]/50 border border-[#4A0D67]/15'
                    }`}
                  >
                    {isPast ? '✓' : i + 1}
                  </span>
                  <span
                    className={`text-[11px] font-extrabold ${
                      isActive || isPast ? 'text-[#3B0A54]' : 'text-[#5C3A70]/50'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS_META.length - 1 && (
                  <div
                    className={`mx-2 h-1 flex-1 rounded-full transition-colors duration-300 -mt-5 ${
                      isPast ? 'bg-[#4A0D67]' : 'bg-[#4A0D67]/12'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* --- TARJETA RECORCARD 3D COMPACTA (SOLO SE MUEVE AL TOCARLA CON MOUSE O DEDO) --- */}
        <div
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') {
              setIsInteracting(true);
              updatePointer(e);
            }
          }}
          onPointerDown={(e) => {
            setIsInteracting(true);
            updatePointer(e);
          }}
          onPointerMove={(e) => {
            if (isInteracting) updatePointer(e);
          }}
          onPointerUp={() => setIsInteracting(false)}
          onPointerLeave={() => setIsInteracting(false)}
          onPointerCancel={() => setIsInteracting(false)}
          className="relative mb-4 h-48 sm:h-52 w-full max-w-[360px] cursor-grab active:cursor-grabbing touch-none select-none"
        >
          <Canvas camera={{ position: [0, 0, 4.1], fov: 36 }}>
            <ambientLight intensity={1.35} />
            <directionalLight position={[6, 8, 6]} intensity={2.8} color="#ffffff" />
            <pointLight position={[-6, -4, 4]} intensity={2.5} color="#FF5E7E" />
            <pointLight position={[4, 4, -5]} intensity={2.5} color="#D4EB00" />
            <Environment preset="city" />
            <Recorcard3DModel
              card={card}
              balance={balance}
              amount={amount}
              result={result}
              bonusPoints={bonusPoints}
              isInteracting={isInteracting}
              pointerPos={pointerPos}
            />
          </Canvas>
        </div>

        {/* --- CONTENEDOR DE PASOS --- */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {/* ALERTA DE ERROR */}
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 flex items-center gap-3 rounded-2xl border border-[#FF5E7E]/30 bg-[#FFF0F3] p-4 text-sm text-[#9E1936] shadow-sm"
              >
                <AlertTriangle className="h-5 w-5 shrink-0 text-[#FF5E7E]" />
                <p className="font-bold">{error}</p>
              </motion.div>
            )}

            {/* PASO 1: CONSULTAR TARJETA */}
            {step === 'LOOKUP' && (
              <motion.form
                key="lookup"
                onSubmit={lookup}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full rounded-3xl bg-white p-6 sm:p-8 shadow-lg border border-[#4A0D67]/10"
              >
                <label
                  htmlFor="card"
                  className="mb-2 block text-sm font-extrabold text-[#3B0A54]"
                >
                  Ingresa los 16 dígitos de tu Recorcard
                </label>
                <p className="mb-4 text-xs text-[#5C3A70]">
                  Los encuentras al reverso de tu tarjeta física debajo del código de barras.
                </p>

                <div className="relative">
                  <CreditCard className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9B4DCA]" />
                  <input
                    id="card"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="6012345678901234"
                    value={card}
                    onChange={(e) => setCard(e.target.value.replace(/\D/g, ''))}
                    className="w-full rounded-2xl bg-[#F9F4FC] border-2 border-[#4A0D67]/15 py-4 pl-12 pr-4 font-mono text-lg tracking-widest text-[#3B0A54] font-bold outline-none transition-all placeholder:text-[#5C3A70]/35 focus:border-[#4A0D67] focus:bg-white"
                    maxLength={19}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || card.length < 12}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#D4EB00] py-4 text-sm sm:text-base font-extrabold text-[#3B0A54] shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {loading ? 'Buscando tarjeta...' : 'Continuar'}
                  {!loading && <Search className="h-4 w-4 stroke-[2.5]" />}
                </button>

                <div className="mt-5 pt-4 border-t border-[#4A0D67]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5C3A70]">
                  <span>¿No tienes tu tarjeta a la mano?</span>
                  <button
                    type="button"
                    onClick={() => setCard('6012345678901234')}
                    className="rounded-full bg-[#F6EFFA] hover:bg-[#EFE2F7] px-3.5 py-1.5 font-extrabold text-[#4A0D67] transition-colors cursor-pointer"
                  >
                    Usar tarjeta demo ✨
                  </button>
                </div>
              </motion.form>
            )}

            {/* PASO 2: ELEGIR MONTO */}
            {step === 'AMOUNT' && balance && (
              <motion.div
                key="amount"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full rounded-3xl bg-white p-6 sm:p-8 shadow-lg border border-[#4A0D67]/10"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#3B0A54]">
                      ¿Cuánto quieres recargar?
                    </h2>
                    <p className="text-xs text-[#5C3A70]">
                      Cada $10 pesos te dan 1 punto extra para premios
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('LOOKUP')}
                    className="text-xs font-extrabold text-[#FF5E7E] hover:underline cursor-pointer"
                  >
                    Cambiar tarjeta
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ALLOWED_TOPUP_AMOUNTS.map((m) => {
                    const isSelected = amount === m;
                    const pts = Math.floor(m / 10);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setAmount(m)}
                        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#4A0D67] bg-[#4A0D67] text-white shadow-lg scale-[1.03]'
                            : 'border-[#4A0D67]/12 bg-[#F9F4FC] text-[#3B0A54] hover:border-[#4A0D67]/40 hover:bg-white'
                        }`}
                      >
                        <span className="text-xl font-black">${m}</span>
                        <span
                          className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                            isSelected
                              ? 'bg-[#D4EB00] text-[#3B0A54]'
                              : 'bg-white text-[#6A1B9A]'
                          }`}
                        >
                          <Ticket className="h-3 w-3" /> +{pts} pts
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl bg-[#F9F4FC] p-4 border border-[#4A0D67]/10">
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-extrabold text-[#3B0A54]">
                    <Gift className="h-4 w-4 text-[#FF5E7E]" />
                    ¿Ganaste un cupón en Promociones?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej. RECOR10"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase().trim())}
                      className="flex-1 rounded-xl bg-white border border-[#4A0D67]/15 px-3.5 py-2 font-mono text-xs font-bold uppercase text-[#3B0A54] outline-none focus:border-[#4A0D67]"
                    />
                    {discountRate > 0 && (
                      <span className="inline-flex items-center rounded-xl bg-[#D4EB00] px-3 py-1.5 text-xs font-extrabold text-[#3B0A54]">
                        -{discountRate * 100}% aplicado
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!amount}
                  onClick={() => setStep('PAY')}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#D4EB00] py-4 text-sm sm:text-base font-extrabold text-[#3B0A54] shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  Continuar al pago <Zap className="h-4 w-4 fill-[#3B0A54]" />
                </button>
              </motion.div>
            )}

            {/* PASO 3: MÉTODO DE PAGO */}
            {step === 'PAY' && (
              <motion.form
                key="pay"
                onSubmit={pay}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full rounded-3xl bg-white p-6 sm:p-8 shadow-lg border border-[#4A0D67]/10"
              >
                <h2 className="mb-1 text-lg font-extrabold text-[#3B0A54]">
                  Elige tu método de pago
                </h2>
                <p className="mb-5 text-xs text-[#5C3A70]">
                  Tu saldo se abona de forma segura e inmediata.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'CARD' as const, label: 'Tarjeta', icon: CreditCard },
                    { id: 'PAYPAL' as const, label: 'PayPal', icon: Wallet },
                    { id: 'OXXO' as const, label: 'OXXO', icon: Store },
                  ].map(({ id, label, icon: Icon }) => {
                    const isSelected = method === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setMethod(id)}
                        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 py-4 px-2 text-xs font-extrabold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#4A0D67] bg-[#4A0D67] text-white shadow-md scale-[1.03]'
                            : 'border-[#4A0D67]/12 bg-[#F9F4FC] text-[#3B0A54] hover:border-[#4A0D67]/35'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            isSelected ? 'text-[#D4EB00]' : 'text-[#FF5E7E]'
                          }`}
                        />
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-2 rounded-2xl bg-[#F9F4FC] p-5 border border-[#4A0D67]/10 text-sm">
                  <div className="flex justify-between text-[#5C3A70]">
                    <span>Saldo a abonar</span>
                    <span className="font-bold text-[#3B0A54]">
                      {formatMXN(amount ?? 0)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#FF5E7E] font-bold">
                      <span>Descuento cupón ({coupon})</span>
                      <span>-{formatMXN(discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#4A0D67]/10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-extrabold text-[#3B0A54]">
                      <ShieldCheck className="h-4 w-4 text-[#4A0D67]" />
                      Total a pagar
                    </span>
                    <span className="text-2xl font-black text-[#4A0D67]">
                      {formatMXN(finalToPay)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setStep('AMOUNT')}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#4A0D67]/20 bg-[#F6EFFA] py-3.5 px-6 text-xs font-extrabold text-[#3B0A54] hover:bg-[#EFE2F7] sm:w-1/3 cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-full bg-[#D4EB00] py-4 px-6 text-sm sm:text-base font-extrabold text-[#3B0A54] shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Procesando pago...' : `Pagar ${formatMXN(finalToPay)}`}
                  </button>
                </div>
              </motion.form>
            )}

            {/* PASO 4: RECARGA EXITOSA */}
            {step === 'DONE' && result && (
              <motion.div
                key="done"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="w-full rounded-3xl bg-white p-7 sm:p-10 shadow-xl border border-[#4A0D67]/10 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#D4EB00] via-[#FF5E7E] to-[#9B4DCA]" />

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.15 }}
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4EB00] text-[#3B0A54] shadow-md"
                >
                  <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
                </motion.div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B0A54]">
                  {result.status === 'PENDING'
                    ? '¡Referencia generada!'
                    : '¡Recarga exitosa!'}
                </h2>
                <p className="mt-1 text-sm text-[#5C3A70]">
                  Tu Recorcard ya está lista para usarse en cualquier sucursal.
                </p>

                <div className="mt-6 rounded-2xl bg-[#F9F4FC] border border-[#4A0D67]/10 p-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#5C3A70]">Folio de operación</span>
                    <span className="font-mono font-bold text-[#3B0A54]">
                      {result.transactionId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#4A0D67]/10">
                    <span className="font-bold text-[#3B0A54]">Nuevo saldo</span>
                    <span className="text-2xl font-black text-[#4A0D67]">
                      {formatMXN(result.newBalance)}
                    </span>
                  </div>
                </div>

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('LOOKUP');
                      setResult(null);
                      setAmount(null);
                      setCard('');
                    }}
                    className="flex-1 rounded-full bg-[#D4EB00] py-3.5 px-5 text-xs sm:text-sm font-extrabold text-[#3B0A54] shadow-md transition-transform hover:scale-[1.02] cursor-pointer"
                  >
                    Hacer otra recarga
                  </button>
                  <Link
                    href="/"
                    className="flex-1 rounded-full border border-[#4A0D67]/20 bg-[#F6EFFA] py-3.5 px-5 text-xs sm:text-sm font-extrabold text-[#3B0A54] hover:bg-[#EFE2F7] transition-colors"
                  >
                    Volver al inicio
                  </Link>
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