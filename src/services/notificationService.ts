import NotificationRepository from '../repositories/notificationRepository';
import {INotification} from '../types/notifications.types';
import logger from '../utils/logger';
import SocketService from '../utils/socketUtils';

export default class NotificationService {
    private socketService: SocketService;

    constructor(socketService: SocketService) {
        this.socketService = socketService;
    }

    public async sendNotification(userId: string, notification: INotification) {
        await NotificationRepository.createNotification(notification, userId);
        this.socketService.emit('notification', userId, notification);
        logger.info(`Notification sent to user ${userId}: ${notification.message}`);
    }
}

