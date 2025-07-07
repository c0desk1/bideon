import type { APIContext } from "astro";
import { subscribeToButtondown } from "../../utils/buttondown";

export async function POST({ request }: APIContext) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();

  if (!email) {
    return new Response("Email tidak boleh kosong", { status: 400 });
  }

  const success = await subscribeToButtondown(email);
  return new Response(success ? "Berhasil langganan!" : "Gagal langganan.", {
    status: success ? 200 : 500,
  });
}
