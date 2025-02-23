import {Request, Response, NextFunction} from 'express';
import CalenderService from '../services/calenderServices';
import responseMessage from '../constant/responseMessage';
import asyncHandler from '../utils/asyncHandler';
import GlobalError from '../utils/HttpsErrors';

export default class CalenderController {
    public static subscribeToCalender = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const {userId} = req.params;
        if (!userId) return _next(new GlobalError(400, responseMessage.NOT_FOUND('User')));
        const icsData = await CalenderService.doSubscribeToCalender(userId);
        res.setHeader('Content-Type', 'text/calendar');
        res.send(icsData);
    });
}

