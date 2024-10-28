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
        .min(8, 'Password must 8 Characters and above!')
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
        .min(8, 'Password must 8 Characters and above!')
        .trim()
});

export const Password = z.object({
    oldPassword: z
        .string({
            message: 'Password must be a string and it is required.'
        })
        .min(8, 'Password must 8 Characters and above!')
        .trim(),
    newPassword: z
        .string({
            message: 'Password must be a string and it is required.'
        })
        .min(8, 'Password must 8 Characters and above!')
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
        .min(8, 'Password must 8 Characters and above!')
        .trim()
});

export const token = z.object({
    token: z.string().trim()
});
