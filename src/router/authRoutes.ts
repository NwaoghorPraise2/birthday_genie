import { Router } from 'express';
import { AuthController } from '../controller/authController';
import Validator from '../middlewares/validator';
import { User } from '../utils/validation/validate';
import { singleUpload } from '../utils/filehandler/fileUpload';

/**
 * AuthRouter Class - Manages and defines the authentication routes for the application.
 * 
 * - Initializes an Express Router instance to handle authentication-related routes.
 * - Associates specific routes with controller methods to separate concerns between routing and business logic.
 * - Exports the router instance directly for use in the application.
 * 
 * Key Considerations:
 * - Scalability: The current setup allows easy expansion of authentication routes.
 * - Separation of Concerns: Routing logic is kept separate from the controller logic, following the single responsibility principle.
 */
class AuthRouter {
    public router: Router;

    constructor() {
        this.router = Router(); 
        this.run();
    }

    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Registers a new user.
     *     consumes:
     *       - multipart/form-data
     *     requestBody:
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: The user's profile picture.
     *               user:
     *                 $ref: '#/components/schemas/User'
     *     responses:
     *       201:
     *         description: User successfully registered.
     *       400:
     *         description: Validation error.
     */
    public run(): void {
        this.router.post('/register', 
            singleUpload, 
            Validator.validateRequest({
                body: User
            }), 
            AuthController.register
        );
    }
}

// Export the router instance directly
export default new AuthRouter().router;
