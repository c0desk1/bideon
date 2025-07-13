import type { Env, GitHubTokenResponse } from '../types';
import { exchangeCodeForToken } from '../google-auth';

export async function handleGoogleAuthCallback(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return new Response('Missing code', { status: 400 });

  try {
    const tokenData = await exchangeCodeForToken(code, env);

    const expiresAt = Date.now() + tokenData.expires_in * 1000;

    await env.BIMA_KV_SPACE.put("google_oauth_token", JSON.stringify({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt,
    }));

    return new Response(JSON.stringify({
      message: "Token stored in KV",
      access_token: tokenData.access_token,
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    return new Response(err.message || "Token exchange failed", { status: 500 });
  }
}

export async function handleGithubAuthCallback(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return new Response('Missing code', { status: 400 });

  try {

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json() as GitHubTokenResponse;

    if (tokenData.error) {
      return new Response(`OAuth error: ${tokenData.error_description}`, { status: 400 });
    }

    const expiresAt = Date.now() + (60 * 60 * 1000);
    await env.BIMA_KV_SPACE.put("github_oauth_token", JSON.stringify({
      access_token: tokenData.access_token,
      expires_at: expiresAt,
    }));

    return new Response(JSON.stringify({
      message: "GitHub token stored in KV",
      access_token: tokenData.access_token,
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    return new Response(err.message || "Token exchange failed", { status: 500 });
  }
}

