import db from '../config/db';
import {IFriend} from '../types/friends.types';

class FriendsRepository {
    static async createFriend(friend: IFriend) {
        return await db.friends.create({
            data: {
                ...friend
            }
        });
    }
}

