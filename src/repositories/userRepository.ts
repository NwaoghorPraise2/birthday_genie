import {IUser} from '@/types/auth.types';
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

    public static async updateUserProfile(userId: string, data: IUser) {
        return await db.user.update({
            where: {
                id: userId
            },
            data: {
                name: data?.name,
                username: data?.username,
                dateOfBirth: data?.dateOfBirth,
                description: data?.description,
                profilePic: data?.profilePic,
                phoneNumber: data?.phoneNumber,
                displayName: data?.displayName
            }
        });
    }
}

