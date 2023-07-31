import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import solidJs from "@astrojs/solid-js";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio-zq6o.onrender.com',
  integrations: [svelte(), vue(), tailwind({
    // Example: Disable injecting a basic `base.css` import on every page.
    // Useful if you need to define and/or import your own custom `base.css`.
    config: {
      applyBaseStyles: false
    }
  }), solidJs(), sitemap()]
});
