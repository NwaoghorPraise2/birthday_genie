/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import responseMessage from '../constant/responseMessage';
import {AuthService} from '../services/authService';
import {IUser, IUserLogin} from '../types/auth.types';
import httpResponse from '../dto/httpResponse';
import {NextFunction, Request, Response} from 'express';
import asyncHandler from '../utils/asyncHandler';
import logger from '../utils/logger';
import GlobalError from '../utils/HttpsErrors';
import {CookiesHandler} from '../utils/handleCookies';

export class AuthController {
    private static setCookies(res: Response, userId: string, access_token: string, refresh_token: string): void {
        CookiesHandler.setAccessTokenCookies(res, userId, access_token);
        CookiesHandler.setRefreshTokenCookies(res, userId, refresh_token);
    }

    private static clearCookies(res: Response) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
    }

    public static register = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const data: IUser = req.body;
        //Add defualt profile pic if there no one in the request.
        // if(!req.file) data.profilePic = 'uploads/default.png'
        data.profilePic = req.file?.path;
        const result = await AuthService.doUserRegistration(data);

        this.setCookies(res, result.result.id as string, result.access_token, result.refresh_token);

        return httpResponse.ok(req, res, 201, responseMessage.SUCCESS, result.result, result.access_token, result.refresh_token);
    });

    public static login = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const data: IUserLogin = req.body;
        const {access_token, refresh_token, result} = await AuthService.doLogin(data);
        this.setCookies(res, result.id as string, access_token, refresh_token);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, result, access_token, refresh_token);
    });

    public static me = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        if (!req.user) return _next(new GlobalError(404, responseMessage.USER_NOT_FOUND));
        const userId = req.user as string;
        logger.info(`This is the userID: ${userId}`);
        const result = await AuthService.doGetUserProfile(userId);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, result);
    });

    public static verifyEmail = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const {token} = req.body;
        const result = await AuthService.verifyEmail(token as string);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, result);
    });

    public static refreshAccessToken = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const incomingRefreshToken: string = req.cookies?.refresh_token || req.body?.refresh_token;
        if (!incomingRefreshToken) throw new GlobalError(400, responseMessage.NOT_FOUND(`Refresh Token`));
        logger.info(`Refresh: ${incomingRefreshToken}`);
        const result = await AuthService.refreshToken(incomingRefreshToken);
        this.setCookies(res, result.userId, result.access_token, result.refresh_token);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, null, result.access_token, result.refresh_token);
    });

    public static changePassword = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const userId = req.user as string;
        const {oldPassword, newPassword} = req.body;
        await AuthService.doChangeUserPassword(userId, oldPassword as string, newPassword as string);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });

    public static forgotPassword = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const {email} = req.body;
        await AuthService.doForgotPassword(email as string);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });

    public static resetPassword = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const {token} = req.params;
        const {newPassword} = req.body;
        await AuthService.doResetPassword(token, newPassword as string);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });

    public static resendEmailVerification = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const {email} = req.params;
        await AuthService.doResendEmailVerificationEmail(email);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });

    public static resendForgotPasswordEmail = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const {email} = req.params;
        await AuthService.doForgotPassword(email);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });

    public static logOut = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const userId = req.user as string;
        await AuthService.doLogout(userId);
        this.clearCookies(res);
        return httpResponse.ok(req, res, 200, responseMessage.USER_LOGGED_OUT);
    });
}

