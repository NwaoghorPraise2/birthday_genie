/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import db from '../config/db';
import {IUser} from '../types/auth.types';

export class AuthRepository {
    /**
     * Fetch a user by their email address.
     * @param {string} email - The email address of the user.
     * @returns {Promise<IUser | null>} The user object or null if not found.
     */
    public static async getUserByEmail(email: string) {
        return await db.user.findUnique({
            where: {
                email
            }
        });
    }

    /**
     * Fetch a user by email or username.
     * @param {string} email - The email address of the user.
     * @param {string} username - The username of the user.
     * @returns {Promise<IUser | null>} The user object or null if not found.
     */
    public static async getUserByEmailOrUsername(email: string, username: string) {
        return await db.user.findFirst({
            where: {
                OR: [{email: email}, {username: username}]
            }
        });
    }

    /**
     * Remove sensitive information (password, refreshToken) from the user object.
     * @param {any} response - The user object from the database.
     * @returns {Omit<IUser, 'password' | 'refreshToken'>} User object without password and refreshToken.
     */
    public static userWithoutPassword(response: any) {
        const {password, refreshToken, ...userWithoutPassword} = response;
        return userWithoutPassword;
    }

    /**
     * Create a new user in the database.
     * @param {IUser} user - The user data to create.
     * @returns {Promise<Omit<IUser, 'password' | 'refreshToken'>>} The created user object without sensitive information.
     */
    public static async createUser(user: IUser) {
        const createdUser: Promise<IUser> = await db.user.create({
            data: {
                ...user
            }
        });
        return this.userWithoutPassword(createdUser);
    }

    /**
     * Fetch a user by their ID, including the password.
     * @param {string} id - The ID of the user.
     * @returns {Promise<IUser | null>} The user object or null if not found.
     */
    public static async getUserByIdWithPassword(id: string) {
        return await db.user.findUnique({
            where: {
                id: id
            }
        });
    }

    /**
     * Fetch a user by their ID, excluding sensitive information.
     * @param {string} id - The ID of the user.
     * @returns {Promise<Omit<IUser, 'password' | 'refreshToken'> | null>} The user object without sensitive information or null if not found.
     */
    public static async getUserById(id: string) {
        const user = await db.user.findUnique({
            where: {
                id: id
            }
        });
        return this.userWithoutPassword(user);
    }

    /**
     * Fetch a user by their ID, including the refresh token.
     * @param {string} id - The ID of the user.
     * @returns {Promise<IUser | null>} The user object or null if not found.
     */
    public static async getUserByIdWithRefreshToken(id: string) {
        return await db.user.findUnique({
            where: {
                id: id
            }
        });
    }

    /**
     * Fetch a user by their verification token.
     * @param {string} token - The verification token.
     * @returns {Promise<IUser | null>} The user object or null if not found.
     */
    public static async getUserByVerificationToken(token: string) {
        return await db.user.findFirst({
            where: {
                verificationToken: token,
                verificationTokenExpiresAt: {
                    gt: new Date()
                }
            }
        });
    }

    /**
     * Verify a user by updating their verification status.
     * @param {string} id - The ID of the user.
     * @param {boolean} isVerified - Verification status.
     * @param {string | undefined} verificationToken - The verification token.
     * @param {Date | undefined} verificationTokenExpiresAt - The expiration date of the token.
     * @returns {Promise<Omit<IUser, 'password' | 'refreshToken'>>} The updated user object without sensitive information.
     */
    public static async verifyUser(
        id: string,
        isVerified: boolean,
        verificationToken: string | undefined,
        verificationTokenExpiresAt: Date | undefined
    ) {
        const user = await db.user.update({
            where: {
                id: id
            },
            data: {
                isVerified,
                verificationToken: verificationToken ?? null,
                verificationTokenExpiresAt: verificationTokenExpiresAt ?? null
            }
        });
        return this.userWithoutPassword(user);
    }

    /**
     * Update a user's refresh token.
     * @param {string} id - The ID of the user.
     * @param {string | null} refreshToken - The new refresh token.
     * @returns {Promise<IUser>} The updated user object.
     */
    public static async updateRefreshToken(id: string, refreshToken: string | null) {
        return await db.user.update({
            where: {
                id: id
            },
            data: {
                refreshToken
            }
        });
    }

    /**
     * Update a user's password.
     * @param {string} id - The ID of the user.
     * @param {string} newPassword - The new password.
     * @returns {Promise<IUser>} The updated user object.
     */
    public static async updatePassword(id: string, newPassword: string) {
        return await db.user.update({
            where: {
                id: id
            },
            data: {
                password: newPassword
            }
        });
    }

    /**
     * Update a user's reset password token and its expiration date.
     * @param {string} id - The ID of the user.
     * @param {string | null} resetPasswordToken - The reset password token.
     * @param {Date | null} resetPasswordTokenExpiresAt - The expiration date of the token.
     * @returns {Promise<IUser>} The updated user object.
     */
    public static async updateResetPasswordToken(id: string, resetPasswordToken: string | null, resetPasswordTokenExpiresAt: Date | null) {
        return await db.user.update({
            where: {
                id: id
            },
            data: {
                resetPasswordToken,
                resetPasswordTokenExpiresAt
            }
        });
    }

    /**
     * Fetch a user by their reset password token.
     * @param {string} token - The reset password token.
     * @returns {Promise<IUser | null>} The user object or null if not found.
     */
    public static async getUserByResetPasswordToken(token: string) {
        return await db.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordTokenExpiresAt: {
                    gt: new Date()
                }
            }
        });
    }

    /**
     * Update a user's verification token and its expiration date.
     * @param {string} id - The ID of the user.
     * @param {string | null} verificationToken - The verification token.
     * @param {Date | null} verificationTokenExpiresAt - The expiration date of the token.
     * @returns {Promise<IUser>} The updated user object.
     */
    public static async updateVerificationToken(id: string, verificationToken: string | null, verificationTokenExpiresAt: Date | null) {
        return await db.user.update({
            where: {
                id: id
            },
            data: {
                verificationToken,
                verificationTokenExpiresAt
            }
        });
    }
}

