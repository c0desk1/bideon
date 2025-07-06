export async function subscribeToButtondown(email: string): Promise<boolean> {
    const res = await fetch("https://buttondown.email/api/emails/embed-subscribe/bimaakbar", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, embed: "1" }),
    });
  
    return res.ok;
  }
  