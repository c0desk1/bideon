export interface Env {
  BIMA_KV_SPACE: KVNamespace;
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/visit") {
      const today = getToday();
      const key = `visits:${today}`;
      const count = parseInt(await env.BIMA_KV_SPACE.get(key) ?? "0") + 1;
      await env.BIMA_KV_SPACE.put(key, count.toString());

      return new Response(JSON.stringify({ date: today, count }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};
