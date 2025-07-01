// src/components/admin/CreatePostForm.tsx
import React, { useState } from 'react';

export default function CreatePostForm() {
  // 1. Siapkan "state" untuk setiap input form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Fungsi yang akan dijalankan saat form di-submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Mencegah halaman reload saat form disubmit
    setIsSubmitting(true);

    const postData = {
      title,
      description,
      body,
      // Nanti kita bisa tambahkan field lain seperti author, tanggal, dll.
    };

    // Untuk sekarang, kita hanya akan menampilkan datanya di konsol
    // untuk memastikan datanya sudah benar tertangkap.
    console.log('Data yang akan dikirim ke API:', postData);

    // Di langkah selanjutnya, kita akan ganti console.log ini dengan `fetch()` ke API
    alert('Data berhasil ditangkap! Cek konsol browser (F12) untuk melihatnya.');
    
    setIsSubmitting(false);
    // Di sini kita bisa tambahkan logika untuk menutup modal setelah berhasil
  };

  return (
    // 3. Gunakan onSubmit untuk memanggil fungsi handleSubmit
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
          Judul Postingan
        </label>
        <input
          type="text"
          id="title"
          value={title} // 4. Hubungkan input dengan state
          onChange={(e) => setTitle(e.target.value)} // 5. Update state saat ada perubahan
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">
          Deskripsi Singkat
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-zinc-300 mb-1">
          Isi Konten (Markdown)
        </label>
        <textarea
          id="body"
          rows={10}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tulis konten Anda di sini menggunakan format Markdown..."
          required
        ></textarea>
      </div>

      <div className="flex justify-end pt-2">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 disabled:bg-zinc-500 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Postingan'}
        </button>
      </div>
    </form>
  );
}