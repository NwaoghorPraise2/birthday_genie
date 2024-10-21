/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import db from '../config/db';

export class UserRepository {
    private static async getAllUser(){
        return await db.user.findMany();
    }
}