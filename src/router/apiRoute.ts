import {Router} from 'express';
import apiController from '../controller/apiController';
import authRoutes from './authRoute';
import userRoutes from './userRoute';
import friendsRoute from './friendsRoute';
import notificationRoute from './notificationRoute';
import messageRoute from './messageRoute';
import Auth from '../middlewares/authMiddleware';

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
        this.router = Router();
        this.test();
    }

    public test(): void {
        /**
         * @swagger
         * /api/test:
         *   get:
         *     summary: Returns a test message to verify the application is running.
         *     tags:
         *       - Test Routes
         *     responses:
         *       200:
         *         description: Successfully returns a test message.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Test successful!"
         */
        this.router.get('/test', apiController.test);

        /**
         * @swagger
         * /api/health:
         *   get:
         *     summary: Returns the health status of the application.
         *     tags:
         *       - Health Routes
         *     responses:
         *       200:
         *         description: Successfully returns the application's health status.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 status:
         *                   type: string
         *                   example: "Healthy"
         */
        this.router.get('/health', apiController.health);

        this.router.get('/client', Auth.authenticate, apiController.getClient);

        // Auth routes are separated in another module
        this.router.use('/auth', authRoutes);
        this.router.use('/user', userRoutes);
        this.router.use('/friends', friendsRoute);
        this.router.use('/notifications', notificationRoute);
        this.router.use('/messages', messageRoute);
    }
}

// Export the router instance directly
export default new AppRouter().router;

