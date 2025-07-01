// src/components/QnASection.tsx
import QnAList from './QnAList';

export default function QnASection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Tanya Jawab</h2>
        <p className="text-zinc-400 mt-2 max-w-xl mx-auto text-sm sm:text-base">
          Beberapa pertanyaan populer dari pengunjung dan jawabannya.
        </p>
      </div>

      <QnAList />

      <div className="text-center mt-10">
        <a
          href="/qna"
          className="inline-block px-6 py-2 rounded-full border border-white/10 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors"
        >
          Lihat Semua Tanya Jawab →
        </a>
      </div>
    </section>
  );
}
