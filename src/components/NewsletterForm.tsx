// src/components/NewsletterForm.tsx
import { SITE } from '@/data/site.ts';
import React, { useState, type FormEvent, type ChangeEvent } from 'react';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="relative z-10 text-left max-w-lg px-4">
      <h2 className="text-3xl font-bold text-white">Mari tetap berhubungan</h2>
      <p className="text-sm mt-1 text-zinc-400 leading-relaxed max-w-md">Masukkan email untuk mendapatkan informasi terkini dari {SITE.TITLE}.</p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-stretch max-w-md gap-4">
        <label htmlFor="email-address" className="sr-only">Alamat email</label>
        <input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={handleChange}
          className="w-full appearance-none rounded-md border border-white/10 bg-white/5 px-3.5 py-2 text-white shadow-sm focus:border-blue-400 sm:text-sm"
          placeholder="Masukkan email Anda"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Mengirim...' : 'Berlangganan buletin kami'}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-sm ${
            message.includes('kesalahan') ? 'text-red-400' : 'text-green-400'
          }`}
        >
          {message}
        </p>
      )}
    </div>

  );
};

export default NewsletterForm;
