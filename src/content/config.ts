// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160, "Deskripsi tidak boleh lebih dari 160 karakter."),
    pubDate: z.string().transform((str) => new Date(str)),
    
   
    heroImage: z.string().optional(),

    author: z.string().default('Your Name'),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isFeatured: z.boolean().default(false),

    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().optional(),
    ogType: z.string().default('article'),
  }),
});

export const collections = {
  blog: blogCollection,
};