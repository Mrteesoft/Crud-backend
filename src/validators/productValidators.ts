import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  inStock: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;


