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
          invert: '#eeeeee',
        },
        paper: {
          DEFAULT: '#f5f1e8',
          dark: '#1a1a1a',
        },
        line: {
          DEFAULT: '#e4dfd4',
          dark: '#333333',
        },
        tender: {
          blue: '#73cef4',
          green: '#c9d05c',
          yellow: '#ffc24b',
          red: '#f43753',
          bg: '#282828',
        },
      },
    },
  },
  plugins: [],
};
