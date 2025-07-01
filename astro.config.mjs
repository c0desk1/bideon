// @ts-nocheck
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

// Ditambahkan untuk alias path
import path from 'path';
import { fileURLToPath } from 'url';

// Ditambahkan untuk alias path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    // Ditambahkan untuk alias path
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
