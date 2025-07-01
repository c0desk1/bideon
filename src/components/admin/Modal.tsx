// src/components/admin/Modal.tsx
import React, { type ReactNode } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: Props) {
  if (!isOpen) return null;

  return (
    // Latar belakang gelap (overlay)
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center"
      onClick={onClose} // Menutup modal jika area gelap diklik
    >
      {/* Panel Modal */}
      <div 
        className="bg-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl border border-zinc-700"
        onClick={e => e.stopPropagation()} // Mencegah modal tertutup saat panelnya diklik
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4144L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
          </button>
        </div>
        {/* Konten Modal (diisi oleh `children`) */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}