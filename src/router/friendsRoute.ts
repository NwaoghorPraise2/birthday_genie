import Validator from '../middlewares/validator';
import {Router} from 'express';
import {Friend} from '../schema/friendSchema';
import {FriendController} from '../controller/friendsController';
import {string, object} from 'zod';

class FriendsRouter {
    public router: Router = Router();

    constructor() {
        this.router = Router();
        this.run();
    }

    private run(): void {
        this.router.post('add-friend', Validator.validateRequest({body: Friend}), FriendController.createFriend);
        this.router.get('get-friends', FriendController.getFriends);
        this.router.put(
            'update-friend/:id',
            Validator.validateRequest({
                body: Friend,
                params: object({
                    id: string()
                })
            }),
            FriendController.updateFriend
        );
        this.router.get(
            'get-friend/:id',
            Validator.validateRequest({
                params: object({
                    id: string()
                })
            }),
            FriendController.getFriend
        );

        this.router.put(
            'delete-friend/:id',
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

