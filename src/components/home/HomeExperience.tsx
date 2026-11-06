'use client';

import { useBootStore } from '@/store/boot';
import BootSequence from '@/components/boot/BootSequence';
import HUDNav from '@/components/layout/HUDNav';
import Footer from '@/components/layout/Footer';
import Hero from './Hero';
import Marquee from './Marquee';
import FeatureGrid from './FeatureGrid';
import RecorcardTeaser from './RecorcardTeaser';

/**
 * Orquestador del Home: si el boot no se ha completado,
 * la web permanece fija en la secuencia de arranque (sin scroll).
 */
export default function HomeExperience() {
  const phase = useBootStore((s) => s.phase);
  const booting = phase !== 'READY';

  return (
    <div className={booting ? 'h-dvh overflow-hidden' : 'min-h-dvh'}>
      {booting && <BootSequence />}
      {!booting && (
        <>
          <HUDNav />
          <main>
            <Hero started={true} />
            <Marquee />
            <FeatureGrid />
            <RecorcardTeaser />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
