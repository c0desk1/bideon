let lastPublished = "";

export async function GET() {
  const blogId = import.meta.env.VITE_BLOGGER_BLOG_ID;
  const apiKey = import.meta.env.VITE_BLOGGER_API_KEY;

  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`);
  const data = await res.json();

  if (!data.items || !Array.isArray(data.items)) {
    return new Response("Gagal ambil data dari Blogger", { status: 500 });
  }

  const latestPost = data.items[0];
  const latestTime = latestPost?.published;

  if (latestTime && latestTime !== lastPublished) {
    lastPublished = latestTime;

    await fetch("https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/your-hook-id", {
      method: "POST",
    });

    return new Response("Post baru ditemukan. Deploy dikirim!", { status: 200 });
  }

  return new Response("Tidak ada post baru.", { status: 200 });
}
