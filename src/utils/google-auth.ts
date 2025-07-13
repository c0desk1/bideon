
import type { Env } from '../lib/types';
  
export interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}
  
export function generateAuthURL(env: Env): string {
    const base = 'https://accounts.google.com/o/oauth2/v2/auth';
  
    const params = new URLSearchParams({
      client_id: env.BLOGGER_CLIENT_ID,
      redirect_uri: env.BLOGGER_REDIRECT_URI,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/blogger',
      access_type: 'offline',
      prompt: 'consent',
    });
  
    return `${base}?${params.toString()}`;
}
  
export async function exchangeCodeForToken(code: string, env: Env): Promise<TokenResponse> {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
  
    const body = new URLSearchParams({
      code,
      client_id: env.BLOGGER_CLIENT_ID,
      client_secret: env.BLOGGER_CLIENT_SECRET,
      redirect_uri: env.BLOGGER_REDIRECT_URI,
      grant_type: 'authorization_code',
    });
  
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
  
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Token exchange failed: ${error}`);
    }
  
    const json = await res.json();
    return json as TokenResponse;
}

export async function exchangeRefreshToken(refreshToken: string, env: Env) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: env.BLOGGER_CLIENT_ID,
        client_secret: env.BLOGGER_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
  
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to refresh token: ${err}`);
    }
  
    return await res.json() as {
      access_token: string;
      expires_in: number;
      token_type: string;
    };
}
  