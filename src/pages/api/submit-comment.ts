import type { APIContext } from "astro";

export async function POST({ request }: APIContext) {

    const { content, postId, blogId, accessToken, turnstileToken } = await request.json();
  
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: import.meta.env.TURNSTILE_SECRET_TOKEN,
        response: turnstileToken,
      }),
    });
  
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return new Response("Verifikasi bot gagal", { status: 403 });
    }
  
    const bloggerRes = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      }
    );
  
    if (!bloggerRes.ok) {
      return new Response("Gagal kirim komentar", { status: 500 });
    }
  
    return new Response("Komentar berhasil dikirim", { status: 200 });
  }
  