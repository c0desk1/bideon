import type { Env } from '../types';
import { exchangeRefreshToken } from '../google-auth';

export async function getValidToken(env: Env): Promise<string> {
  const kv = env.BIMA_KV_SPACE;
  const tokenRaw = await kv.get("oauth_token");

  if (!tokenRaw) throw new Error("Token not found");

  const stored = JSON.parse(tokenRaw) as {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };

  const isExpired = Date.now() > stored.expires_at;

  if (!isExpired) {
    return stored.access_token;
  }

  const refreshed = await exchangeRefreshToken(stored.refresh_token, env);
  const newExpiresAt = Date.now() + refreshed.expires_in * 1000;

  await kv.put("oauth_token", JSON.stringify({
    access_token: refreshed.access_token,
    refresh_token: stored.refresh_token,
    expires_at: newExpiresAt,
  }));

  return refreshed.access_token;
}
