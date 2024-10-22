/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { UserRepository } from '../repositories/userRepository';

class UseService{
    public static async doGetAllUsers (){
        return await UserRepository.getAllUser();
    }
}

export default UseService;