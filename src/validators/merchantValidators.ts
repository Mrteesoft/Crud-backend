import { z } from 'zod';

export const merchantSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  contactEmail: z.string().email().optional(),
});

export type MerchantInput = z.infer<typeof merchantSchema>;


