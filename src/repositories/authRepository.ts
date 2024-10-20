/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import db from '../config/db';
import { IUser } from '../types/auth.types';

export class AuthRepository {
    public static async getUserByEmail(email: string){
        return await db.user.findUnique({
            where: {
                email
            }
        })
    }

    public static async getUserByEmailOrUsername(email: string, username: string) {
        return await db.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });
    }    

    public static userWithoutPassword(response: any){
        const {password, refreshToken, ...userWithoutPassword} = response;
        return userWithoutPassword;
    }

    public static async createUser(user: IUser){
       const createduser: Promise<IUser> = await db.user.create({
            data:{
                ...user,
            }
       })
       return this.userWithoutPassword(createduser);
    }

    public static async getUserByIdWithPassword(id: string){
        return await db.user.findUnique({
            where: {
                id: id
            }
        })
    }

    public static async getUserById(id: string){
        const User = await db.user.findUnique({
            where: {
                id: id
            }
        })
        return this.userWithoutPassword(User);
    }

    public static async getUserByIdWithRefreshToken(id: string){
        return await db.user.findUnique({
            where: {
                id: id
            }
        })
    }

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

    public static async verifyUser(id: string, isVerified: boolean, verificationToken: string | undefined, verificationTokenExpiresAt: Date | undefined) {
        const user = await db.user.update({
            where: {
                id: id
            },
            data: {
                isVerified,
                verificationToken: verificationToken ?? null,
                verificationTokenExpiresAt: verificationTokenExpiresAt ?? null,
            }
        });

        return this.userWithoutPassword(user);
    }
    
    
    
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
    
}