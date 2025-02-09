import * as z from 'zod';
import {toSentenceCase, formatDate} from './userSchema';

export const Friend = z.object({
    name: z.string().transform(toSentenceCase).optional(),
    preferredName: z.string().transform(toSentenceCase),
    dateOfBirth: z.string().transform((val) => (val ? formatDate(val) : val)),
    phoneNumber: z.string().optional(),
    profiePic: z.string().optional(),
    email: z.string().email().optional(),
    relationship: z.string().transform(toSentenceCase).optional(),
    description: z.string().transform(toSentenceCase).optional(),
    isDeleted: z.boolean().optional()
});

