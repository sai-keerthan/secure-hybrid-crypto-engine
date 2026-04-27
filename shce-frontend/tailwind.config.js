/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: '#171e19',
        darkgray: '#272727',
        sage: '#b7c6c2',
        golden: '#ffe17c',
        cream: '#f8f9fa',
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        body: ['"Satoshi"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      lineHeight: {
        'display': '0.9',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-up-d1': 'fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) 0.15s forwards',
        'fade-up-d2': 'fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) 0.3s forwards',
        'fade-up-d3': 'fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) 0.45s forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
