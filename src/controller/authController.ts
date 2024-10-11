/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import responseMessage from '../constant/responseMessage';
import { AuthService } from '../services/authService';
import { IUser, IUserLogin } from '../types/auth.types';
import httpResponse from '../dto/httpResponse';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import logger from '../utils/logger';
import GlobalError from '../utils/HttpsErrors';

export class AuthController {
    public static register = asyncHandler.handle( async(req: Request, res:Response, _next:NextFunction): Promise<void> =>{
        const data: IUser= req.body;
        //Add defualt profile pic if there no one in the request.
        // if(!req.file) data.profilePic = 'uploads/default.png'
        data.profilePic = req.file?.path;
        const result = await AuthService.doUserRegistration(data)
        return httpResponse.ok(req, res, 201, responseMessage.SUCCESS, result)
    })

    public static login = asyncHandler.handle( async(req: Request, res:Response, _next:NextFunction): Promise<void> =>{
        const data: IUserLogin = req.body;
        const { access_token, refresh_token, result} = await AuthService.doLogin(data)
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, result, access_token, refresh_token)
    })

    public static me = asyncHandler.handle( async(req: Request, res:Response, _next:NextFunction): Promise<void> => {
        if(!req.user) return _next( new GlobalError(404, responseMessage.USER_NOT_FOUND))

        const userId: string = typeof req.user === 'string' ? req.user : req.user.id;
            logger.info(`This is the userID: ${userId}`);
        const result = await AuthService.doGetUserProfile(userId)
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, result)
    })
} 

