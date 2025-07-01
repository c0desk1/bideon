// src/components/CommentForm.tsx
import { useState } from 'react';

export default function CommentForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 bg-zinc-900 rounded-lg p-6 space-y-4 border border-white/5">
      <h3 className="text-white text-lg font-semibold">Tinggalkan Komentar</h3>
      <input
        type="text"
        placeholder="Nama"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-white/10"
        required
      />
      <textarea
        placeholder="Komentar kamu..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-white/10"
        rows={4}
        required
      ></textarea>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
      >
        Kirim
      </button>
      {submitted && (
        <p className="text-green-400 text-sm mt-2">Terima kasih! Komentar kamu sudah terkirim (dummy).</p>
      )}
    </form>
  );
}
