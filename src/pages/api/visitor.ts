export async function GET() {
    const res = await fetch("https://bima-akbar-dev.bimasaktiakbarr.workers.dev");
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
}
