// src/content.config.ts
import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		slug: z.string(),
		heroImage: image().optional(),
		tags: z.array(z.string()).max(5).optional(),
		category: z.string().optional(),
		author: z.object({
			name: z.string(),
			avatar: z.string().optional()
			}).optional(),
		
		
	}),
});

export const collections = { blog };
