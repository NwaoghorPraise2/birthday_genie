import {Router} from 'express';
import {AuthController} from '../controller/authController';
class OAuthRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.run();
    }

    private run() {
        this.router.get('/oauth', AuthController.loginWithOAuth);
    }
}

export default new OAuthRouter().router;

