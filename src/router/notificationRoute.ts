import Validator from '../middlewares/validator';
import {Router} from 'express';
import {Notification} from '../schema/notificationSchema';
import {NotificationController} from '../controller/notificationController';
import {object, string} from 'zod';
import Auth from '../middlewares/authMiddleware';

class NotificationRouter {
    public router: Router = Router();

    constructor() {
        this.router = Router();
        this.run();
    }

    private run(): void {
        this.router.post(
            '/send-notification',
            Auth.authenticate,
            Validator.validateRequest({body: Notification}),
            NotificationController.sendNotification
        );
        this.router.get('/get-notifications', Auth.authenticate, NotificationController.getNotifications);
        this.router.put(
            '/mark-notification-as-read/:id',
            Auth.authenticate,
            Validator.validateRequest({
                params: object({
                    id: string()
                })
            }),
            NotificationController.MarkNotificationAsRead
        );

        this.router.put(
            '/delete-notification/:id',
            Auth.authenticate,
            Validator.validateRequest({
                params: object({
                    id: string()
                })
            }),
            NotificationController.deleteNotification
        );
    }
}
export default new NotificationRouter().router;

