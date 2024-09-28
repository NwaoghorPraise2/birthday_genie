import express, { NextFunction, Response, Request } from 'express';
import apiRouter from './router/apiRouter';
import globalErrorHandler from './middlewares/globalErrorHandler';
import httpErrors from './utils/httpErrors';
import responseMessage from './constant/responseMessage';
import helmet from 'helmet';
import cors from 'cors';
/**
 * The App class configures and initializes the Express application.
 * 
 * - Middleware setup: Includes JSON parsing and URL encoding middleware for request payload processing.
 * - Routes: Registers an API router for all '/api' routes.
 * - 404 Handler: Catches unmatched routes and throws a 404 error with a custom message.
 * - Global Error Handler: Ensures centralized error handling across the application to handle all operational errors.
 * 
 * Key Considerations:
 * - Separation of Concerns: Middleware, routes, and error handling are separated for better maintainability.
 * - Custom Error Handling: The app uses a custom error handler to send standardized error responses.
 * - Security & Validation: Although not present in this snippet, this structure allows easy integration of security 
 *   middleware (like helmet, CORS) and validation logic at a central point.
 */
class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        // Middleware to handle JSON and URL-encoded data parsing
        this.app.use(cors({
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            credentials: true,
        }))
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use('/api', apiRouter);

        // Handle unmatched routes (404)
        this.app.use('*', (req: Request, res: Response, next: NextFunction) => {
            try {
                // Throw a 404 error with a custom response message
                throw new Error(responseMessage.NOT_FOUND('route'));
            } catch (err) {
                // Call the custom HTTP error handler
                httpErrors.badRequest(next, err, req, 404);
            }
        });

        // Global error handler for handling all application-level errors
        this.app.use(globalErrorHandler);
    }
}

export default new App().app;
