interface Qna {
  id: number;
  question: string;
  answer: string;
}

export default function QnaCard({ qna }: { qna: Qna }) {
  return (
    <div className="bg-zinc-900 border border-white/10 p-6 rounded-lg shadow hover:border-white/20 transition-all">
      <h3 className="text-white text-lg font-semibold mb-2">{qna.question}</h3>
      <p className="text-zinc-400 text-sm">{qna.answer}</p>
    </div>
  );
}
