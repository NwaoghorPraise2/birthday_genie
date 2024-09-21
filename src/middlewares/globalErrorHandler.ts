/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ThttpError } from '../types/types';

/**
 * GlobalError Class - Centralizes error handling for the application.
 * 
 * - Provides a middleware function to handle errors uniformly across the application.
 * - Sends a standardized JSON response based on the provided error object.
 * 
 * Key Considerations:
 * - Consistency: Ensures all errors are handled in a uniform way, providing clients with predictable responses.
 * - Separation of Concerns: By using a dedicated global error handler, the application can maintain clean controller logic without cluttering it with error handling.
 * - Flexibility: The handler can easily be extended to log errors or modify responses based on the environment (e.g., more detailed error messages in development).
 */
class GlobalError {
    /**
     * Middleware to handle global errors.
     *
     * @param err - The error object containing details about the error
     * @param __ - The request object (unused, hence the double underscore)
     * @param res - The response object used to send the error response
     * @param _ - The next function (unused, hence the underscore)
     */
    public globalErrorHandler(
        err: ThttpError,
        __: Request,
        res: Response,
        _: NextFunction
    ): void {
        res.status(err.statusCode).json(err);
    }
}

// eslint-disable-next-line @typescript-eslint/unbound-method
export default new GlobalError().globalErrorHandler;
