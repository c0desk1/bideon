// src/components/ProductCard.tsx
import type { Product } from '../data/products';

const StarIcon = (props: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
  </svg>
);

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div 
      className="group flex flex-col h-full 
                 bg-zinc-900 rounded-lg overflow-hidden
                 border border-slate-800 
                 transition-all duration-300
                 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
    >
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full aspect-video object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      <div className="flex flex-col flex-grow p-5">
        <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">{product.platform}</p>
            {product.rating && (
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <StarIcon className="w-4 h-4" />
                  <span className="font-bold">{product.rating.toFixed(1)}</span>
                </div>
            )}
        </div>
        
        <h3 className="font-bold text-lg text-white leading-tight mb-2">
          {product.name}
        </h3>
        
        {product.review && (
          <p className="text-sm text-slate-400">
            {product.review}
          </p>
        )}
        <div className="mt-auto pt-6 flex justify-between items-end">
            <div className="flex flex-col">
                <p className="text-xl font-extrabold text-white">
                    {formatPrice(product.price)}
                </p>
            </div>
            <a 
              href={product.affiliateLink} 
              target="_blank" 
              rel="noopener noreferrer sponsored"
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
            >
              Lihat Detail
            </a>
        </div>
      </div>
    </div>
  );
}