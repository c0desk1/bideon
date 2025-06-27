// @ts-check
import { defineConfig } from 'astro/config';

// Import resmi dari Astro
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import solid from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
vite: {
    plugins: [tailwindcss()],
  },
  site: 'bimaakbar.my.id',
  integrations: [solid()],

  
});