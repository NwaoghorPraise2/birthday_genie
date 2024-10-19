import {Router} from 'express';

class FriendsRouter {
    public router: Router = Router();

    constructor() {
        this.router = Router();
        this.run();
    }

    private run(): void {
        
    }
}
export default new FriendsRouter().router;