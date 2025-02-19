import db from '../config/db';

export default class CalenderRepository {
    static async getUserAndFriendsBirthdays(userId: string) {
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
                email: true,
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
                }
            }
        });
    }
}

