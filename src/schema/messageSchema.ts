import * as z from 'zod';

export const messageSchema = z.object({
    status: z.enum(['sent', 'draft', 'deleted']).optional(),
    message: z.string().optional(),
    tag: z.enum(['human', 'ai']).optional(),
    isDeleted: z.boolean().optional()
});

