// src/pages/api/system-status.json.ts

export async function GET({ request }: { request: Request }) {
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
      let serviceCurrentStatus = service.status;
      let serviceMessage = 'Operasional';
      let serviceLatency = `${(Math.random() * (service.maxLatency - service.minLatency) + service.minLatency).toFixed(0)}ms`;
      let serviceErrorRate: string | undefined = undefined;
  
      // Simulasi masalah acak
      if (Math.random() < service.errorChance) {
        const problemType = Math.random();
        if (problemType < 0.6) { // Masalah kecil (latency tinggi, warning)
          serviceCurrentStatus = 'perhatian';
          serviceMessage = 'Peningkatan latensi';
          serviceLatency = `${(Math.random() * 100 + service.maxLatency).toFixed(0)}ms`; // Latency lebih tinggi
          overallStatus = overallStatus === 'aman' ? 'perhatian' : overallStatus; // Upgrade status
          overallMessage = 'Beberapa layanan menunjukkan peringatan.';
          overallDetails += `${service.name}: Latensi tinggi; `;
        } else { // Masalah besar (error, outage)
          serviceCurrentStatus = 'bermasalah';
          serviceMessage = 'Tidak responsif / Error';
          serviceErrorRate = `${(Math.random() * 5 + 1).toFixed(1)}%`; // Error rate
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
    const globalMetrics = {
      cpu_usage: `${(Math.random() * 20 + 10).toFixed(1)}%`, // 10-30% normal
      memory_usage: `${(Math.random() * 30 + 30).toFixed(1)}%`, // 30-60% normal
      disk_usage: `${(Math.random() * 20 + 10).toFixed(1)}%`, // 10-30% normal
      network_throughput: `${(Math.random() * 500 + 100).toFixed(0)} Mbps`, // 100-600 Mbps
    };
  

    if (overallStatus === 'bermasalah') {
      globalMetrics.cpu_usage = `${(Math.random() * 30 + 70).toFixed(1)}%`;
      globalMetrics.memory_usage = `${(Math.random() * 20 + 70).toFixed(1)}%`;
      globalMetrics.network_throughput = `${(Math.random() * 200 + 800).toFixed(0)} Mbps`;
    } else if (overallStatus === 'perhatian') {
       globalMetrics.cpu_usage = `${(Math.random() * 20 + 50).toFixed(1)}%`;
       globalMetrics.memory_usage = `${(Math.random() * 20 + 50).toFixed(1)}%`;
    }
  
    const statusData = {
      status: overallStatus,
      message: overallMessage,
      timestamp: new Date().toISOString(),
      details: overallDetails.trim() || 'Semua layanan beroperasi pada performa optimal.',
      services: serviceStatuses,
      metrics: globalMetrics,
    };
  
    return new Response(JSON.stringify(statusData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
