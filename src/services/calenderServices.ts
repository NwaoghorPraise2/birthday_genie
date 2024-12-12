import {IFriend} from '@/types/friends.types';
import {FriendsRepository} from '../repositories/friendsRespository';
export class CalenderService {
    static async doSubscribeToCalender(userId: string, useTimeZone: string) {
        const friend = (await FriendsRepository.getFriends(userId)) as IFriend[];

        const friendsDetails = friend.map((friend) => {
            return {
                name: friend.name,
                dateOfBirth: friend.dateOfBirth
            };
        });
    }
}

