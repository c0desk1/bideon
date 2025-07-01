import { useState } from 'react';

export default function QuestionForm() {
  const [question, setQuestion] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert(`Pertanyaan dikirim: ${question}`);
        setQuestion('');
      }}
      className="mt-8"
    >
      <label className="block text-sm font-medium text-white mb-1">Tanyakan Sesuatu</label>
      <textarea
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full bg-zinc-800 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Tulis pertanyaanmu di sini..."
        required
      />
      <button
        type="submit"
        className="mt-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
      >
        Kirim Pertanyaan
      </button>
    </form>
  );
}
