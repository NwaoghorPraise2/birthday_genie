import db from '../config/db';
import {INotification} from '../types/notifications.types';
import {IUser} from '../types/auth.types';

class NotificationRepository {
    public static async createNotification(notification: INotification, userId: string) {}

    public static async getNotificationsByUserId() {}
}

