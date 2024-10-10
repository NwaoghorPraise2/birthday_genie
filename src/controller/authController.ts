/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import responseMessage from '../constant/responseMessage';
import { AuthService } from '../services/authService';
import { IUser, IUserLogin } from '../types/auth.types';
import httpResponse from '../utils/httpResponse';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';

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
        const { token, result} = await AuthService.doLogin(data)
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, result, token)
    })
} 

