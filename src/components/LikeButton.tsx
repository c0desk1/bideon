// src/components/LikeButton.tsx
import { useState } from 'react';

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLikes((prev) => prev + 1);
      setLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setLiked(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`mt-8 flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-white/10 ${
        liked ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-300 hover:bg-white/10'
      } transition-colors`}
    >
      <i className="ri-heart-3-fill text-base" />
      {likes > 0 ? <span>{likes}</span> : <span>Like</span>}
    </button>
  );
}
