import { AuthRepository } from '../repositories/authRepository';
import { IUser } from '../types/auth.types';
import PasswordHelpers from '../utils/hash';

export class AuthService {
    public static async doUserRegistration(user: IUser){
       const isUserExists: unknown = await AuthRepository.getUserByEmail(user.email);
       if(isUserExists) throw new Error('User already exists');
       const hashedPassword = await PasswordHelpers.hashPassword(user.password);
       const result: unknown = await AuthRepository.createUser({...user, password: hashedPassword});
       return result
    }
}