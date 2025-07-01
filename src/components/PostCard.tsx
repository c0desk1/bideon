// src/components/PostCard.tsx
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PostCard({ post }: Props) {
  const categorySlug = post.data.category?.toLowerCase().replace(/\s+/g, '-');

  return (
    <a href={`/blog/${post.slug}`} className="block bg-zinc-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl group">
      {post.data.heroImage && (
        <img src={post.data.heroImage} alt={post.data.title ?? 'Thumbnail'} loading="lazy" className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-200" />
      )}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200">
          {post.data.title}
        </h3>
        {post.data.description && <p className="text-zinc-400 text-sm mb-3">{post.data.description}</p>}
        <div className="text-zinc-500 text-xs flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
          {post.data.author && <span className="flex items-center">{post.data.author}</span>}
          {post.data.author && post.data.category && <span className="mx-0.5">•</span>}
          {post.data.category && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/blog/category/${categorySlug}`;
              }}
              className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs hover:bg-blue-500 cursor-pointer"
            >
              {post.data.category}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-zinc-500">{formatDate(new Date(post.data.pubDate))}</p>
      </div>
    </a>
  );
}
