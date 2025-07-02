// src/data/products.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  platform: 'Shopee' | 'TikTok' | 'Tokopedia';
  imageUrl: string;
  affiliateLink: string;
  featured?: boolean;
  review?: string;
  rating?: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Folding Table Chair Portable Meja Camping Piknik',
    price: 114000,
    platform: 'Shopee',
    imageUrl: 'https://down-id.img.susercontent.com/file/id-11134201-7rask-m58kd9rqrgkdc9.webp',
    affiliateLink: 'https://s.shopee.co.id/9zmQeHJ1jY',
    featured: true,
    review: "Meja Kursi Lipat Set Free Meja Lipat Kursi Lipat Outdoor Indoor Tas Folding Table Chair Portable Meja Camping Piknik.",
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Mechanical Keyboard untuk Kerja',
    price: 550000,
    platform: 'Shopee',
    imageUrl: 'https://down-id.img.susercontent.com/file/id-11134201-7rask-m58kd9rqrgkdc9.webp',
    affiliateLink: 'https://s.shopee.co.id/9zmQeHJ1jY',
    featured: true,
    review: "Feeling ngetiknya solid dan gak berisik. Worth it!",
    rating: 5.0,
  },

];