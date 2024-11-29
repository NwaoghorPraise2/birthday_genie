import {IFriend} from '@/types/friends.types';
import {FriendsRepository} from '../repositories/friendsRespository';
export class FriendService {
    static async doCreateFriend(friend: IFriend, userId: string) {
        //Manipulte the date of birth to be in the format of YYYY-MM-DD
        const createdfriend = await FriendsRepository.createFriend(friend, userId);
        return createdfriend;
    }

    static async doCreateFriends(friends: IFriend[], userId: string) {
        const createdfriends = await FriendsRepository.createFriends(friends, userId);
        return createdfriends;
    }

    static async doGetFriends(userId: string) {
        const friends = await FriendsRepository.getFriends(userId);
        return friends;
    }

    static async doUpdateFriend(friendId: string, friend: IFriend, userId: string) {
        const updatedfriend = await FriendsRepository.updateFriend(friendId, friend, userId);
        return updatedfriend;
    }

    static async doGetFriend(id: string, userId: string) {
        const friend = await FriendsRepository.getFriend(id, userId);
        return friend;
    }

    static async doDeleteFriend(id: string, userId: string) {
        const deletedfriend = await FriendsRepository.deleteFriend(id, userId);
        return deletedfriend;
    }
}

