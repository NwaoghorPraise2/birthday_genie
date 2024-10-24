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
}

