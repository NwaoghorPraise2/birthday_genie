/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import GlobalError from '../utils/HttpsErrors';
import { AuthRepository } from '../repositories/authRepository';
import { IUser, IUserLogin } from '../types/auth.types';
import PasswordHelpers from '../utils/hash';
import responseMessage from '../constant/responseMessage';
import JWTService from '../utils/jwt';

export class AuthService {
    private static JWTService = JWTService.getInstance();

    public static async doUserRegistration(user: IUser){
       const isUserExists: unknown = await AuthRepository.getUserByEmail(user.email);
       if(isUserExists) throw new GlobalError(409, responseMessage.USER_ALREADY_EXISTS);
       const hashedPassword = await PasswordHelpers.hashPassword(user.password);
       const result: unknown = await AuthRepository.createUser({...user, password: hashedPassword});
       return result
    }

    public static async doLogin(user: IUserLogin){
        const User: IUser = await AuthRepository.getUserByEmail(user.email);
        if(!User) throw new GlobalError(400, responseMessage.NOT_FOUND(`User with ${user.email} `));
        const isPasswordValid: boolean = await PasswordHelpers.comparePassword(user.password,User.password);
        if(!isPasswordValid) throw new GlobalError(400, responseMessage.INVALID_CREDENTIALS);
        const payload = {id: User.id}
        const token =  this.JWTService.signToken(payload);
        const result = AuthRepository.userWithoutPassword(User);
        return {token, result}
    };
}