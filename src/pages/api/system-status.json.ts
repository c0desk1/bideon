// src/pages/api/system-status.json.ts

export async function GET({ request }: { request: Request }) {
    let response: Response | undefined;
    
    const isCloudflareWorkerEnv = typeof caches !== 'undefined' && typeof (caches as any).default !== 'undefined';
    const defaultCache: Cache | null = isCloudflareWorkerEnv ? (caches as any).default : null;
  
    if (defaultCache) {
      const cacheKey = new Request(request.url, {
        headers: request.headers,
        method: 'GET',
      });
      response = await defaultCache.match(cacheKey);
    }
   
    if (!response) {
      const services = [
        { name: 'API Gateway', status: 'operational', minLatency: 20, maxLatency: 80, errorChance: 0.02 },
        { name: 'Database Service', status: 'operational', minLatency: 30, maxLatency: 100, errorChance: 0.01 },
        { name: 'Cache Layer', status: 'operational', minLatency: 5, maxLatency: 30, errorChance: 0.005 },
        { name: 'Payment Processing', status: 'operational', minLatency: 50, maxLatency: 150, errorChance: 0.03 },
      ];
  
      let overallStatus: 'aman' | 'perhatian' | 'bermasalah' = 'aman';
      let overallMessage = 'Semua sistem beroperasi normal.';
      let overallDetails = '';
      const serviceStatuses: { name: string; status: string; latency?: string; errorRate?: string; message?: string }[] = [];

      for (const service of services) {
        let serviceCurrentStatus: 'operational' | 'perhatian' | 'bermasalah' = 'operational';
        let serviceMessage = 'Operasional';
        let serviceLatency = `${(Math.random() * (service.maxLatency - service.minLatency) + service.minLatency).toFixed(0)}ms`;
        let serviceErrorRate: string | undefined = undefined;
  
        if (Math.random() < service.errorChance) {
          const problemType = Math.random();
          if (problemType < 0.6) {
            serviceCurrentStatus = 'perhatian';
            serviceMessage = 'Peningkatan latensi';
            serviceLatency = `${(Math.random() * 100 + service.maxLatency).toFixed(0)}ms`;
            overallStatus = overallStatus === 'aman' ? 'perhatian' : overallStatus;
            overallMessage = 'Beberapa layanan menunjukkan peringatan.';
            overallDetails += `${service.name}: Latensi tinggi; `;
          } else {
            serviceCurrentStatus = 'bermasalah';
            serviceMessage = 'Tidak responsif / Error';
            serviceErrorRate = `${(Math.random() * 5 + 1).toFixed(1)}%`;
            serviceLatency = 'N/A';
            overallStatus = 'bermasalah';
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
      const globalMetrics: { [key: string]: string | number } = {
        cpu_usage: `${(Math.random() * 20 + 10).toFixed(1)}%`,
        memory_usage: `${(Math.random() * 30 + 30).toFixed(1)}%`,
        disk_usage: `${(Math.random() * 20 + 10).toFixed(1)}%`,
        network_throughput: `${(Math.random() * 500 + 100).toFixed(0)} Mbps`,
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
  
      response = new Response(JSON.stringify(statusData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=10, s-maxage=10', 
        },
      });
  
      if (defaultCache) {
        const cacheKeyForPut = new Request(request.url, { method: 'GET' });
        await defaultCache.put(cacheKeyForPut, response.clone());
      }
    }
  
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
