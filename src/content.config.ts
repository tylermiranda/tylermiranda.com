import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string(),
    author: z.string().default('Tyler Miranda'),
    tags: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
    readTime: z.string().default('4 min read'),
  }),
});

export const collections = { blog };
