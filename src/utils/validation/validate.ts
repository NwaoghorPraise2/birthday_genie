import * as z from 'zod';

const toSentenceCase = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const User = z.object({
    username: z.string().trim().transform(toSentenceCase),
    password: z.string().min(8, 'Password must 8 Characters and above!').trim(),
    email: z.string().email().trim().toLowerCase(),
    name: z.string().trim().transform(toSentenceCase).optional(),
    phoneNumber: z.string().trim().optional(),
    profilePic: z.string().trim().optional(),
})

export const UserLogin = z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(8, 'Password must 8 Characters and above!').trim()
})

export const Password = z.object({
    oldPassword: z.string().min(8, 'Password must 8 Characters and above!').trim(),
    newPassword: z.string().min(8, 'Password must 8 Characters and above!').trim(),
})

export const ForgotPassword = z.object({
    email: z.string().email().trim().toLowerCase(),
})

export const ResetPassword = z.object({
    newPassword: z.string().min(8, 'Password must 8 Characters and above!').trim(),
})