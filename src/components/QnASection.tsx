// src/components/QnASection.tsx
import QnAList from './QnAList';

export default function QnASection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-left mb-10">
        <p className="inline-block text-xs font-semibold uppercase bg-gradient-to-r from-sky-500 to-indigo-500 text-transparent bg-clip-text tracking-wide">Tanya Jawab</p>
        <h2 className="text-3xl font-bold text-white">Pertanyaan Umum</h2>
        <p className="text-sm text-zinc-400 mt-1 leading-relaxed max-w-md">Kami menjawab hal-hal yang sering ditanyakan seputar layanan kami.</p>
        <a href="/qna" className="inline-block mt-4 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors">Lihat Semua Tanya Jawab</a>
      </div>
      <QnAList />
    </section>
  );
}
