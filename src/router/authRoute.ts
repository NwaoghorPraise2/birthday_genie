import { Router } from 'express';
import { AuthController } from '../controller/authController';
import Validator from '../middlewares/validator';
import { User, UserLogin } from '../utils/validation/validate';
import { singleUpload } from '../utils/filehandler/fileUpload';
import Auth  from '../middlewares/authMiddleware';

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
     *     summary: Registers a new user account.
     *     description: |
     *       This endpoint allows users to register a new account by providing required details such as `username`, `email`, and `password`. 
     *       Optionally, users can upload a profile picture and provide other information like their name and phone number. 
     *       The registration process also supports unique email and username validations.
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - email
     *               - password
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: Optional profile picture for the user.
     *               username:
     *                 type: string
     *                 description: Unique username for the user.
     *                 example: johndoe123
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Unique email address of the user.
     *                 example: johndoe@example.com
     *               password:
     *                 type: string
     *                 format: password
     *                 description: Secure password for the user account.
     *                 example: Passw0rd!
     *               name:
     *                 type: string
     *                 description: Full name of the user.
     *                 example: John Doe
     *               phoneNumber:
     *                 type: string
     *                 description: Optional phone number for the user.
     *                 example: +1234567890
     *     responses:
     *       201:
     *         description: User successfully registered.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates whether the registration was successful.
     *                   example: true
     *                 message:
     *                   type: string
     *                   description: Success message.
     *                   example: "User successfully registered."
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *       400:
     *         description: Validation error.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates if the registration failed due to validation issues.
     *                   example: false
     *                 message:
     *                   type: string
     *                   description: Error message describing the validation issue.
     *                   example: "Email is already in use."
     *       500:
     *         description: Internal server error.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates whether the request was processed successfully.
     *                   example: false
     *                 message:
     *                   type: string
     *                   description: Error message detailing the internal server error.
     *                   example: "An unexpected error occurred."
     *     security:
     *       - bearerAuth: []
     *     components:
     *       schemas:
     *         User:
     *           type: object
     *           properties:
     *             id:
     *               type: string
     *               description: The unique identifier of the user.
     *               example: "cklv44gk00b8ph9fl0j5f1e5s"
     *             username:
     *               type: string
     *               description: The username of the user.
     *               example: johndoe123
     *             email:
     *               type: string
     *               format: email
     *               description: The email address of the user.
     *               example: johndoe@example.com
     *             phoneNumber:
     *               type: string
     *               description: The phone number of the user.
     *               example: +1234567890
     *             profilePic:
     *               type: string
     *               description: URL of the user's profile picture.
     *               example: "https://example.com/profile/johndoe123.jpg"
     *             createdAt:
     *               type: string
     *               format: date-time
     *               description: The date and time when the user was created.
     *               example: "2024-10-05T12:34:56.789Z"
     *             updatedAt:
     *               type: string
     *               format: date-time
     *               description: The date and time when the user was last updated.
     *               example: "2024-10-05T12:34:56.789Z"
     */
    public run(): void {
        this.router.post('/register', 
            singleUpload, 
            Validator.validateRequest({
                body: User
            }), 
            AuthController.register
        );

        this.router.post('/verify-email', AuthController.verifyEmail);

        this.router.post('/login', Validator.validateRequest({
            body: UserLogin
        }), 
        AuthController.login);

        this.router.get('/me', Auth.authenticate, AuthController.me);

        this.router.post('/logout', AuthController.logOut)
    }
}

// Export the router instance directly
export default new AuthRouter().router;
