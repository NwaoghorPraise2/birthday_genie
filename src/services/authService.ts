/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import GlobalError from '../utils/HttpsErrors';
import { AuthRepository } from '../repositories/authRepository';
import PasswordHelpers from '../utils/hash';
import responseMessage from '../constant/responseMessage';
import JWTService from '../utils/jwt';
import emailEmitter from '../utils/mail/emitter';
import generateTokens from '../utils/tokenGenerator';
import { DecodedToken, IUser, IUserLogin } from '../types/auth.types';

export class AuthService {
    private static JWTService = JWTService.getInstance();

    private static async generateAcccesAndRefreshToken(payload: { id: string }): Promise<{ access_token: string, refresh_token: string }> {
        const userId = payload.id;
        const access_token: string = this.JWTService.signAccessToken(payload);
        const refresh_token: string= this.JWTService.signRefreshToken(payload); 
        await AuthRepository.updateRefreshToken(userId, refresh_token); 
        return { access_token, refresh_token }; 
    }
    
    public static async doUserRegistration(user: IUser){
       const isUserExists: unknown = await AuthRepository.getUserByEmailOrUsername(user.email, user.username);
       if(isUserExists) throw new GlobalError(409, responseMessage.USER_ALREADY_EXISTS);
       
       const hashedPassword = await PasswordHelpers.hashPassword(user.password);
    
       const {verificationToken, verificationTokenExpiresAt} = generateTokens;

       const result = await AuthRepository.createUser({...user, password: hashedPassword, verificationToken, verificationTokenExpiresAt}) as IUser;

       if(!result) throw new GlobalError(500, responseMessage.SOMETHING_WENT_WRONG);

       const payload = {id: result.id as string};
        
      const {access_token, refresh_token} = await this.generateAcccesAndRefreshToken(payload);

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
        const payload = {id: User.id as string}
        const {access_token, refresh_token} = await this.generateAcccesAndRefreshToken(payload);
        const result:IUser = AuthRepository.userWithoutPassword(User);
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

    public static async refreshToken(refreshToken: string){
        if(!refreshToken) throw new GlobalError(400, responseMessage.NOT_FOUND(`Refresh Token`));

        const decodedToken: DecodedToken = this.JWTService.verifyRefreshToken(refreshToken);
        if(!decodedToken) throw new GlobalError(401, responseMessage.INVALID_TOKEN);

        const user: IUser = await AuthRepository.getUserById(decodedToken.id);
        if(!user) throw new GlobalError(400, responseMessage.NOT_FOUND(`User with ${refreshToken} `));

        if(user.refreshToken !== refreshToken) throw new GlobalError(401, responseMessage.INVALID_TOKEN);

        const payload = {id: user.id as string}

        const {access_token, refresh_token} = await this.generateAcccesAndRefreshToken(payload);

        return {access_token, refresh_token};
    }

    public static async doChangeUserPassword(userId: string, oldPassword:string, newPassword: string){
        const user: IUser = await AuthRepository.getUserById(userId);

        const isPasswordValid: boolean = await PasswordHelpers.comparePassword(oldPassword, user.password);
        if(!isPasswordValid) throw new GlobalError(400, responseMessage.INVALID_CREDENTIALS);

        const hashedNewPassword = await PasswordHelpers.hashPassword(newPassword);

        await AuthRepository.updatePassword(userId, hashedNewPassword);
    }

    public static async doForgotPassword(email: string){
        const user: IUser = await AuthRepository.getUserByEmail(email);
        if(!user) throw new GlobalError(400, responseMessage.NOT_FOUND(`User with ${email} `));

        const {resetPasswordToken, resetPasswordTokenExpiresAt} = generateTokens;

        await AuthRepository.updateResetPasswordToken(user.id as string, resetPasswordToken, resetPasswordTokenExpiresAt);
        /// Do the Reset Email Stuff
        emailEmitter.emit('Reset-Password-Email', {
            email: user.email,
            name: user.username,
            resetPasswordToken
        });
    }

    public static async doResetPassword(token: string, newPassword: string){
        const user: IUser = await AuthRepository.getUserByResetPasswordToken(token);
        if(!user) throw new GlobalError(400, responseMessage.NOT_FOUND(`Expired Token or Invalid Token`));

        const hashedNewPassword = await PasswordHelpers.hashPassword(newPassword);

        await AuthRepository.updatePassword(user.id as string, hashedNewPassword);
        await AuthRepository.updateResetPasswordToken(user.id as string, null, null);
    }

    public static async doLogout(userId: string){
        await AuthRepository.updateRefreshToken(userId, null);
    }
}