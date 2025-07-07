// @ts-nocheck
import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://bimaakbar.my.id',
	output: 'server',
	adapter: cloudflare({
		imageService: 'cloudflare',
    	platformProxy: {
			enabled: true,
			configPath: 'wrangler.jsonc',
			persist: {
				path: './.cache/wrangler/v3'
			},
    },
    sessionKVBindingName: 'BIMA_KV_SPACE',
    bindings: {
		BIMA_KV_SPACE: {
			type: 'kv',
			namespace_id: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
		},
    },
	integrations: [sitemap()],
	vite: {
		plugins: [tailwindcss()],
    },
 }),
});