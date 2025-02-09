import {IUser} from '../types/auth.types';
import {UserRepository} from '../repositories/userRepository';

class UseService {
    public static async doGetAllUsers() {
        return await UserRepository.getAllUser();
    }

    public static async doUpdateProfilePic(id: string, profilePic: string) {
        return await UserRepository.updateProfilePic(id, profilePic);
    }

    public static async doUpdateUserProfile(userId: string, data: IUser) {
        return await UserRepository.updateUserProfile(userId, data);
    }
}

export default UseService;

