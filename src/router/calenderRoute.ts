import {Router} from 'express';
import CalanederComtroller from '../controller/calenderController';
import Validator from '../middlewares/validator';
import {object, string} from 'zod';

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
                params: object({
                    userId: string()
                })
            }),
            CalanederComtroller.subscribeToCalender
        );
    }
}
export default new CalenderRouter().router;

