export async function GET() {
  try {
    const res = await fetch("https://bima-akbar-dev.bimasaktiakbarr.workers.dev/api/visit", {
      headers: {
        "Accept": "application/json"
      }
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Gagal fetch dari Worker", status: res.status }),
        { status: 502 }
      );
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Fetch failed", message: err.message }),
      { status: 500 }
    );
  }
}
