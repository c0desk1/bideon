// src/components/QnAList.tsx
import QnaCard from './QnaCard';

const dummyQna = [
  { id: 1, question: 'Bagaimana cara deploy Astro ke Vercel?', answer: 'Kamu bisa push ke GitHub lalu connect ke Vercel.', author: 'Rina' },
  { id: 2, question: 'Apakah bisa pakai Tailwind CSS?', answer: 'Bisa, Astro sangat kompatibel dengan Tailwind CSS.', author: 'Fajar' },
  { id: 3, question: 'Bagaimana cara membuat komponen?', answer: 'Buat file `.astro` atau `.tsx` lalu import dan gunakan.', author: 'Dewi' },
];

export default function QnAList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dummyQna.map((qna) => (
        <QnaCard key={qna.id} qna={qna} />
      ))}
    </div>
  );
}
