import {IFriend} from '@/types/friends.types';
import {FriendsRepository} from '../repositories/friendsRespository';
export class FriendService {
    static async createFriend(friend: IFriend, userId: string) {
        //Manipulte the date of birth to be in the format of YYYY-MM-DD
        const createdfriend = await FriendsRepository.createFriend(friend, userId);
        return createdfriend;
    }
}

