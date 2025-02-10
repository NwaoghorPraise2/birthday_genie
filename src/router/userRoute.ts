import {UserController} from '../controller/userController';
import {Router} from 'express';
import {singleUpload} from '../lib/filehandler/fileUpload';
import Validator from '../middlewares/validator';
import {UpdateProfile} from '../schema/userSchema';

class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.run();
    }

    private run() {
        this.router.get('/users', UserController.getAllUsers);
        this.router.put('/update-profile-pic', singleUpload, UserController.updateProficPic);
        this.router.put(
            '/update-profile',
            Validator.validateRequest({
                body: UpdateProfile
            }),
            singleUpload,
            UserController.updateUserProfile
        );
        this.router.get('/profile', UserController.getUserProfile);
    }
}

export default new UserRouter().router;

