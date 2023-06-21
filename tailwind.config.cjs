/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  fontFamily: {
    sans: ['Graphik', 'sans-serif'],
    serif: ['Merriweather', 'serif'],
  },
	theme: {
		extend: {},
	},
	plugins: [{'postcss-import': {}}]
}
