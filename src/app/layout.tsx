import type { Metadata, Viewport } from 'next';
import { Press_Start_2P, Space_Grotesk } from 'next/font/google';
import './globals.css';

const arcade = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-arcade',
  display: 'swap',
});

const body = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://recorcholis.example'),
  title: {
    default: 'Recórcholis · Experiencia Web Arcade',
    template: '%s · Recórcholis',
  },
  description:
    'Recórcholis reinventado: diversión arcade en línea. Recargas Recorcard, fiestas y eventos, promociones y más de 50 sucursales en México.',
  keywords: ['Recórcholis', 'arcade', 'boleras', 'fiestas infantiles', 'Recorcard', 'entretenimiento familiar'],
  openGraph: {
    title: 'Recórcholis · Experiencia Web Arcade',
    description: 'Inserta tu tarjeta. Sube de nivel. Vive la nueva era Recórcholis.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#07070C',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${arcade.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
