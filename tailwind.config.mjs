/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f0fd',
          100: '#e3e3fb',
          200: '#cccbf8',
          500: '#6b6ee7',
          600: '#5558d4',
          700: '#4346bb',
        },
        surface: '#fafaf8',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
