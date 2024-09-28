import { Router } from 'express';
import apiController from '../controller/apiController';

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
class AppRouter {
    public router: Router;

    constructor() {
        this.router = Router(); // Initializes a new Router instance
        this.test(); // Defines the /test route during initialization
    }

    /**
     * Defines the /test route and assigns it to the test method in apiController.
     * 
     * - HTTP GET /test
     * - The route is linked to the test method in the apiController.
     */
    public test(): void {
        this.router.get('/test', apiController.test);
        this.router.get('/health', apiController.health);
    }
}

// Export the router instance directly
export default new AppRouter().router;