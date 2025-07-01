import type { CollectionEntry } from 'astro:content';
import { useState } from 'react';
import PostCard from './PostCard';

interface Props {
  posts: CollectionEntry<'blog'>[];
}

export default function SearchClient({ posts }: Props) {
  const [query, setQuery] = useState('');
  const filtered = posts.filter((post) =>
    post.data.title.toLowerCase().includes(query.toLowerCase()) ||
    post.data.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-16">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari artikel..."
          className="w-full px-12 py-4 rounded-xl bg-zinc-900/50 border border-white/10 backdrop-blur-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xl pointer-events-none"></i>
      </div>

      {query.length >= 2 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filtered.length > 0 ? (
            filtered.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="text-zinc-400 col-span-full text-center">Tidak ada hasil ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
}
