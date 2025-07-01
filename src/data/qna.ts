// src/data/qna.ts
export interface QnaItem {
  id: number;
  question: string;
  answer?: string;
  status: 'terjawab' | 'menunggu';
}

export const qnaList: QnaItem[] = [
  { id: 1, question: 'Bagaimana cara deploy blog ini?', answer: 'Gunakan Vercel atau Cloudflare Pages.', status: 'terjawab' },
  { id: 2, question: 'Apakah ada fitur dark mode?', status: 'menunggu' },
  // Tambahkan data lainnya sesuai kebutuhan
];
