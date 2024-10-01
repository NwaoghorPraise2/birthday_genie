import { Router } from 'express';
import { AuthController } from '../controller/authController';

/**
 * AppRouter Class - Manages and defines the routes for the application.
 * 
 * - Initializes an Express Router instance to handle HTTP routes.
 * - Associates specific routes with controller methods to separate concerns between routing and business logic.
 * - Exports the router instance directly for use in the application.
 * 
 * Key Considerations:
 * - Scalability: The current setup allows easy expansion of routes by adding more methods in the class.
 * - Separation of Concerns: Routing logic is kept separate from the controller logic, following the single responsibility principle.
 */
class AuthRouter {
    public router: Router;

    constructor() {
        this.router = Router(); 
        this.test();
    }
    public test(): void {
        this.router.post('/register', AuthController.register);
    }
}

// Export the router instance directly
export default new AuthRouter().router;