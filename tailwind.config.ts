import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        grass: '#4a7c2b',
        'park-green': '#2d5a1f',
        'sky-light': '#87ceeb',
        'sunset-orange': '#ff6b35',
        'sunset-purple': '#8b2e73',
      },
      animation: {
        'sway': 'sway 3s ease-in-out infinite',
        'drift': 'drift 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(2px)' },
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 0px rgba(255, 107, 53, 0))' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.5))' },
        },
      },
    },
  },
  plugins: [],
}
export default config
