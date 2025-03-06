import {Router} from 'express';
import CalanederComtroller from '../controller/calenderController';
import Auth from '../middlewares/authMiddleware';

class CalenderRouter {
    public router: Router = Router();

    constructor() {
        this.router = Router();
        this.run();
    }

    private run(): void {
        this.router.get('/subcribe-to-calender', Auth.authenticate, CalanederComtroller.subscribeToCalender);
    }
}
export default new CalenderRouter().router;

