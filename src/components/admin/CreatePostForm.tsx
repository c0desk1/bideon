// src/components/admin/CreatePostForm.tsx
import React, { useState } from 'react';

// Tambahkan props `onSuccess` untuk memberitahu parent (sidebar) agar menutup modal
interface Props {
  onSuccess: () => void;
}

export default function CreatePostForm({ onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const postData = { title, description, body };

    try {
      // GANTI console.log DENGAN fetch KE API KITA
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Jika ada error dari API, tampilkan pesannya
        throw new Error(result.message || 'Gagal menyimpan postingan.');
      }
      
      alert('Postingan berhasil disimpan sebagai draf!');
      onSuccess(); // Panggil fungsi untuk menutup modal
      window.location.reload(); // Muat ulang halaman untuk melihat postingan baru di daftar

    } catch (err) {
      // Tangkap error jaringan atau dari API
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tampilkan pesan error jika ada */}
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg">{error}</div>}

      {/* ... (semua input form lainnya tetap sama persis seperti sebelumnya) ... */}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">Judul Postingan</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-1">Deskripsi Singkat</label>
        <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required ></textarea>
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-zinc-300 mb-1">Isi Konten (Markdown)</label>
        <textarea id="body" rows={10} value={body} onChange={(e) => setBody(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tulis konten Anda di sini menggunakan format Markdown..." required ></textarea>
      </div>
      
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 disabled:bg-zinc-500 disabled:cursor-not-allowed transition-colors">
          {isSubmitting ? 'Menyimpan...' : 'Simpan Postingan'}
        </button>
      </div>
    </form>
  );
}