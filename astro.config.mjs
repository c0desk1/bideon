// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://bimaakbar.my.id',
  integrations: [sitemap()],
  vite: {
      plugins: [tailwindcss()],
    },
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare',
    mode: 'directory',
    bindings: {
      BIMA__KV_TOKEN: {
        type: 'kv',
        namespace_id: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
      },
    },
 }),
});
