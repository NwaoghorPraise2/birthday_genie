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

    public static async getUserProfile(userId: string) {
        return await db.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                username: true,
                dateOfBirth: true,
                description: true,
                profilePic: true,
                phoneNumber: true,
                displayName: true,
                accountSettings: {
                    select: {
                        id: true,
                        userId: true,
                        birthdayNotificationTime: true,
                        timeToSendBirthdayMessages: true,
                        defaultMessageChannel: true,
                        useNickNameInMessage: true
                    }
                },
                friends: {
                    select: {
                        id: true,
                        name: true,
                        preferredName: true,
                        dateOfBirth: true,
                        phoneNumber: true,
                        profilePic: true,
                        email: true,
                        relationship: true,
                        description: true
                    }
                },
                notifications: {
                    select: {
                        id: true,
                        tag: true,
                        title: true,
                        message: true,
                        isDeleted: true,
                        isRead: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },
                messages: {
                    select: {
                        id: true,
                        status: true,
                        message: true,
                        tag: true,
                        isDeleted: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },
                histories: {
                    select: {
                        id: true,
                        friendId: true,
                        timeSent: true,
                        status: true,
                        channel: true,
                        createdAt: true,
                        updatedAt: true,
                        friend: {
                            select: {
                                id: true,
                                name: true,
                                preferredName: true,
                                dateOfBirth: true,
                                phoneNumber: true,
                                profilePic: true,
                                email: true,
                                relationship: true,
                                description: true
                            }
                        },
                        messages: {
                            select: {
                                id: true,
                                status: true,
                                message: true,
                                tag: true,
                                isDeleted: true,
                                createdAt: true,
                                updatedAt: true
                            }
                        }
                    }
                }
            }
        });
    }
}

