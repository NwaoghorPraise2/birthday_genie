import { UserController } from '../controller/userController';
import {Router} from 'express';

class UserRouter {
    public router: Router;

    constructor(){
        this.router = Router();
        this.run();
    }

    private run() {
        this.router.get('/users', UserController.getAllUsers);
    }
}

export default new UserRouter().router;
