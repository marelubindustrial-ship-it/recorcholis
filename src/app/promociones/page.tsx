'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  Play,
  Copy,
  Check,
  X,
  ArrowRight,
  Timer,
  Star,
} from 'lucide-react';
import HUDNav from '@/components/layout/HUDNav';
import Footer from '@/components/layout/Footer';

type ItemType = 'coin' | 'ticket' | 'bomb';

interface FallingItem {
  id: number;
  x: number; // porcentaje 8% - 92%
  y: number; // porcentaje 0% - 100%
  speed: number;
  type: ItemType;
}

interface FloatingFeedback {
  id: number;
  x: number;
  text: string;
  positive: boolean;
}

const GAME_DURATION = 20; // segundos

export default function PromocionesPage() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [catcherX, setCatcherX] = useState(50); // porcentaje horizontal (0-100)
  const [items, setItems] = useState<FallingItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FloatingFeedback[]>([]);
  const [shake, setShake] = useState(false);
  const [copied, setCopied] = useState(false);

  const arenaRef = useRef<HTMLDivElement>(null);
  const catcherXRef = useRef(50);
  const scoreRef = useRef(0);
  const nextIdRef = useRef(1);

  // Actualizar referencia del receptor para lecturas instantáneas en el loop
  const updateCatcherPosition = (clientX: number) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(10, Math.min(90, relX));
    catcherXRef.current = clamped;
    setCatcherX(clamped);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return;
    updateCatcherPosition(e.clientX);
  };

  // Iniciar / Reiniciar partida
  const startGame = () => {
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(GAME_DURATION);
    setItems([]);
    setFeedbacks([]);
    setCopied(false);
    setGameState('playing');
  };

  // Temporizador de 20 segundos
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Generador de fichas, tickets y bombas
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawner = setInterval(() => {
      const rand = Math.random();
      let type: ItemType = 'coin';
      if (rand > 0.78) type = 'bomb';
      else if (rand > 0.52) type = 'ticket';

      const newItem: FallingItem = {
        id: nextIdRef.current++,
        x: 10 + Math.random() * 80,
        y: -8,
        speed: 1.35 + Math.random() * 0.9,
        type,
      };

      setItems((prev) => [...prev, newItem]);
    }, 480);

    return () => clearInterval(spawner);
  }, [gameState]);

  // Motor de física y detección de colisiones (60 FPS aprox)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = setInterval(() => {
      setItems((prevItems) => {
        const remaining: FallingItem[] = [];

        for (const item of prevItems) {
          const nextY = item.y + item.speed;

          // Zona de captura de la Recorcard (entre 78% y 90% vertical, y +/- 13% horizontal)
          const hitVertical = nextY >= 78 && nextY <= 90;
          const hitHorizontal = Math.abs(item.x - catcherXRef.current) <= 13;

          if (hitVertical && hitHorizontal) {
            let delta = 10;
            let label = '+10';
            let positive = true;

            if (item.type === 'ticket') {
              delta = 25;
              label = '+25';
            } else if (item.type === 'bomb') {
              delta = -15;
              label = '-15';
              positive = false;
              setShake(true);
              setTimeout(() => setShake(false), 260);
            }

            const updatedScore = Math.max(0, scoreRef.current + delta);
            scoreRef.current = updatedScore;
            setScore(updatedScore);

            const fbId = nextIdRef.current++;
            setFeedbacks((prev) => [...prev, { id: fbId, x: item.x, text: label, positive }]);
            setTimeout(() => {
              setFeedbacks((prev) => prev.filter((f) => f.id !== fbId));
            }, 650);

            continue; // El objeto fue atrapado, no sigue cayendo
          }

          if (nextY < 105) {
            remaining.push({ ...item, y: nextY });
          }
        }

        return remaining;
      });
    }, 24);

    return () => clearInterval(loop);
  }, [gameState]);

  // Cálculo del descuento obtenido según puntaje
  const getReward = () => {
    if (score >= 120) {
      return {
        won: true,
        discount: '10% OFF',
        code: 'RECOR10',
        title: '¡Puntaje Legendario!',
        desc: 'Atrapaste una lluvia de fichas y desbloqueaste el descuento máximo.',
      };
    }
    if (score >= 60) {
      return {
        won: true,
        discount: '5% OFF',
        code: 'RECOR5',
        title: '¡Buen trabajo, Jugador!',
        desc: 'Superaste el reto y ganaste un descuento directo para tu Recorcard.',
      };
    }
    return {
      won: false,
      discount: null,
      code: null,
      title: '¡Casi lo logras!',
      desc: 'Necesitas al menos 60 puntos para desbloquear tu descuento. ¡Inténtalo de nuevo!',
    };
  };

  const reward = getReward();

  const handleCopyCode = () => {
    if (!reward.code) return;
    navigator.clipboard.writeText(reward.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-dvh bg-[#F9F4FC] selection:bg-[#D4EB00] selection:text-[#3B0A54]">
      <HUDNav />

      {/* --- ENCABEZADO MORADO PREMIUM --- */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#4A0D67] via-[#5E1382] to-[#3B0A54] pt-28 pb-16 sm:pt-32 sm:pb-20 px-6 sm:px-10 text-white">
        <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-[#D4EB00]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-[#FF5E7E]/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs font-extrabold text-[#D4EB00] border border-white/20 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Reto Recórcholis
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Juega y gana hasta{' '}
            <span className="text-[#D4EB00]">10% de descuento</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-white/85">
            Desliza tu Recorcard, atrapa las fichas doradas y tickets antes de que acabe el tiempo y esquiva las bombas.
          </p>
        </div>

        {/* Curva inferior */}
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

      {/* --- CONTENEDOR DEL MINIJUEGO INTERACTIVO --- */}
      <main className="mx-auto max-w-4xl px-4 sm:px-8 py-10 sm:py-14">
        {/* Barra Superior de Puntuación y Metas */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-[#4A0D67]/12 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-[#F6EFFA] px-3.5 py-2">
              <Star className="h-4 w-4 text-[#FF5E7E] fill-[#FF5E7E]" />
              <span className="text-xs font-bold text-[#5C3A70]">Puntos:</span>
              <span className="text-lg font-black text-[#3B0A54]">{score}</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#F6EFFA] px-3.5 py-2">
              <Timer className="h-4 w-4 text-[#4A0D67]" />
              <span className="text-xs font-bold text-[#5C3A70]">Tiempo:</span>
              <span
                className={`text-lg font-black ${
                  timeLeft <= 5 && gameState === 'playing' ? 'text-[#FF5E7E] animate-pulse' : 'text-[#3B0A54]'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Indicadores de meta */}
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <span
              className={`rounded-full px-3 py-1 transition-colors ${
                score >= 60 ? 'bg-[#D4EB00] text-[#3B0A54]' : 'bg-[#F6EFFA] text-[#5C3A70]'
              }`}
            >
              60 pts = 5% OFF
            </span>
            <span
              className={`rounded-full px-3 py-1 transition-colors ${
                score >= 120 ? 'bg-[#D4EB00] text-[#3B0A54]' : 'bg-[#F6EFFA] text-[#5C3A70]'
              }`}
            >
              120 pts = 10% OFF
            </span>
          </div>
        </div>

        {/* ARENA DE JUEGO */}
        <motion.div
          ref={arenaRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerMove}
          animate={shake ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
          transition={{ duration: 0.25 }}
          className="relative h-[440px] sm:h-[480px] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-[#3B0A54] via-[#4A0D67] to-[#2B0548] border-4 border-[#4A0D67]/20 shadow-xl select-none touch-none cursor-ew-resize"
        >
          {/* Cuadrícula arcade sutil de fondo */}
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />

          {/* Pantalla Inicial (Antes de jugar) */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#2B0548]/80 backdrop-blur-sm p-6 text-center text-white">
              <div className="mb-4 flex items-center gap-4 text-3xl sm:text-4xl">
                <span className="flex flex-col items-center gap-1">
                  🪙
                  <span className="text-[11px] font-extrabold text-[#D4EB00]">+10 pts</span>
                </span>
                <span className="flex flex-col items-center gap-1">
                  🎟️
                  <span className="text-[11px] font-extrabold text-[#D4EB00]">+25 pts</span>
                </span>
                <span className="flex flex-col items-center gap-1">
                  💣
                  <span className="text-[11px] font-extrabold text-[#FF5E7E]">-15 pts</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Lluvia de Fichas Recórcholis
              </h2>
              <p className="mt-2 max-w-md text-xs sm:text-sm text-white/80">
                Mueve el mouse o desliza tu dedo de izquierda a derecha para atrapar fichas con tu Recorcard.
              </p>

              <button
                onClick={startGame}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D4EB00] px-8 py-4 text-sm sm:text-base font-extrabold text-[#3B0A54] shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="h-5 w-5 fill-[#3B0A54]" />
                ¡Jugar ahora!
              </button>
            </div>
          )}

          {/* Objetos que caen */}
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="pointer-events-none absolute text-3xl sm:text-4xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
            >
              {item.type === 'coin' && '🪙'}
              {item.type === 'ticket' && '🎟️'}
              {item.type === 'bomb' && '💣'}
            </div>
          ))}

          {/* Textos flotantes de puntaje (+10, +25, -15) */}
          {feedbacks.map((fb) => (
            <motion.div
              key={fb.id}
              initial={{ opacity: 1, y: 0, scale: 0.9 }}
              animate={{ opacity: 0, y: -36, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              style={{ left: `${fb.x}%`, bottom: '18%' }}
              className={`pointer-events-none absolute -translate-x-1/2 font-black text-lg drop-shadow-md ${
                fb.positive ? 'text-[#D4EB00]' : 'text-[#FF5E7E]'
              }`}
            >
              {fb.text}
            </motion.div>
          ))}

          {/* RECEPTOR DEL JUGADOR (TARJETA RECORCARD) */}
          <div
            style={{
              left: `${catcherX}%`,
              transform: 'translateX(-50%)',
            }}
            className="pointer-events-none absolute bottom-5 z-20 flex h-12 w-28 sm:w-32 flex-col items-center justify-center rounded-xl bg-gradient-to-r from-[#D4EB00] via-[#e4f926] to-[#D4EB00] border-2 border-white shadow-[0_0_25px_rgba(212,235,0,0.65)]"
          >
            <span className="text-xs font-black tracking-tight text-[#3B0A54]">
              Recorcard
            </span>
            <span className="text-[9px] font-bold uppercase text-[#3B0A54]/75">
              Atrapa aquí
            </span>
          </div>
        </motion.div>
      </main>

      {/* --- MODAL DE RESULTADOS Y CUPÓN GANADO --- */}
      <AnimatePresence>
        {gameState === 'ended' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B0548]/75 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-7 sm:p-8 text-center shadow-2xl border border-[#4A0D67]/15"
            >
              <button
                onClick={() => setGameState('idle')}
                className="absolute right-4 top-4 rounded-full p-1.5 text-[#5C3A70] hover:bg-[#F6EFFA] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6EFFA] text-[#4A0D67]">
                <Trophy className="h-8 w-8 text-[#FF5E7E]" />
              </div>

              <p className="text-xs font-extrabold uppercase tracking-wider text-[#FF5E7E]">
                Puntaje final: {score} pts
              </p>

              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#3B0A54]">
                {reward.title}
              </h2>

              {reward.won ? (
                <>
                  <div className="my-5 rounded-2xl bg-gradient-to-r from-[#4A0D67] to-[#6A1B9A] p-5 text-white shadow-md">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                      Desbloqueaste
                    </p>
                    <p className="text-4xl font-black text-[#D4EB00] my-1">
                      {reward.discount}
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <span className="rounded-lg bg-white/15 px-3 py-1 font-mono text-sm font-bold tracking-widest">
                        {reward.code}
                      </span>
                      <button
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#D4EB00] px-3 py-1 text-xs font-extrabold text-[#3B0A54] cursor-pointer"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C3A70] mb-6">
                    {reward.desc}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={startGame}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-[#4A0D67]/20 bg-[#F6EFFA] py-3.5 text-xs font-extrabold text-[#3B0A54] hover:bg-[#EFE2F7] cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Jugar otra vez
                    </button>
                    <Link
                      href={`/recargas?cupon=${reward.code}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#D4EB00] py-3.5 text-xs font-extrabold text-[#3B0A54] shadow-md hover:scale-105 transition-transform"
                    >
                      Usar en Recorcard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-3 mb-6 text-sm text-[#5C3A70]">
                    {reward.desc}
                  </p>
                  <button
                    onClick={startGame}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#D4EB00] py-4 text-sm font-extrabold text-[#3B0A54] shadow-md transition-transform hover:scale-105 cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Intentar de nuevo
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}