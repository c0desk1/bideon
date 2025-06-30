// src/components/NewsletterForm.jsx
import React, { useState } from 'react';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Mengirim data formulir ke API endpoint Astro kita
      // Endpoint ini akan meneruskan ke Web3Forms
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Terima kasih! Email Anda telah terdaftar.');
        setEmail('');
      } else {
        setMessage(data.error || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 text-center">
      <h2 className="text-3xl font-bold text-white">Jangan Ketinggalan Update</h2>
      <p className="mt-2 text-zinc-400 max-w-lg mx-auto">
        Dapatkan notifikasi setiap kali ada konten baru.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center max-w-md mx-auto gap-4">
        <label htmlFor="email-address" className="sr-only">Alamat email</label>
        <input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-w-0 flex-auto appearance-none rounded-md border border-white/10 bg-white/5 px-3.5 py-2 text-white shadow-sm focus:border-blue-400 sm:text-sm"
          placeholder="Masukkan email Anda"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-all flex-none disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Mengirim...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm ${message.includes('kesalahan') ? 'text-red-400' : 'text-green-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterForm;