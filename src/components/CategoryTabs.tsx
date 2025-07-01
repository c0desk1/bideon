import type { CollectionEntry } from 'astro:content';
import { useState } from 'react';
import PostCard from './PostCard';

interface Props {
  latestPosts: CollectionEntry<'blog'>[];
  postsByCategory: Record<string, CollectionEntry<'blog'>[]>;
  categories: string[];
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-');
}

export default function CategoryTabs({ latestPosts, postsByCategory, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('Terbaru');

  const posts = activeCategory === 'Terbaru'
    ? latestPosts
    : postsByCategory[activeCategory] ?? [];

  return (
    <div>
      <div className="flex flex-wrap justify-left gap-2 mb-6">
        <button
          className={`py-2 px-4 rounded-lg cursor-pointer ${activeCategory === 'Terbaru' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
          onClick={() => setActiveCategory('Terbaru')}
        >
          Terbaru
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            className={`py-2 px-4 rounded-lg cursor-pointer ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-white'}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))
        ) : (
          <p className="text-center text-zinc-400 col-span-full">
            Tidak ada postingan yang ditemukan.
          </p>
        )}
      </div>

      {/* Link ke halaman kategori penuh */}
      {activeCategory !== 'Terbaru' && posts.length >= 3 && (
        <div className="text-center mt-6">
          <a
            href={`/blog/category/${slugify(activeCategory)}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-white hover:border-white/20 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
          >
            Lihat semua di "{activeCategory}"
            <i className="ri-arrow-right-line text-base" />
          </a>
        </div>
      )}
    </div>
  );
}
