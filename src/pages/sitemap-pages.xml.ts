// src/pages/sitemap-pages.xml.ts
import type { APIRoute } from 'astro';

const baseUrl = 'https://bimaakbar.my.id';

const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/blog',
  '/privacy-policy',
'/terms',
'/404'
];

export const GET: APIRoute = async () => {
  const urls = staticRoutes.map((path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};