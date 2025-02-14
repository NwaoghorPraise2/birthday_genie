/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import MessageService from '../services/messageService';
import {Request, Response, NextFunction} from 'express';
import asyncHandler from '../utils/asyncHandler';
import httpResponse from '../dto/httpResponse';

export default class MessageController {
    public static generateMessage = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const {prompt} = req.body;
        const message = await MessageService.generateMessage(prompt as string);
        return httpResponse.ok(req, res, 200, 'Message generated successfully', message);
    });
}

