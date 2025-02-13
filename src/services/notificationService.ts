import NotificationRepository from '../repositories/notificationRepository';
import {INotification} from '../types/notifications.types';
import logger from '../utils/logger';
import SocketService from '../utils/socketUtils';

export default class NotificationService {
    private socketService: SocketService;

    constructor(socketService?: SocketService) {
        this.socketService = socketService as SocketService;
    }

    public async doSendNotification(userId: string, notification: INotification) {
        await NotificationRepository.createNotification(notification, userId);
        this.socketService.emit('notification', userId, notification);
        logger.info(`Notification sent to user ${userId}: ${notification.message}`);
    }

    public async doGetNotifications(userId: string) {
        const notifications = await NotificationRepository.getNotificationsByUserId(userId);
        logger.info(`Notifications retrieved for user ${userId}`);
        return notifications;
    }

    public async doMarkNotificationAsRead(notificationId: string) {
        await NotificationRepository.markNotificationAsRead(notificationId);
        logger.info(`Notification ${notificationId} marked as read`);
    }

    public async doDeleteNotification(notificationId: string) {
        await NotificationRepository.deleteNotification(notificationId);
        logger.info(`Notification ${notificationId} deleted`);
    }
}

