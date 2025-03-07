import {Request, Response, NextFunction} from 'express';
import CalenderService from '../services/calenderServices';
import responseMessage from '../constant/responseMessage';
import asyncHandler from '../utils/asyncHandler';
import GlobalError from '../utils/HttpsErrors';
import logger from '../utils/logger';

export default class CalenderController {
    public static subscribeToCalender = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const {userId} = req.params;

        logger.info('User ID:', {userId});

        if (!userId) return _next(new GlobalError(400, responseMessage.NOT_FOUND('User')));
        const icsData = await CalenderService.doSubscribeToCalendar(userId);
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', 'inline; filename="birthday_calendar.ics"');
        res.status(200).send(icsData);
    });
}

