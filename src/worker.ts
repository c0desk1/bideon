export interface Env {
    BIMA_KV_SPACE: KVNamespace;
  }
  
  export default {
    async fetch(request: Request, env: Env): Promise<Response> {
      const url = new URL(request.url);
      const path = url.pathname;
  
      if (path === "/api/stats/today") {
        const today = new Date().toISOString().split("T")[0];
        const count = await env.BIMA_KV_SPACE.get(`visits:${today}`);
        return new Response(JSON.stringify({ visits: parseInt(count ?? "0") }), {
          headers: { "Content-Type": "application/json" },
        });
      }
  
      return new Response("Not Found", { status: 404 });
    },
  };
  