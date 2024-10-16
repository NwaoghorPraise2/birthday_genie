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
        const {password, ...userWithoutPassword} = response;
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

    public static async getUserById(id: string){
        const User = await db.user.findUnique({
            where: {
                id: id
            }
        })
        return this.userWithoutPassword(User);
    }
}