import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import solidJs from "@astrojs/solid-js";
import sitemap from "@astrojs/sitemap";

import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio-zq6o.onrender.com',
  integrations: [svelte(), vue(), tailwind({
    config: {
      applyBaseStyles: false
    }
  }), solidJs(), sitemap(), prefetch()]
});