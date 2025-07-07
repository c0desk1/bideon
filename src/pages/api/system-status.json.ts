// src/api/status
export const onRequestGet: PagesFunction = async () => {
  // Simulasi status real; bisa diganti dengan health check nyata
  const status = {
    ok: true,
    services: [
      { name: 'Database', ok: true, latency: 123 },
      { name: 'Auth', ok: true, latency: 95 },
      { name: 'Storage', ok: true, latency: 110 },
    ],
    lastUpdated: new Date().toISOString(),
  };

  return new Response(JSON.stringify(status), {
    headers: { 'Content-Type': 'application/json' },
  });
};