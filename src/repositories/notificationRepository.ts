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

    public static async markNotificationAsRead(notificationId: string) {
        return await db.notifications.update({
            where: {
                id: notificationId
            },
            data: {
                isRead: true
            }
        });
    }

    public static async deleteNotification(notificationId: string) {
        return await db.notifications.update({
            where: {
                id: notificationId
            },
            data: {
                isDeleted: true
            }
        });
    }
}

