/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {IUser} from '../types/auth.types';
import responseMessage from '../constant/responseMessage';
import httpResponse from '../dto/httpResponse';
import UseService from '../services/userService';
import asyncHandler from '../utils/asyncHandler';
import {Request, Response, NextFunction} from 'express';

export class UserController {
    public static getAllUsers = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const data = await UseService.doGetAllUsers();
        httpResponse.ok(req, res, 200, responseMessage.SUCCESS, data);
    });

    public static updateProficPic = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user as string;
        const data: IUser = req.body;
        data.profilePic = req.file?.path;
        if (!userId) return _next(new Error(responseMessage.NOT_FOUND('User')));
        const user = await UseService.doUpdateProfilePic(userId, data.profilePic as string);
        httpResponse.ok(req, res, 200, responseMessage.SUCCESS, user);
    });

    public static updateUserProfile = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user as string;
        const data: IUser = req.body;
        data.profilePic = req.file?.path;
        if (!userId) return _next(new Error(responseMessage.NOT_FOUND('User')));
        await UseService.doUpdateUserProfile(userId, data);
        httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });
}

