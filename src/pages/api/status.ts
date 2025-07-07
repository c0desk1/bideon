// src/api/status.ts
export const onRequestGet: PagesFunction = async () => {
  // Replace ini dengan data nyata: API internal / Uptime Kuma / ping
  const isOk = true; // ganti sesuai hasil ping / API kamu

  const status = {
    ok: isOk,
    lastUpdated: new Date().toISOString(),
    services: [
      { name: "Website", ok: isOk, latency: 123 },
      { name: "API", ok: true, latency: 98 },
    ],
  };

  return new Response(JSON.stringify(status), {
    headers: { "Content-Type": "application/json" },
  });
};