/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import responseMessage from '../constant/responseMessage';
import {AuthService} from '../services/authService';
import {IUser, IUserLogin} from '../types/auth.types';
import httpResponse from '../dto/httpResponse';
import {NextFunction, Request, Response} from 'express';
import asyncHandler from '../utils/asyncHandler';
import logger from '../utils/logger';
import GlobalError from '../utils/HttpsErrors';
import {CookiesHandler} from '../utils/handleCookies';
import config from '../config/config';

export class AuthController {
    /**
     * Sets the access and refresh tokens as cookies on the response object.
     * @param {Response} res - Express response object
     * @param {string} userId - User ID
     * @param {string} access_token - Access token
     * @param {string} refresh_token - Refresh token
     */
    private static setCookies(res: Response, userId: string, access_token: string, refresh_token: string): void {
        logger.info(`Setting cookies for user: ${userId}`);
        CookiesHandler.setAccessTokenCookies(res, userId, access_token);
        CookiesHandler.setRefreshTokenCookies(res, userId, refresh_token);
    }

    /**
     * Clears the access and refresh token cookies.
     * @param {Response} res - Express response object
     */
    private static clearCookies(res: Response): void {
        logger.info('Clearing cookies for user');
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
    }

    /**
     * Handles user registration and sets cookies on successful registration.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} _next - Express next function
     */
    public static register = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        logger.info('User registration attempt');
        const data: IUser = req.body;
        data.profilePic = req.file?.path;

        const result = await AuthService.doUserRegistration(data);
        logger.info(`User registered successfully: ${result.result.id}`);

        // Set cookies and respond with success
        this.setCookies(res, result.result.id as string, result.access_token, result.refresh_token);
        return httpResponse.ok(req, res, 201, responseMessage.SUCCESS, result.result, result.access_token, result.refresh_token);
    });

    /**
     * Handles user login and sets cookies on successful login.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} _next - Express next function
     */
    public static login = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        logger.info('User login attempt');
        const data: IUserLogin = req.body;

        const {access_token, refresh_token, result} = await AuthService.doLogin(data);
        logger.info(`User login successful: ${result.id}`);

        // Set cookies and respond with success
        this.setCookies(res, result.id as string, access_token, refresh_token);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, result, access_token, refresh_token);
    });

    /**
     * Retrieves the logged-in user's profile based on the token.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} _next - Express next function
     */
    public static me = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        if (!req.user) return _next(new GlobalError(404, responseMessage.USER_NOT_FOUND));
        const userId = req.user as string;

        logger.info(`Fetching profile for userID: ${userId}`);
        const result = await AuthService.doGetUserProfile(userId);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, result);
    });

    /**
     * Verifies user email using a token.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} _next - Express next function
     */
    public static verifyEmail = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const {token} = req.body;
        const result = await AuthService.verifyEmail(token as string);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, result);
    });

    /**
     * Refreshes the access token using the provided refresh token.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} _next - Express next function
     */
    public static refreshAccessToken = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const incomingRefreshToken: string = req.cookies?.refresh_token || req.body?.refresh_token;
        if (!incomingRefreshToken) throw new GlobalError(400, responseMessage.NOT_FOUND('Refresh Token'));

        logger.info(`Refreshing token for: ${incomingRefreshToken}`);
        const result = await AuthService.refreshToken(incomingRefreshToken);
        this.setCookies(res, result.userId, result.access_token, result.refresh_token);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, null, result.access_token, result.refresh_token);
    });

    /**
     * Allows a user to change their password.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} _next - Express next function
     */
    public static changePassword = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const userId = req.user as string;
        const {oldPassword, newPassword} = req.body;

        await AuthService.doChangeUserPassword(userId, oldPassword as string, newPassword as string);
        logger.info(`Password changed for user: ${userId}`);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });

    /**
     * Initiates the forgot password process by sending an email.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} _next - Express next function
     */
    public static forgotPassword = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const {email} = req.body;
        await AuthService.doForgotPassword(email as string);
        logger.info(`Forgot password email sent to: ${email}`);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });

    /**
     * Resets a user's password using a token.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} _next - Express next function
     */
    public static resetPassword = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const {token} = req.params;
        const {newPassword} = req.body;

        await AuthService.doResetPassword(token, newPassword as string);
        logger.info(`Password reset successfully for token: ${token}`);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });

    /**
     * Resends the email verification.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} _next - Express next function
     */
    public static resendEmailVerification = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const {email} = req.params;
        await AuthService.doResendEmailVerificationEmail(email);
        logger.info(`Resending verification email to: ${email}`);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });

    /**
     * Resends the forgot password email.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} _next - Express next function
     */
    public static resendForgotPasswordEmail = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const {email} = req.params;
        await AuthService.doForgotPassword(email);
        logger.info(`Resending forgot password email to: ${email}`);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });

    /**
     * Logs the user out and clears authentication cookies.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} _next - Express next function
     */
    public static logOut = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const userId = req.user as string;
        await AuthService.doLogout(userId);
        this.clearCookies(res);
        logger.info(`User logged out: ${userId}`);
        return httpResponse.ok(req, res, 200, responseMessage.USER_LOGGED_OUT);
    });

    public static getOAuthRequestURL = (req: Request, res: Response, _next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', config.FRONTEND_URL);
        res.header('Referrer-Policy', 'no-referrer-when-downgrade');
        res.header('Access-Control-Allow-Credentials', 'true');
        const url = AuthService.dogetOAuthRequestURL();
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, url);
    };

    public static loginWithOAuth = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const {code} = req.query;
        const result = await AuthService.doLoginWithOAuth(code as string);
        this.setCookies(res, result.user.id as string, result.access_token, result.refresh_token);
        logger.info(`User logged in with OAuth: ${result.user.id}`);
        return httpResponse.ok(
            req,
            res,
            200,
            responseMessage.SUCCESS,
            {
                redirectUrl: result.redirectUrl
            },
            result.access_token,
            result.refresh_token
        );
    });
}

