import type { Env } from '../types';
import { getValidToken } from '../handlers/getValidToken';

export async function handleGetPages(env: Env): Promise<Response> {
  const cacheKey = "pages";
  const cached = await env.BIMA_KV_SPACE.get(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: { "Content-Type": "application/json", "X-Cache": "HIT" }
    });
  }

  const access_token = await getValidToken(env);

  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${env.BLOGGER_BLOG_ID}/pages?maxResults=50`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(`Failed to fetch pages: ${err}`, { status: res.status });
  }

  const data = await res.text();
  await env.BIMA_KV_SPACE.put(cacheKey, data, { expirationTtl: 600 });

  return new Response(data, {
    headers: { "Content-Type": "application/json", "X-Cache": "MISS" }
  });
}
