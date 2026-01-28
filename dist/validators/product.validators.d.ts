import { z } from 'zod';
export declare const productSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    inStock: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type ProductInput = z.infer<typeof productSchema>;
//# sourceMappingURL=product.validators.d.ts.map