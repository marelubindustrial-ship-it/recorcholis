import type { Metadata } from 'next';
import PartyForm from '@/components/fiestas/PartyForm';

export const metadata: Metadata = {
  title: 'Fiestas y Eventos',
  description:
    'Cotiza fiestas infantiles, eventos escolares y corporativos en Recórcholis. Paquetes con comida, arcade privado y anfitriones.',
};

export default function FiestasPage() {
  return <PartyForm />;
}
