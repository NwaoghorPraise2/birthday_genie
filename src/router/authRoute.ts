import {Router} from 'express';
import {AuthController} from '../controller/authController';
import Validator from '../middlewares/validator';
import {ForgotPassword, Password, ResetPassword, token, User, UserLogin} from '../schema/userSchema';
import {singleUpload} from '../lib/filehandler/fileUpload';
import Auth from '../middlewares/authMiddleware';

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

    /**
     * @swagger
     * /api/auth/verify-email:
     *   post:
     *     summary: Verify a user's email.
     *     description: |
     *       This endpoint allows users to verify their email address after registration using a verification token.
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               token:
     *                 type: string
     *                 description: The verification token sent to the user's email.
     *                 example: "verification_token_here"
     *     responses:
     *       200:
     *         description: Email verified successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates whether the verification was successful.
     *                   example: true
     *                 message:
     *                   type: string
     *                   description: Success message.
     *                   example: "Email successfully verified."
     *       400:
     *         description: Invalid token or already verified email.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates failure due to invalid token.
     *                   example: false
     *                 message:
     *                   type: string
     *                   description: Error message.
     *                   example: "Invalid verification token."
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
     */

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Log in a user.
     *     description: |
     *       This endpoint allows users to log in by providing their email and password.
     *       On successful login, a JWT token is returned for future authenticated requests.
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 description: User's email address.
     *                 example: johndoe@example.com
     *               password:
     *                 type: string
     *                 format: password
     *                 description: User's password.
     *                 example: Passw0rd!
     *     responses:
     *       200:
     *         description: User successfully logged in.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates whether the login was successful.
     *                   example: true
     *                 token:
     *                   type: string
     *                   description: JWT token for authenticated requests.
     *                   example: "jwt_token_here"
     *       401:
     *         description: Invalid email or password.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates failure due to invalid credentials.
     *                   example: false
     *                 message:
     *                   type: string
     *                   description: Error message.
     *                   example: "Invalid email or password."
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
     */

    /**
     * @swagger
     * /api/auth/me:
     *   get:
     *     summary: Get current user's profile.
     *     description: |
     *       This endpoint retrieves the profile information of the currently authenticated user.
     *       Requires a valid JWT token in the Authorization header.
     *     tags:
     *       - Authentication
     *     responses:
     *       200:
     *         description: User profile retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates whether the profile was retrieved successfully.
     *                   example: true
     *                 data:
     *                   $ref: '#/components/schemas/User'
     *       401:
     *         description: Unauthorized access.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates failure due to unauthorized access.
     *                   example: false
     *                 message:
     *                   type: string
     *                   description: Error message.
     *                   example: "Unauthorized access."
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
     */

    /**
     * @swagger
     * /api/auth/refresh-token:
     *   post:
     *     summary: Refresh access token.
     *     description: |
     *       This endpoint allows users to refresh their JWT access token using a refresh token.
     *       Requires a valid refresh token.
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               refreshToken:
     *                 type: string
     *                 description: The refresh token for the user.
     *                 example: "refresh_token_here"
     *     responses:
     *       200:
     *         description: Access token refreshed successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates whether the refresh was successful.
     *                   example: true
     *                 token:
     *                   type: string
     *                   description: New JWT access token.
     *                   example: "new_jwt_token_here"
     *       401:
     *         description: Invalid refresh token.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates failure due to invalid refresh token.
     *                   example: false
     *                 message:
     *                   type: string
     *                   description: Error message.
     *                   example: "Invalid refresh token."
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
     */

    /**
     * @swagger
     * /api/auth/logout:
     *   post:
     *     summary: Log out a user.
     *     description: |
     *       This endpoint allows users to log out of their account, invalidating the current JWT token.
     *       Requires a valid JWT token in the Authorization header.
     *     tags:
     *       - Authentication
     *     responses:
     *       200:
     *         description: User successfully logged out.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates whether the logout was successful.
     *                   example: true
     *                 message:
     *                   type: string
     *                   description: Success message.
     *                   example: "User successfully logged out."
     *       401:
     *         description: Unauthorized access.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates failure due to unauthorized access.
     *                   example: false
     *                 message:
     *                   type: string
     *                   description: Error message.
     *                   example: "Unauthorized access."
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
     */

    /**
     * @swagger
     * /api/auth/change-password:
     *   post:
     *     summary: Change user's password.
     *     description: |
     *       This endpoint allows authenticated users to change their password.
     *       Requires the old password, new password, and a valid JWT token in the Authorization header.
     *     tags:
     *       - Authentication
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               oldPassword:
     *                 type: string
     *                 format: password
     *                 description: User's current password.
     *                 example: OldPassw0rd!
     *               newPassword:
     *                 type: string
     *                 format: password
     *                 description: User's new password.
     *                 example: NewPassw0rd!
     *     responses:
     *       200:
     *         description: Password changed successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates whether the password change was successful.
     *                   example: true
     *                 message:
     *                   type: string
     *                   description: Success message.
     *                   example: "Password successfully changed."
     *       400:
     *         description: Invalid old password or weak new password.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   description: Indicates failure due to validation issues.
     *                   example: false
     *                 message:
     *                   type: string
     *                   description: Error message describing the validation issue.
     *                   example: "Old password is incorrect."
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
     */

    run() {
        this.router.post(
            '/register',
            singleUpload,
            Validator.validateRequest({
                body: User
            }),
            AuthController.register
        );

        this.router.post(
            '/verify-email',
            Validator.validateRequest({
                body: token
            }),
            AuthController.verifyEmail
        );

        this.router.post(
            '/login',
            Validator.validateRequest({
                body: UserLogin
            }),
            AuthController.login
        );

        this.router.get('/me', Auth.authenticate, AuthController.me);

        this.router.post('/refresh-token', AuthController.refreshAccessToken);

        this.router.post('/logout', Auth.authenticate, AuthController.logOut);
        this.router.post(
            '/change-password',
            Auth.authenticate,
            Validator.validateRequest({
                body: Password
            }),
            AuthController.changePassword
        );
        this.router.post(
            '/forgot-password',
            Validator.validateRequest({
                body: ForgotPassword
            }),
            AuthController.forgotPassword
        );

        this.router.post(
            '/reset-password',
            Validator.validateRequest({
                body: ResetPassword
            }),
            AuthController.resetPassword
        );

        this.router.post(
            '/resend-verification-email/:email',
            Validator.validateRequest({params: ForgotPassword}),
            AuthController.resendEmailVerification
        );

        this.router.post(
            '/resend-forgot-password-email/:email',
            Validator.validateRequest({params: ForgotPassword}),
            AuthController.resendForgotPasswordEmail
        );

        this.router.post('/oauth-request', AuthController.getOAuthRequestURL);

        this.router.get('/oauth', AuthController.loginWithOAuth);
    }
}

export default new AuthRouter().router;

