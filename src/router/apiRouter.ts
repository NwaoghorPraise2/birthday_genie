import { Router } from 'express';
import apiController from '../controller/apiController';

class AppRouter {
    public router: Router;

    constructor() {
        this.router = Router(); // Initializes a new Router instance
        this.test(); // Call to the method to define the routes
    }

    // Method to define the /test route
    public test(): void {
        this.router.get('/test', apiController.test);
    }
}

// Export the router instance directly
export default new AppRouter().router;
