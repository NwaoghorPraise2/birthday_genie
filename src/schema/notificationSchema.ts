import * as z from 'zod';
import {toSentenceCase} from './userSchema';

export const Notification = z.object({
    userId: z.string(),
    tag: z.string().optional(),
    title: z.string().transform(toSentenceCase),
    message: z.string().transform(toSentenceCase),
    isDeleted: z.boolean().optional(),
    isRead: z.boolean().optional()
});

