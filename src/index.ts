export interface Env {
    BIMA_KV_SPACE: KVNamespace;
  }
  
  export default {
    async fetch(req: Request, env: Env): Promise<Response> {
      const url = new URL(req.url);

      if (url.pathname === "/api/visitor") {
        const today = new Date().toISOString().split("T")[0];
        const key = `visits:${today}`;
        const count = await env.BIMA_KV_SPACE.get(key);
        return new Response(JSON.stringify({
          date: today,
          count: parseInt(count ?? "0"),
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response("OK");
    }
  }
  
