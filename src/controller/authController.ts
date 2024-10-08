/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import responseMessage from '../constant/responseMessage';
import { AuthService } from '../services/authService';
import { IUser } from '../types/auth.types';
import httpResponse from '../utils/httpResponse';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';

export class AuthController {
    public static register = asyncHandler.handle( async(req: Request, res:Response, _next:NextFunction): Promise<void> =>{
        const data: IUser= req.body;
        data.profilePic = req.file?.path;
        const result = await AuthService.doUserRegistration(data)
        return httpResponse.ok(req, res, 201, responseMessage.SUCCESS, result)
    })
} 

