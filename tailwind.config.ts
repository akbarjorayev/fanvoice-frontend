import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      keyframes: {
        'menu-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-6px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'menu-out': {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.95) translateY(-6px)' },
        },
      },
      animation: {
        'menu-in': 'menu-in 0.15s ease-out',
        'menu-out': 'menu-out 0.1s ease-in forwards',
      },
    },
  },
  plugins: [],
}

export default config
