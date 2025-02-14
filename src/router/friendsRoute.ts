import Validator from '../middlewares/validator';
import {Router} from 'express';
import {Friend} from '../schema/friendSchema';
import {FriendController} from '../controller/friendsController';
import {string, object} from 'zod';
import Auth from '../middlewares/authMiddleware';

class FriendsRouter {
    public router: Router = Router();

    constructor() {
        this.router = Router();
        this.run();
    }

    private run(): void {
        this.router.post('/add-friend', Auth.authenticate, Validator.validateRequest({body: Friend}), FriendController.createFriend);
        this.router.get('/get-friends', Auth.authenticate, FriendController.getFriends);
        this.router.put(
            '/update-friend/:id',
            Auth.authenticate,
            Validator.validateRequest({
                body: Friend,
                params: object({
                    id: string()
                })
            }),
            FriendController.updateFriend
        );
        this.router.get(
            '/get-friend/:id',
            Auth.authenticate,
            Validator.validateRequest({
                params: object({
                    id: string()
                })
            }),
            FriendController.getFriend
        );

        this.router.put(
            '/delete-friend/:id',
            Auth.authenticate,
            Validator.validateRequest({
                params: object({
                    id: string()
                })
            }),
            FriendController.deleteFriend
        );
    }
}
export default new FriendsRouter().router;

