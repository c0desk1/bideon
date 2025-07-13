// utils/handlers/authLogin.ts
import { generateAuthURL } from "../google-auth";
import type { Env } from "../../lib/types";

export async function handleAuthLogin(env: Env): Promise<Response> {
  const authUrl = generateAuthURL(env);
  return Response.redirect(authUrl, 302);
}
