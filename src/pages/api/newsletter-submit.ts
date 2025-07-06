import type { APIContext } from "astro";

export async function POST({ request }: APIContext) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const token = formData.get("cf-turnstile-response")?.toString();

  if (!email || !token) {
    return new Response("Data tidak lengkap", { status: 400 });
  }

  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: import.meta.env.TURNSTILE_SECRET_TOKEN,
      response: token,
    }),
  });

  const verifyData = await verifyRes.json();
  if (!verifyData.success) {
    return new Response("Verifikasi bot gagal", { status: 403 });
  }

  const result = await fetch("https://buttondown.email/api/emails/embed-subscribe/bimaakbar", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email, embed: "1" }),
  });

  return new Response(result.ok ? "Berhasil langganan!" : "Gagal langganan.", { status: result.ok ? 200 : 500 });
}
