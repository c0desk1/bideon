export interface Env {
  BIMA_KV_SPACE: KVNamespace;
  VITE_BLOGGER_API_KEY: string;
  VITE_BLOGGER_BLOG_ID: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/posts") {
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
