import db from '../config/db';
import {INotification} from '../types/notifications.types';

export default class NotificationRepository {
    public static async createNotification(notification: INotification, userId: string) {
        return await db.notifications.create({
            data: {
                ...notification,
                userId
            }
        });
    }

    public static async getNotificationsByUserId(userId: string) {
        return await db.notifications.findMany({
            where: {
                userId
            }
        });
    }
}

