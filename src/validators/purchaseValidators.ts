import { z } from 'zod';

const statusEnum = z.enum(['pending', 'approved', 'active', 'completed', 'defaulted']);

export const purchaseSchema = z.object({
  merchantId: z.string().min(1),
  itemName: z.string().min(1),
  amount: z.number().positive(),
  tenureMonths: z.number().int().positive(),
  interestRate: z.number().nonnegative().optional(),
  status: statusEnum.optional(),
  startDate: z.coerce.date().optional(),
});

export type PurchaseInput = z.infer<typeof purchaseSchema>;


