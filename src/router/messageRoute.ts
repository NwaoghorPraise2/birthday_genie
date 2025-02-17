import {Router} from 'express';
import MessageController from '../controller/messageController';

class MessageRouter {
    public router: Router = Router();

    constructor() {
        this.router = Router();
        this.run();
    }

    private run(): void {
        this.router.post('/generate-message', MessageController.generateMessage);
    }
}
export default new MessageRouter().router;

