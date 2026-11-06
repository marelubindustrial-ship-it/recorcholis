import type { Metadata } from 'next';
import RecargaExperience from '@/components/recargas/RecargaExperience';

export const metadata: Metadata = {
  title: 'Recargas Recorcard',
  description:
    'Consulta el saldo de tu Recorcard y recarga en segundos con tarjeta, PayPal u OXXO. Sin filas, sin efectivo, sin pausa en la diversión.',
};

export default function RecargasPage() {
  return <RecargaExperience />;
}
