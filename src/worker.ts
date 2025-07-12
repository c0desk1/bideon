export interface Env {
  BIMA_KV_SPACE: KVNamespace;
  VITE_BLOGGER_API_KEY: string;
  VITE_BLOGGER_BLOG_ID: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/post") {
      const maxResults = url.searchParams.get("maxResults") || "9";
      const cacheKey = `posts:maxResults=${maxResults}`;
      const cached = await env.BIMA_KV_SPACE.get(cacheKey);

      if (cached) {
        return new Response(cached, {
          headers: { "Content-Type": "application/json", "X-Cache": "HIT" },
        });
      }

      const apiUrl = `https://www.googleapis.com/blogger/v3/blogs/${env.VITE_BLOGGER_BLOG_ID}/posts?key=${env.VITE_BLOGGER_API_KEY}&maxResults=${maxResults}`;

      const res = await fetch(apiUrl);
      if (!res.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch" }), { status: 500 });
      }

      const data = await res.text();
      await env.BIMA_KV_SPACE.put(cacheKey, data, { expirationTtl: 60 * 10 });

      return new Response(data, {
        headers: { "Content-Type": "application/json", "X-Cache": "MISS" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const postIdMatch = url.pathname.match(/^\/post\/([^/]+)$/);

    if (postIdMatch && request.method === 'GET') {
      const postId = postIdMatch[1];
      const cacheKey = `post_${postId}`;
      const refresh = url.searchParams.get("refresh") === "true";

      let cachedPost = !refresh ? await env.BIMA_KV_SPACE.get(cacheKey, "json") : null;

      if (!cachedPost) {
        const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${env.VITE_BLOGGER_BLOG_ID}/posts/${postId}?key=${env.VITE_BLOGGER_API_KEY}`);

        if (!res.ok) {
          return new Response("Post not found", { status: 404 });
        }

        cachedPost = await res.json();
        await env.BIMA_KV_SPACE.put(cacheKey, JSON.stringify(cachedPost), { expirationTtl: 600 });
      }

      return new Response(JSON.stringify({ post: cachedPost }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
