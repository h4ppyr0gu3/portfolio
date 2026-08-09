/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#1c1917',
          muted: '#57534e',
          faint: '#78716c',
        },
        paper: {
          DEFAULT: '#fafaf9',
          dark: '#1c1917',
        },
      },
    },
  },
  plugins: [{ 'postcss-import': {} }],
};
