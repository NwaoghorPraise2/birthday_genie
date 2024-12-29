import * as z from 'zod';

const toSentenceCase = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const User = z.object({
    username: z
        .string({
            message: 'Username must be a string and it is required.'
        })
        .trim()
        .min(8, 'Username must be 8 character and above!')
        .transform(toSentenceCase),
    password: z
        .string({
            message: 'Password must be a string and it is required.'
        })
        .min(12, 'Password must be at least 12 characters long.')
        .regex(/[A-Z]/, 'Password must include at least one uppercase letter (A–Z).')
        .regex(/[a-z]/, 'Password must include at least one lowercase letter (a–z).')
        .regex(/[0-9]/, 'Password must include at least one number (0–9).')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include at least one special character (!, @, #, $, etc.).')
        .trim(),
    email: z
        .string({
            message: 'Email must be a string and it is required.'
        })
        .email()
        .trim()
        .toLowerCase(),
    name: z.string().trim().transform(toSentenceCase).optional(),
    phoneNumber: z.string().trim().optional(),
    profilePic: z.string().trim().optional()
});

export const UserLogin = z.object({
    email: z
        .string({
            message: 'Email must be a string and it is required.'
        })
        .email()
        .trim()
        .toLowerCase(),
    password: z
        .string({
            message: 'Password must be a string and it is required.'
        })
        .min(12, 'Password must be at least 12 characters long.')
        .regex(/[A-Z]/, 'Password must include at least one uppercase letter (A–Z).')
        .regex(/[a-z]/, 'Password must include at least one lowercase letter (a–z).')
        .regex(/[0-9]/, 'Password must include at least one number (0–9).')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include at least one special character (!, @, #, $, etc.).')
        .trim()
});

export const Password = z.object({
    oldPassword: z
        .string({
            message: 'Password must be a string and it is required.'
        })
        .min(12, 'Password must be at least 12 characters long.')
        .regex(/[A-Z]/, 'Password must include at least one uppercase letter (A–Z).')
        .regex(/[a-z]/, 'Password must include at least one lowercase letter (a–z).')
        .regex(/[0-9]/, 'Password must include at least one number (0–9).')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include at least one special character (!, @, #, $, etc.).')
        .trim(),
    newPassword: z
        .string({
            message: 'Password must be a string and it is required.'
        })
        .min(12, 'Password must be at least 12 characters long.')
        .regex(/[A-Z]/, 'Password must include at least one uppercase letter (A–Z).')
        .regex(/[a-z]/, 'Password must include at least one lowercase letter (a–z).')
        .regex(/[0-9]/, 'Password must include at least one number (0–9).')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include at least one special character (!, @, #, $, etc.).')
        .trim()
});

export const ForgotPassword = z.object({
    email: z
        .string({
            message: 'Email must be a string and it is required.'
        })
        .email()
        .trim()
        .toLowerCase()
});

export const ResetPassword = z.object({
    newPassword: z
        .string({
            message: 'Password must be a string and it is required.'
        })
        .min(12, 'Password must be at least 12 characters long.')
        .regex(/[A-Z]/, 'Password must include at least one uppercase letter (A–Z).')
        .regex(/[a-z]/, 'Password must include at least one lowercase letter (a–z).')
        .regex(/[0-9]/, 'Password must include at least one number (0–9).')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include at least one special character (!, @, #, $, etc.).')
        .trim()
});

export const token = z.object({
    token: z.string().trim()
});

