import type { Env } from '../types';
import { getValidToken } from '../handlers/getValidToken';

export async function handleGetPosts(env: Env): Promise<Response> {
  const cacheKey = "posts_cache";
  const cached = await env.BIMA_KV_SPACE.get(cacheKey);

  if (cached) {
    const parsed = JSON.parse(cached) as { data: any; expire_at: number };
    if (Date.now() < parsed.expire_at) {
      return new Response(JSON.stringify(parsed.data), {
        headers: { 'Content-Type': 'application/json', "X-Cache": "HIT" },
      });
    }
  }

  const access_token = await getValidToken(env);
  const blogId = env.BLOGGER_BLOG_ID;
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?maxResults=100`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(`Failed to fetch posts: ${err}`, { status: res.status });
  }

  const data = await res.json();
  await env.BIMA_KV_SPACE.put(cacheKey, JSON.stringify({
    data,
    expire_at: Date.now() + 10 * 60 * 1000,
  }));

  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json', "X-Cache": "MISS" },
  });
}
