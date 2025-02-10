import {IUser} from '../types/auth.types';
import {UserRepository} from '../repositories/userRepository';

class UseService {
    public static async doGetAllUsers() {
        return await UserRepository.getAllUser();
    }

    public static async doUpdateProfilePic(userId: string, profilePic: string) {
        return await UserRepository.updateProfilePic(userId, profilePic);
    }

    public static async doUpdateUserProfile(userId: string, data: IUser) {
        return await UserRepository.updateUserProfile(userId, data);
    }

    public static async doGetUserProfile(userId: string) {
        return await UserRepository.getUserProfile(userId);
    }
}

export default UseService;

