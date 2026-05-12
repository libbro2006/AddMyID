/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
        },
        surface: 'var(--surface)',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
