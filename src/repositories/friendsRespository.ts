import db from '../config/db';
import {IFriend} from '../types/friends.types';

export class FriendsRepository {
    static async createFriend(friend: IFriend, userId: string) {
        return await db.friends.create({
            data: {
                ...friend,
                userId
            }
        });
    }

    static async createFriends(friends: IFriend[], userId: string) {
        const friendsWithUserId = friends.map((friend) => ({
            ...friend,
            userId
        }));

        return await db.friends.createMany({
            data: friendsWithUserId,
            skipDuplicates: true
        });
    }

    static async getFriends(userId: string) {
        return await db.friends.findMany({
            where: {
                userId
            },
            orderBy: {
                dateOfBirth: 'desc'
            }
        });
    }

    static async getFriend(id: string, userId: string) {
        return await db.friends.findFirst({
            where: {
                id,
                userId
            }
        });
    }

    static async updateFriend(friendId: string, friend: IFriend, userId: string) {
        return await db.friends.update({
            where: {
                id: friendId,
                userId
            },
            data: {
                ...friend
            }
        });
    }

    static async deleteFriend(id: string, userId: string) {
        return await db.friends.delete({
            where: {
                id,
                userId
            }
        });
    }
}

