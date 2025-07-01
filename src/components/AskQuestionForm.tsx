import { useState } from 'react';

export default function AskQuestionForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="container mx-auto px-4 py-12 max-w-xl">
      <h2 className="text-xl font-bold text-white mb-4">Ajukan Pertanyaan</h2>
      {submitted ? (
        <p className="text-green-400">Pertanyaan kamu berhasil dikirim (dummy)</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="Nama kamu" className="w-full px-4 py-2 bg-zinc-800 text-white rounded" />
          <textarea required placeholder="Tulis pertanyaanmu..." className="w-full px-4 py-2 bg-zinc-800 text-white rounded min-h-[120px]" />
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">Kirim</button>
        </form>
      )}
    </section>
  );
}
