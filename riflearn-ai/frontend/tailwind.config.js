/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      colors: {
        rif: {
          accent:  'var(--rif-accent)',
          accent2: 'var(--rif-accent2)',
          accent3: 'var(--rif-accent3)',
          bg:      'var(--rif-bg)',
          surface: 'var(--rif-bgSurface)',
          text:    'var(--rif-text)',
          muted:   'var(--rif-textMuted)',
          border:  'var(--rif-border)',
        }
      }
    },
  },
  plugins: [],
}
