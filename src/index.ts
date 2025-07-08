export interface Env {
    BIMA_KV_SPACE: KVNamespace;
  }
  
  function getToday() {
    return new Date().toISOString().split("T")[0];
  }
  
  function getHour() {
    return new Date().getHours().toString().padStart(2, '0');
  }
  
  export default {
    async fetch(request: Request, env: Env): Promise<Response> {
      const url = new URL(request.url);
  
      if (url.pathname === "/api/visit") {
        const today = getToday();
        const hour = getHour();
        const country = request.headers.get("cf-ipcountry") || "XX";
  
        // Hitung total hari ini
        const visitKey = `visits:${today}`;
        const current = parseInt(await env.BIMA_KV_SPACE.get(visitKey) ?? "0");
        await env.BIMA_KV_SPACE.put(visitKey, (current + 1).toString());
  
        // Simpan berdasarkan negara
        const countryKey = `countries:${today}:${country}`;
        const countryCount = parseInt(await env.BIMA_KV_SPACE.get(countryKey) ?? "0");
        await env.BIMA_KV_SPACE.put(countryKey, (countryCount + 1).toString());
  
        // Simpan berdasarkan jam
        const hourKey = `hours:${today}:${hour}`;
        const hourCount = parseInt(await env.BIMA_KV_SPACE.get(hourKey) ?? "0");
        await env.BIMA_KV_SPACE.put(hourKey, (hourCount + 1).toString());
  
        return Response.json({
          date: today,
          hour,
          country,
          message: "Visit recorded"
        });
      }
  
      return new Response("Not Found", { status: 404 });
    }
  }
  
