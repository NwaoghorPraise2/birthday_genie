import express, {NextFunction, Response, Request} from 'express';
import apiRouter from './router/apiRoute';
import globalErrorHandler from './middlewares/handleGlobalErrors';
import responseMessage from './constant/responseMessage';
import helmet from 'helmet';
import cors from 'cors';
import GlobalError from './utils/HttpsErrors';
import SwaggerDocs from './utils/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import oauthRouter from './router/oauth';

/**
 * The App class configures and initializes the Express application.
 *
 * - Middleware: Configures essential middleware including CORS, Helmet for security, JSON parsing, and URL encoding.
 * - Routing: Registers API routes under '/api' and integrates Swagger for API documentation.
 * - 404 Handling: Catches unmatched routes, throwing a custom 404 error with a structured response message.
 * - Error Handling: Implements a centralized global error handler to manage operational errors across the app.
 *
 * Key Considerations:
 * - Security: Uses Helmet for basic security hardening and CORS to allow cross-origin requests.
 * - Centralized Error Management: Ensures standardized error responses across the application using a global error handler.
 * - Swagger Integration: Automatically sets up Swagger API documentation to enhance API discoverability.
 */
class App {
    public app = express();

    constructor() {
        this.config();
    }

    private config(): void {
        this.app.use(
            cors({
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                credentials: true
            })
        );
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(cookieParser());

        this.app.use('/api', apiRouter);
        this.app.use('/auth', oauthRouter);

        new SwaggerDocs(this.app);

        // Handle unmatched routes (404)
        this.app.use('*', (req: Request, res: Response, next: NextFunction) => {
            return next(new GlobalError(404, responseMessage.NOT_FOUND('Route')));
        });

        // Global error handler for handling all application-level errors
        this.app.use(globalErrorHandler.errorHandler);
    }
}

export default new App().app;

