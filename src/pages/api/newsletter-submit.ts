import type { APIContext } from "astro";
import { verifyTurnstile } from "../../utils/turnstile";
import { subscribeToButtondown } from "../../utils/buttondown";

export async function POST({ request }: APIContext) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const token = formData.get("cf-turnstile-response")?.toString();

  if (!email || !token) {
    return new Response("Data tidak lengkap", { status: 400 });
  }

  const isHuman = await verifyTurnstile(token);
  if (!isHuman) {
    return new Response("Verifikasi bot gagal", { status: 403 });
  }

  const success = await subscribeToButtondown(email);
  return new Response(success ? "Berhasil langganan!" : "Gagal langganan.", {
    status: success ? 200 : 500,
  });
}
