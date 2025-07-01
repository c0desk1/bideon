import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Gagal menyalin link:', err);
    }
  };

  return (
    <div className="mt-4 flex items-center gap-3">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
      >
        <i className="ri-share-line text-base" />
        {copied ? 'Tersalin!' : 'Salin Link'}
      </button>
    </div>
  );
}
