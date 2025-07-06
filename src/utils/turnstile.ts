export async function verifyTurnstile(token: string): Promise<boolean> {
    const secret = import.meta.env.VITE_TURNSTILE_SECRET_TOKEN;
    if (!secret || !token) return false;
  
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
    });
  
    const data = await res.json();
    return data.success === true;
  }
  
