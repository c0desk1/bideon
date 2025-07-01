// src/components/CommentList.tsx
import { useState } from 'react';
import { comments } from '@/data/comments';

const reactions = ['🔥', '👍', '💡', '❤️', '👏'];

export default function CommentList() {
    const [userReactions, setUserReactions] = useState<{ [key: number]: string | null }>({});

    const handleReaction = (id: number, reaction: string) => {
        setUserReactions((prev) => ({ ...prev, [id]: reaction }));
    };

    return (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Komentar Pilihan
          </h2>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {comments.map((comment, i) => {
              const colSpan = i % 4 === 0 ? 'lg:col-span-3' : 'lg:col-span-2';
    
              return (
                <div
                  key={comment.id}
                  className={`rounded-xl border border-white/5 bg-zinc-900 p-5 flex flex-col justify-between shadow-sm hover:border-white/10 transition-all duration-200 ${colSpan}`}
                >
                  <p className="text-white text-sm mb-4 leading-relaxed">“{comment.message}”</p>
    
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">— {comment.name}</span>
                    <div className="flex gap-1">
                      {reactions.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(comment.id, emoji)}
                          className={`text-sm px-2 py-1 rounded-full ${
                            userReactions[comment.id] === emoji
                              ? 'bg-blue-600 text-white'
                              : 'text-white/40 hover:text-white'
                          }`}
                          aria-label={`React ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      );
    }
    