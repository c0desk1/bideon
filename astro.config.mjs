// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
adapter: vercel(),
  integrations: [
    react({
      ssr: true,
    }),
    sitemap(),
  ],
  output: 'server',

  image: {
    service: {
      // @ts-ignore
      entry: 'astro/assets/services/compile',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});