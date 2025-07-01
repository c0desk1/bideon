// @ts-nocheck
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://bimaakbar.my.id',
  integrations: [react(), sitemap()],
  output: 'server',
  adapter: netlify(),

  image: {
    service: {
      // @ts-ignore
      entry: 'astro/assets/services/compile'
    }
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname
      },
    },
  },
});
