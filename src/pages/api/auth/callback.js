// src/pages/api/auth/callback.js (Contoh Sederhana & Belum Lengkap!)
// Ini perlu lebih banyak validasi dan penanganan error
export const GET = async ({ url, cookies, redirect }) => {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
  
    // WAJIB: Verifikasi state untuk mencegah CSRF
    // const storedState = cookies.get('github_oauth_state').value;
    // if (state !== storedState) {
    //   return new Response('State mismatch!', { status: 400 });
    // }
    // cookies.delete('github_oauth_state');
  
    const GITHUB_CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
    const GITHUB_CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;
  
    try {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });
  
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
  
      if (!accessToken) {
          console.error('Failed to get access token:', tokenData);
          return new Response('Failed to authenticate with GitHub', { status: 500 });
      }
  
      // WAJIB: Simpan access token ini dengan aman di Decap CMS.
      // Decap CMS mengharapkan token ini dikirim ke frontend admin melalui proxy.
      // Ini adalah bagian paling rumit. Anda mungkin perlu menggunakan Decap CMS Auth client
      // atau library pihak ketiga untuk mengimplementasikan proxy ini dengan benar.
      // Solusi yang lebih umum adalah menggunakan service seperti Netlify Identity for Decap CMS,
      // atau jika Anda ingin self-host auth proxy:
      // https://www.decapcms.org/docs/authentication-backends/#github-oauth
      // Redirect ke halaman admin dengan token atau setup lain yang dibutuhkan Decap
      return redirect('/admin/#/auth/github/callback?access_token=' + accessToken); // Ini adalah cara Decap CMS menerima token
  
    } catch (error) {
      console.error('OAuth callback error:', error);
      return new Response('Authentication failed', { status: 500 });
    }
  };