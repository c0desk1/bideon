import type { Env } from '../types';
import { getValidToken } from '../handlers/getValidToken';

export async function handleGetPostById(env: Env, postId: string): Promise<Response> {
  if (!postId) {
    return new Response("Missing post ID", { status: 400 });
  }

  const cacheKey = `post_${postId}`;
  const cached = await env.BIMA_KV_SPACE.get(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: { "Content-Type": "application/json", "X-Cache": "HIT" }
    });
  }

  const access_token = await getValidToken(env);
  const blogId = env.BLOGGER_BLOG_ID;
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(`Failed to fetch post: ${err}`, { status: res.status });
  }

  const data = await res.text();
  await env.BIMA_KV_SPACE.put(cacheKey, data, { expirationTtl: 600 });

  return new Response(data, {
    headers: { "Content-Type": "application/json", "X-Cache": "MISS" }
  });
}
