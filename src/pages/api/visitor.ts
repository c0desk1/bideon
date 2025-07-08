export async function GET() {
    const res = await fetch("https://bimaakbar.my.id/api/visitor");
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
}
