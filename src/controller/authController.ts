/* eslint-disable @typescript-eslint/no-unused-vars */
import responseMessage from '../constant/responseMessage';
import { AuthService } from '../services/authService';
import { IUser } from '../types/auth.types';
import httpResponse from '../utils/httpResponse';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';

export class AuthController {
    public static register = asyncHandler.handle( async(req: Request, res:Response, next:NextFunction) =>{
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data: IUser= req.body;
        const result = await AuthService.doUserRegistration(data)
        return httpResponse.ok(req, res, 201, responseMessage.SUCCESS, result);
    })
} 

