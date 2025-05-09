import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio-zq6o.onrender.com',
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), sitemap(), prefetch(), react()]
});
