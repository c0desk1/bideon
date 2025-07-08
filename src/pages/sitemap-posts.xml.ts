// src/pages/sitemap-posts.xml.ts
import type { APIRoute } from 'astro';

const BLOG_ID = import.meta.env.VITE_BLOGGER_BLOG_ID;
const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;

export const GET: APIRoute = async () => {
  if (!BLOG_ID || !API_KEY) {
    return new Response('Missing API credentials', { status: 500 });
  }

  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}`);
  const data = await res.json();

  const baseUrl = 'https://bimaakbar.my.id';

  const urls = data.items?.map((post: any) => {
    return `
  <url>
    <loc>${baseUrl}/post/${post.id}</loc>
    <lastmod>${new Date(post.updated).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};