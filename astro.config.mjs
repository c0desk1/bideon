// @ts-check
import { defineConfig } from 'astro/config';

// Import resmi dari Astro
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
import solid from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [solid()],

  vite: {
    plugins: [tailwindcss()],
  },
  
  // Kita tidak perlu lagi konfigurasi vite manual untuk Tailwind
  // Jadi, bagian 'vite' bisa dihapus jika hanya untuk itu.
});