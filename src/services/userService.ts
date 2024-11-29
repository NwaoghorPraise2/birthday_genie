/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {UserRepository} from '../repositories/userRepository';

class UseService {
    public static async doGetAllUsers() {
        return await UserRepository.getAllUser();
    }

    public static async doUpdateProfilePic(id: string, profilePic: string) {
        return await UserRepository.updateProfilePic(id, profilePic);
    }
}

export default UseService;
