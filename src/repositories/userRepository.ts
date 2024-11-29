/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import db from '../config/db';

export class UserRepository {
    public static async getAllUser() {
        return await db.user.findMany();
    }

    public static async getUserById(id: string) {
        return await db.user.findUnique({
            where: {
                id: id
            }
        });
    }

    public static async getUserByEmail(email: string) {
        return await db.user.findUnique({
            where: {
                email: email
            }
        });
    }

    public static async updateProfilePic(id: string, profilePic: string) {
        return await db.user.update({
            where: {
                id: id
            },
            data: {
                profilePic: profilePic
            }
        });
    }
}

