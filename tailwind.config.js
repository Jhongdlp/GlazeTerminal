/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          surface: 'rgba(10, 10, 15, 0.85)', // Onyx / Deep Night
          border: 'rgba(255, 255, 255, 0.1)',
          highlight: 'rgba(255, 255, 255, 0.15)',
        }
      },
      boxShadow: {
        'glass': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'glass-glow': 'inset 0 0 20px 2px rgba(255, 255, 255, 0.05), inset 0 0 4px 0 rgba(255, 255, 255, 0.2)', // The "Inner Glow" trick
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'mesh-drift': {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -20px)' },
          '100%': { transform: 'translate(0, 0)' },
        }
      },
      animation: {
        'mesh-drift': 'mesh-drift 10s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
