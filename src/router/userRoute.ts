import {Router} from 'express';

class UserRouter {
    public router: Router;

    constructor(){
        this.router = Router();
        this.run();
    }

    private run() {
        this.router.get('/', (req, res) => {
            res.send('Hello World');
        });
    }
}

export default new UserRouter().router;
