import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#07070C',
        carbon: '#0D0D16',
        panel: '#12121E',
        brand: {
          DEFAULT: '#E4002B',
          bright: '#FF2D55',
          deep: '#8F001B',
        },
        neon: {
          cyan: '#22E5FF',
          yellow: '#FFD400',
          pink: '#FF4D9D',
        },
        ink: {
          DEFAULT: '#F5F5F7',
          dim: '#A7A7B8',
        },
      },
      fontFamily: {
        arcade: ['var(--font-arcade)', 'monospace'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      boxShadow: {
        'neon-red': '0 0 24px rgba(228, 0, 43, 0.45)',
        'neon-cyan': '0 0 24px rgba(34, 229, 255, 0.35)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.45)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        blink: 'blink 1.1s steps(1) infinite',
        floaty: 'floaty 4s ease-in-out infinite',
        scanline: 'scanline 7s linear infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
