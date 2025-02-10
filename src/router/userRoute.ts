import {UserController} from '../controller/userController';
import {Router} from 'express';
import {singleUpload} from '../lib/filehandler/fileUpload';
import Validator from '../middlewares/validator';
import {UpdateProfile} from '../schema/userSchema';
import Auth from '../middlewares/authMiddleware';

class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.run();
    }

    private run() {
        this.router.get('/users', UserController.getAllUsers);
        this.router.put('/update-profile-pic', Auth.authenticate, singleUpload, UserController.updateProficPic);
        this.router.put(
            '/update-profile',
            Auth.authenticate,
            Validator.validateRequest({
                body: UpdateProfile
            }),
            singleUpload,
            UserController.updateUserProfile
        );
        this.router.get('/profile', Auth.authenticate, UserController.getUserProfile);
    }
}

export default new UserRouter().router;

