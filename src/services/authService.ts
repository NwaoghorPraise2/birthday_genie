/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import GlobalError from '../utils/HttpsErrors';
import { AuthRepository } from '../repositories/authRepository';
import { IUser, IUserLogin } from '../types/auth.types';
import PasswordHelpers from '../utils/hash';
import responseMessage from '../constant/responseMessage';
import JWTService from '../utils/jwt';
import emailEmitter from '../utils/mail/emitter';
import generateTokens from '../utils/generateVerificationCode';

export class AuthService {
    private static JWTService = JWTService.getInstance();

    public static async doUserRegistration(user: IUser){
       const isUserExists: unknown = await AuthRepository.getUserByEmailOrUsername(user.email, user.username);
       if(isUserExists) throw new GlobalError(409, responseMessage.USER_ALREADY_EXISTS);
       
       const hashedPassword = await PasswordHelpers.hashPassword(user.password);
    
       const {verificationToken, verificationTokenExpiresAt} = generateTokens;

       const result = await AuthRepository.createUser({...user, password: hashedPassword, verificationToken, verificationTokenExpiresAt}) as IUser;

       if(!result) throw new GlobalError(500, responseMessage.SOMETHING_WENT_WRONG);

       const payload = {id: result.id};
       const access_token =  this.JWTService.signAccessToken(payload);
       const refresh_token = this.JWTService.signRefreshToken(payload);

        emailEmitter.emit('Verification-Email', {
        email: result?.email,
        name: result?.username, 
        verificationToken: result?.verificationToken
        })

       return {access_token, refresh_token, result};
    }

    public static async doLogin(user: IUserLogin){
        const User: IUser = await AuthRepository.getUserByEmail(user.email);
        if(!User) throw new GlobalError(400, responseMessage.NOT_FOUND(`User with ${user.email} `));
        const isPasswordValid: boolean = await PasswordHelpers.comparePassword(user.password,User.password);
        if(!isPasswordValid) throw new GlobalError(400, responseMessage.INVALID_CREDENTIALS);
        const payload = {id: User.id}
        const access_token =  this.JWTService.signAccessToken(payload);
        const refresh_token = this.JWTService.signRefreshToken(payload);
        const result = AuthRepository.userWithoutPassword(User);
        return {access_token, refresh_token, result}
    };

    public static async doGetUserProfile(id: string){
        const User: IUser = await AuthRepository.getUserById(id);
        if(!User) throw new GlobalError(400, responseMessage.NOT_FOUND(`User with ${id} `));
        return User
    }

    public static async verifyEmail(token: string){
        const user: IUser = await AuthRepository.getUserByVerificationToken(token);

        if(!user) throw new GlobalError(400, responseMessage.NOT_FOUND(`Expired Token or Verification Token`));

        if(user.isVerified === true) throw new GlobalError(400, responseMessage.ALREADY_VERIFIED);

        
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await AuthRepository.verifyUser(
            user.id as string,
            user.isVerified = true, 
            user.verificationToken = undefined, 
            user.verificationTokenExpiresAt = undefined
         );

        // emailEmitter.emit('Welcome-Email', {
        //     email: user.email, 
        //     name: user.username
        // });

        return user;
    }
}