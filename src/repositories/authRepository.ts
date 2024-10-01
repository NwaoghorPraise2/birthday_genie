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

    public static async createUser(user: IUser){
       return await db.user.create({
            data:{
                ...user,
            }
       })
    }
}