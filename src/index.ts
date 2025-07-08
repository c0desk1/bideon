export interface Env {
  BIMA_KV_SPACE: KVNamespace;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === "/api/visit") {
      const today = new Date().toISOString().split("T")[0];
      const key = `visits:${today}`;
      const current = await env.BIMA_KV_SPACE.get(key);
      const newCount = (parseInt(current ?? "0") || 0) + 1;
      await env.BIMA_KV_SPACE.put(key, newCount.toString());

      return new Response(JSON.stringify({
        date: today,
        count: newCount
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Worker aktif, tapi route tidak cocok", {
      status: 404
    });
  }
}
