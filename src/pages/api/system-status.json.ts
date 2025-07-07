// src/pages/api/system-status.json.ts
// Ini adalah file API Endpoint yang akan dijalankan di Cloudflare Worker.

interface MetricHistoryEntry {
  time: string;
  cpu_usage: string;
  memory_usage: string;
  network_latency: string;
}

// NOTE: Dalam produksi, Anda akan menyimpan histori ini di database,
// Cloudflare KV, atau Durable Objects. Ini hanya simulasi in-memory.
const metricHistory: MetricHistoryEntry[] = [];
const MAX_HISTORY_POINTS = 30; // Jumlah titik data di grafik (sekitar 15 menit jika polling 30 detik)

const getRandomValue = (min: number, max: number) => {
  return (Math.random() * (max - min) + min);
};

export async function GET({ request }: { request: Request }) {
  let response: Response | undefined;
  
  // Deteksi lingkungan Cloudflare Worker dengan lebih aman untuk TypeScript.
  const isCloudflareWorkerEnv = typeof caches !== 'undefined' && typeof (caches as any).default !== 'undefined';

  // Inisialisasi defaultCache hanya jika di lingkungan Worker
  const defaultCache: Cache | null = isCloudflareWorkerEnv ? (caches as any).default : null;

  // Coba ambil dari cache hanya jika defaultCache terdefinisi
  if (defaultCache) {
    const cacheKey = new Request(request.url, {
      headers: request.headers,
      method: 'GET',
    });
    response = await defaultCache.match(cacheKey);
  }
 
  // Jika tidak ada respons dari cache, atau jika tidak di lingkungan Worker (defaultCache adalah null)
  if (!response) {
    // --- Simulasi Data Real-time ---
    // Di dunia nyata, ini akan diganti dengan panggilan ke monitoring API Anda (UptimeRobot, Prometheus, Datadog, dll.)
    // Atau membaca dari Cloudflare KV/Durable Objects jika Anda menyimpan status di sana.

    // Definisikan layanan yang akan dipantau
    const services = [
      { name: 'API Gateway', status: 'operational', minLatency: 20, maxLatency: 80, errorChance: 0.02 }, // 2% chance of error
      { name: 'Database Service', status: 'operational', minLatency: 30, maxLatency: 100, errorChance: 0.01 }, // 1% chance of error
      { name: 'Cache Layer', status: 'operational', minLatency: 5, maxLatency: 30, errorChance: 0.005 }, // 0.5% chance of error
      { name: 'Payment Processing', status: 'operational', minLatency: 50, maxLatency: 150, errorChance: 0.03 }, // 3% chance of error
    ];

    let overallStatus: 'aman' | 'perhatian' | 'bermasalah' = 'aman';
    let overallMessage = 'Semua sistem beroperasi normal.';
    let overallDetails = '';
    const serviceStatuses: { name: string; status: string; latency?: string; errorRate?: string; message?: string }[] = [];

    // Simulasi status dan metrik untuk setiap layanan
    for (const service of services) {
      let serviceCurrentStatus: 'operational' | 'perhatian' | 'bermasalah' = 'operational';
      let serviceMessage = 'Operasional';
      let serviceLatency = `${getRandomValue(service.minLatency, service.maxLatency).toFixed(0)}ms`;
      let serviceErrorRate: string | undefined = undefined;

      // Simulasi masalah acak
      if (Math.random() < service.errorChance) {
        const problemType = Math.random();
        if (problemType < 0.6) { // Masalah kecil (latency tinggi, warning)
          serviceCurrentStatus = 'perhatian';
          serviceMessage = 'Peningkatan latensi';
          serviceLatency = `${getRandomValue(service.maxLatency, service.maxLatency + 100).toFixed(0)}ms`; // Latency lebih tinggi
          overallStatus = overallStatus === 'aman' ? 'perhatian' : overallStatus; // Upgrade status
          overallMessage = 'Beberapa layanan menunjukkan peringatan.';
          overallDetails += `${service.name}: Latensi tinggi; `;
        } else { // Masalah besar (error, outage)
          serviceCurrentStatus = 'bermasalah';
          serviceMessage = 'Tidak responsif / Error';
          serviceErrorRate = `${getRandomValue(1, 5).toFixed(1)}%`; // Error rate
          serviceLatency = 'N/A';
          overallStatus = 'bermasalah'; // Upgrade status ke bermasalah
          overallMessage = 'Insiden terdeteksi pada salah satu layanan penting.';
          overallDetails += `${service.name}: Tidak responsif; `;
        }
      }

      serviceStatuses.push({
        name: service.name,
        status: serviceCurrentStatus,
        latency: serviceLatency,
        errorRate: serviceErrorRate,
        message: serviceMessage,
      });
    }

    // Metrik server global (simulasi)
    let currentCpu = getRandomValue(10, 30);
    let currentMemory = getRandomValue(30, 60);
    let currentNetworkLatency = getRandomValue(20, 40);

    if (overallStatus === 'bermasalah') {
      currentCpu = getRandomValue(70, 95); // CPU tinggi
      currentMemory = getRandomValue(70, 90); // Memori tinggi
      currentNetworkLatency = getRandomValue(100, 300); // Latensi tinggi
    } else if (overallStatus === 'perhatian') {
       currentCpu = getRandomValue(50, 70);
       currentMemory = getRandomValue(50, 70);
       currentNetworkLatency = getRandomValue(50, 100);
    }

    const globalMetrics: { [key: string]: string | number } = {
      cpu_usage: `${currentCpu.toFixed(1)}%`,
      memory_usage: `${currentMemory.toFixed(1)}%`,
      disk_usage: `${getRandomValue(10, 30).toFixed(1)}%`,
      network_throughput: `${getRandomValue(100, 600).toFixed(0)} Mbps`,
    };

    // Tambahkan data metrik saat ini ke histori
    metricHistory.push({
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cpu_usage: currentCpu.toFixed(1), // Simpan sebagai string tanpa %
      memory_usage: currentMemory.toFixed(1), // Simpan sebagai string tanpa %
      network_latency: currentNetworkLatency.toFixed(0), // Simpan sebagai string tanpa ms
    });

    // Batasi histori agar tidak terlalu besar
    while (metricHistory.length > MAX_HISTORY_POINTS) {
      metricHistory.shift(); // Hapus data terlama
    }

    const statusData = {
      status: overallStatus,
      message: overallMessage,
      timestamp: new Date().toISOString(),
      details: overallDetails.trim() || 'Semua layanan beroperasi pada performa optimal.',
      services: serviceStatuses,
      metrics: globalMetrics,
      history: metricHistory, // Ini yang akan digunakan oleh Chart.js
    };

    // Buat respons baru
    response = new Response(JSON.stringify(statusData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=10, s-maxage=10', 
      },
    });

    // Simpan respons ke cache, hanya jika defaultCache terdefinisi
    if (defaultCache) {
      const cacheKeyForPut = new Request(request.url, { method: 'GET' });
      await defaultCache.put(cacheKeyForPut, response.clone());
    }
  }

  // Jika response masih undefined (misalnya, di local dev dan tidak ada cache),
  // berikan response default/error agar tidak crash.
  if (!response) {
    return new Response(JSON.stringify({
      status: 'error',
      message: 'API tidak tersedia di lingkungan development lokal.',
      timestamp: new Date().toISOString(),
      details: 'Fungsi caching tidak aktif di development lokal karena API "caches" tidak tersedia.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return response;
}
