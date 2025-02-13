import {Request, Response, NextFunction} from 'express';
import responseMessage from '../constant/responseMessage';
import NotificationService from '../services/notificationService';
import asyncHandler from '../utils/asyncHandler';
import httpResponse from '../dto/httpResponse';
import GlobalError from '../utils/HttpsErrors';
import {INotification} from '../types/notifications.types';
export class NotificationController {
    private static notificationService = new NotificationService();

    public static sendNotification = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user;
        const notification = req.body as INotification;
        if (!userId) return _next(new GlobalError(400, responseMessage.NOT_FOUND('User')));
        await this.notificationService.doSendNotification(userId as string, notification);
        return httpResponse.ok(req, res, 201, responseMessage.SUCCESS);
    });

    public static getNotifications = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user;
        if (!userId) return _next(new GlobalError(400, responseMessage.NOT_FOUND('User')));
        const notifications = await this.notificationService.doGetNotifications(userId as string);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, notifications);
    });

    public static MarkNotificationAsRead = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user;
        const notificationId = req.params.id;
        if (!userId) return _next(new GlobalError(400, responseMessage.NOT_FOUND('User')));
        const notification = await this.notificationService.doMarkNotificationAsRead(notificationId);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS, notification);
    });

    public static deleteNotification = asyncHandler.handle(async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user;
        const notificationId = req.params.id;
        if (!userId) return _next(new GlobalError(400, responseMessage.NOT_FOUND('User')));
        await this.notificationService.doDeleteNotification(notificationId);
        return httpResponse.ok(req, res, 200, responseMessage.SUCCESS);
    });
}

