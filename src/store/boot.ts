import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BootState {
  /** Fase actual de la secuencia de arranque */
  phase: 'TERMINAL' | 'PRESS_START' | 'ENTERING' | 'READY';
  /** El usuario ya completó el boot en una visita previa (persistido) */
  seenBoot: boolean;
  setPhase: (phase: BootState['phase']) => void;
  skipBoot: () => void;
}

export const useBootStore = create<BootState>()(
  persist(
    (set) => ({
      phase: 'TERMINAL',
      seenBoot: false,
      setPhase: (phase) => set({ phase }),
      skipBoot: () => set({ phase: 'READY', seenBoot: true }),
    }),
    { name: 'recorcholis-boot' },
  ),
);
