// src/pages/sitemap-index.xml.ts
import { APIContext } from 'astro';

export async function GET({ site }: APIContext) {
  const sitemapUrls = [
    new URL('/sitemap-posts.xml', site).href,
new URL ('/sitempa-pages.xml', site).href,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (url) => `
  <sitemap>
    <loc>${url}</loc>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}