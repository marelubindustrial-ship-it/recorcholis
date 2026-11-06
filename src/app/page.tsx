import type { Metadata } from 'next';
import HomeExperience from '@/components/home/HomeExperience';

export const metadata: Metadata = {
  title: 'Inicio · Experiencia Web Arcade',
  description:
    'Inserta tu tarjeta y sube de nivel: boleras, arcades, trampolines, Recorcard digital y fiestas inolvidables.',
};

export default function HomePage() {
  return <HomeExperience />;
}
