import type { Env } from '../types';
import { getValidToken } from '../handlers/getValidToken';

export async function handleGetLabels(env: Env): Promise<Response> {
  const cacheKey = "labels";
  const cached = await env.BIMA_KV_SPACE.get(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: { "Content-Type": "application/json", "X-Cache": "HIT" }
    });
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
    return new Response(`Failed to fetch posts for labels: ${err}`, { status: res.status });
  }

  const data = await res.json() as { items?: { labels?: string[] }[] };
  const posts = data.items ?? [];
  const labelSet = new Set<string>();

  for (const post of posts) {
    (post.labels ?? []).forEach(label => labelSet.add(label));
  }

  const labels = Array.from(labelSet);
  const result = JSON.stringify({ labels }, null, 2);

  await env.BIMA_KV_SPACE.put(cacheKey, result, { expirationTtl: 600 });

  return new Response(result, {
    headers: { "Content-Type": "application/json", "X-Cache": "MISS" },
  });
}
