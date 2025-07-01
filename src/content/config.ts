// src/content/config.ts
import { defineCollection, z } from 'astro:content';

export const POSTS_PER_PAGE = 3;

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160, "Deskripsi tidak boleh lebih dari 160 karakter."),
    pubDate: z.string().refine((str) => !isNaN(Date.parse(str)), {
      message: 'Tanggal tidak valid. Gunakan format ISO 8601.',
    }).transform((str) => new Date(str)),
    
   
    heroImage: z.string().optional(),
    

    author: z.string().default('Your Name'),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isFeatured: z.boolean().default(false),
    draft: z.boolean().optional(),
    

    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().optional(),
    ogType: z.string().default('article'),
    readingTime: z.number().optional()
  }),
});

export const collections = {
  blog: blogCollection,
};