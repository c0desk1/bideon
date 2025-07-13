// @ts-nocheck
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
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.toml',
      persist: {
        path: './.cache/wrangler/v3'
      },
    },
    bindings: {
      BIMA_KV_SPACE: {
        type: 'kv',
        namespace_id: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
      },
    },
    sessionKVBindingName: 'BIMA_KV_SPACE',
 }),
});