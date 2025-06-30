// src/pages/api/auth/login.js (Contoh Sederhana)
export const GET = async ({ url, redirect }) => {
    const GITHUB_CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
    const REDIRECT_URI = `${url.origin}/api/auth/callback`; // URL callback Anda
  
    // Generate random state for security
    const state = Math.random().toString(36).substring(2);
    // Simpan state di session atau cookie untuk verifikasi
    // Contoh: Astro.cookies.set('github_oauth_state', state, { httpOnly: true, secure: true, path: '/' });
  
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo,user&state=${state}`;
    return redirect(githubAuthUrl);
  };