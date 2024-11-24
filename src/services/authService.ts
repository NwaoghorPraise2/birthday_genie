/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import GlobalError from '../utils/HttpsErrors';
import {AuthRepository} from '../repositories/authRepository';
import responseMessage from '../constant/responseMessage';
import JWTService from '../utils/jwt';
import emailEmitter from '../utils/mail/emitter';
import generateTokens from '../utils/tokenGenerator';
import {DecodedToken, GoogleUserData, IUser, IUserLogin} from '../types/auth.types';
import logger from '../utils/logger';
import HashingService from '../utils/hash';
import config from '../config/config';

export class AuthService {
    private static JWTService = JWTService.getInstance();

    private static async generateAcccesAndRefreshToken(payload: {id: string}): Promise<{access_token: string; refresh_token: string}> {
        const userId = payload.id;
        const access_token: string = this.JWTService.signAccessToken(payload);
        const refresh_token: string = this.JWTService.signRefreshToken(payload);
        const hashRefreshToken = await HashingService.doHashing(refresh_token);
        await AuthRepository.updateRefreshToken(userId, hashRefreshToken);
        return {access_token, refresh_token};
    }

    private static async getOAuthUserData(access_token: string) {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
        const data = await response.json();
        return data;
    }

    public static async doUserRegistration(user: IUser) {
        const isUserExists: unknown = await AuthRepository.getUserByEmailOrUsername(user.email, user.username);
        if (isUserExists) throw new GlobalError(409, responseMessage.USER_ALREADY_EXISTS);

        const hashedPassword = await HashingService.doHashing(user.password);

        const {verificationToken, verificationTokenExpiresAt} = generateTokens;

        const result = (await AuthRepository.createUser({...user, password: hashedPassword, verificationToken, verificationTokenExpiresAt})) as IUser;

        if (!result) throw new GlobalError(500, responseMessage.SOMETHING_WENT_WRONG);

        const payload = {id: result.id as string};

        const {access_token, refresh_token} = await this.generateAcccesAndRefreshToken(payload);

        emailEmitter.emit('Verification-Email', {
            email: result?.email,
            name: result?.username,
            verificationToken: result?.verificationToken
        });

        return {access_token, refresh_token, result};
    }

    public static async doLogin(user: IUserLogin) {
        const User = await AuthRepository.getUserByEmail(user.email);
        if (!User) throw new GlobalError(400, responseMessage.NOT_FOUND(`User with ${user.email} `));
        const isPasswordValid: boolean = await HashingService.verifyHashEntity(user.password, User.password as string);
        if (!isPasswordValid) throw new GlobalError(400, responseMessage.INVALID_CREDENTIALS);
        const payload = {id: User.id};
        const {access_token, refresh_token} = await this.generateAcccesAndRefreshToken(payload);
        const result: IUser = AuthRepository.userWithoutPassword(User);
        return {access_token, refresh_token, result};
    }

    public static async doGetUserProfile(id: string) {
        const User: IUser = await AuthRepository.getUserById(id);
        if (!User) throw new GlobalError(400, responseMessage.NOT_FOUND(`User with ${id} `));
        return User;
    }

    public static async verifyEmail(token: string) {
        const user = (await AuthRepository.getUserByVerificationToken(token)) as IUser;

        if (!user) throw new GlobalError(400, responseMessage.NOT_FOUND(`Expired Token or Verification Token`));

        if (user.isVerified === true) throw new GlobalError(400, responseMessage.ALREADY_VERIFIED);

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await AuthRepository.verifyUser(user.id as string, user.isVerified, user.verificationToken, user.verificationTokenExpiresAt);

        emailEmitter.emit('Welcome-Email', {
            email: user.email,
            name: user.username
        });

        return user;
    }

    public static async refreshToken(refreshToken: string) {
        if (!refreshToken) throw new GlobalError(400, responseMessage.NOT_FOUND(`Refresh Token`));

        const decodedToken: DecodedToken = this.JWTService.verifyRefreshToken(refreshToken);
        logger.info(`decodedToken: ${decodedToken.id}`);
        if (!decodedToken) throw new GlobalError(401, responseMessage.INVALID_TOKEN);

        const user = await AuthRepository.getUserByIdWithRefreshToken(decodedToken.id);
        if (!user) throw new GlobalError(400, responseMessage.NOT_FOUND(`User with ${refreshToken} `));

        const isRefreshTokenValid = await HashingService.verifyHashEntity(refreshToken, user.refreshToken as string);

        if (!isRefreshTokenValid) throw new GlobalError(401, responseMessage.INVALID_TOKEN);

        const payload = {id: user.id};

        const {access_token, refresh_token} = await this.generateAcccesAndRefreshToken(payload);

        return {access_token, refresh_token, userId: payload.id};
    }

    public static async doChangeUserPassword(userId: string, oldPassword: string, newPassword: string) {
        const user = (await AuthRepository.getUserByIdWithPassword(userId)) as IUser;

        const isPasswordValid: boolean = await HashingService.verifyHashEntity(oldPassword, user.password);
        if (!isPasswordValid) throw new GlobalError(400, responseMessage.INVALID_CREDENTIALS);

        const hashedNewPassword = await HashingService.doHashing(newPassword);

        await AuthRepository.updatePassword(userId, hashedNewPassword);
    }

    public static async doForgotPassword(email: string) {
        const user = (await AuthRepository.getUserByEmail(email)) as IUser;
        if (!user) throw new GlobalError(400, responseMessage.NOT_FOUND(`User with ${email} `));

        const {resetPasswordToken, resetPasswordTokenExpiresAt} = generateTokens;

        await AuthRepository.updateResetPasswordToken(user.id as string, resetPasswordToken, resetPasswordTokenExpiresAt);

        emailEmitter.emit('Reset-Password-Email', {
            email: user.email,
            name: user.username,
            resetPasswordToken
        });
    }

    public static async doResetPassword(token: string, newPassword: string) {
        const user: IUser = (await AuthRepository.getUserByResetPasswordToken(token)) as IUser;
        if (!user) throw new GlobalError(400, responseMessage.NOT_FOUND(`Expired Token or Invalid Token`));

        const hashedNewPassword = await HashingService.doHashing(newPassword);

        await AuthRepository.updatePassword(user.id as string, hashedNewPassword);
        await AuthRepository.updateResetPasswordToken(user.id as string, null, null);

        emailEmitter.emit('Reset-Password-Success-Email', {
            email: user.email,
            name: user.username
        });
    }

    public static async doResendEmailVerificationEmail(email: string) {
        const user = await AuthRepository.getUserByEmail(email);
        if (!user) throw new GlobalError(400, responseMessage.NOT_FOUND(`User with ${email} `));

        if (user.isVerified === true) throw new GlobalError(400, responseMessage.ALREADY_VERIFIED);

        const {verificationToken, verificationTokenExpiresAt} = generateTokens;

        await AuthRepository.updateVerificationToken(user.id, verificationToken, verificationTokenExpiresAt);

        emailEmitter.emit('Verification-Email', {
            email: user.email,
            name: user.username,
            verificationToken
        });
    }

    public static dogetOAuthRequestURL() {
        const oauthClient = AuthService.JWTService.getOAuthClient();
        const authorizationUrl = oauthClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['openid', 'email', 'profile'],
            prompt: 'consent'
        });
        if (!authorizationUrl) throw new GlobalError(500, responseMessage.SOMETHING_WENT_WRONG);
        logger.info(`authorizationUrl: ${authorizationUrl}`);
        return authorizationUrl;
    }

    public static async doLoginWithOAuth(code: string) {
        const oauthClient = AuthService.JWTService.getOAuthClient();
        const {tokens} = await oauthClient.getToken(code);
        if (!tokens) throw new GlobalError(404, responseMessage.NOT_FOUND('Tokens'));
        oauthClient.setCredentials(tokens);
        const result = oauthClient.credentials;
        const userData = (await this.getOAuthUserData(result.access_token as string)) as GoogleUserData;
        logger.info(`userData: ${JSON.stringify(userData)}`);
        if (!userData) throw new GlobalError(404, responseMessage.NOT_FOUND('User Data'));
        const user = await AuthRepository.upSertUser(
            userData.email,
            `${userData.family_name} ${userData.given_name}`,
            userData.sub,
            userData.email_verified,
            userData.name,
            userData.picture
        );
        const payload = {id: user.id};
        const redirectUrl = config.ClIENT_URL;
        const {access_token, refresh_token} = await this.generateAcccesAndRefreshToken(payload);
        return {access_token, refresh_token, user, redirectUrl};
    }

    public static async doLogout(userId: string) {
        await AuthRepository.updateRefreshToken(userId, null);
    }
}

