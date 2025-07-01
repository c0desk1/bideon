// src/pages/api/subscribe.js

export const POST = async ({ request }) => {
    try {
      const body = await request.json(); // Menguraikan body request JSON
      const { email } = body; // Mengambil email dari body
  
      // Validasi email dasar
      if (!email || !email.includes('@') || !email.includes('.')) {
        return new Response(JSON.stringify({ error: 'Alamat email tidak valid.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
  
      // --- Mengirim data ke Web3Forms ---
      const web3formsResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Penting untuk menerima respons JSON
        },
        body: JSON.stringify({
          access_key: import.meta.env.WEB3FORMS_ACCESS_KEY, // Mengambil key dari .env
          email: email,
          subject: 'New Newsletter Subscriber!', // Subjek email yang akan kamu terima
          // Kamu bisa tambahkan field lain jika diperlukan oleh Web3Forms
          // from_name: 'Your Website Newsletter',
        }),
      });
  
      const web3formsData = await web3formsResponse.json();
  
      if (web3formsData.success) {
        console.log(`[BACKEND] Berhasil mengirim email ${email} ke Web3Forms.`);
        return new Response(JSON.stringify({ message: 'Terima kasih, email Anda telah berhasil didaftarkan!' }), {
          status: 200, // OK
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        console.error(`[BACKEND] Gagal mengirim email ke Web3Forms:`, web3formsData.message);
        return new Response(JSON.stringify({ error: web3formsData.message || 'Gagal mendaftar. Silakan coba lagi.' }), {
          status: 500, // Internal Server Error
          headers: { 'Content-Type': 'application/json' }
        });
      }
  
    } catch (error) {
      console.error('Kesalahan server saat memproses langganan:', error);
      return new Response(JSON.stringify({ error: 'Kesalahan server internal. Silakan coba lagi nanti.' }), {
        status: 500, // Internal Server Error
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };