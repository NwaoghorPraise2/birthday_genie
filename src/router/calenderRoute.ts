import {Router} from 'express';
import CalenderController from '../controller/calenderController';
import Validator from '../middlewares/validator';
import z from 'zod';

class CalenderRouter {
    public router: Router = Router();

    constructor() {
        this.router = Router();
        this.run();
    }

    private run(): void {
        this.router.get(
            '/subcribe-to-calender/:userId',
            Validator.validateRequest({
                params: z.object({
                    userId: z.string({
                        required_error: 'User ID is required'
                    })
                })
            }),
            CalenderController.subscribeToCalender
        );
    }
}
export default new CalenderRouter().router;

