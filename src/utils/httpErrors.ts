import { NextFunction, Request } from 'express';
import errorObject from './errorObject';

/**
 * HttpErrors Class - Standardizes error handling across the application
 * 
 * - Provides a method to trigger custom error responses.
 * - Uses an external `errorObject` utility to create consistent error objects.
 * - Passes the error to the next middleware (or global error handler) using `nextFunc`.
 * 
 * Key Considerations:
 * - Centralized error management: By using this class, all error responses in the application can be managed from a single place.
 * - Flexibility: The `badRequest` method allows for customization of error messages and status codes.
 * - Ease of use: Automatically formats the error and passes it to the next middleware for centralized error handling.
 */
class HttpErrors {
    /**
     * Triggers a bad request error (or other errors depending on the status code).
     *
     * @param nextFunc - Express's next function to pass the error to the next middleware
     * @param err - The error object or message to handle
     * @param req - The Express request object to include in the error details
     * @param errorStatusCode - Optional status code for the error (default is 500)
     */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    public badRequest(nextFunc: NextFunction, err: Error | unknown, req: Request, errorStatusCode: number = 500): void {
        // Create a standardized error object
        const errorObj = errorObject.badRequest(err, req, errorStatusCode);
        
        // Pass the error object to the next middleware or the global error handler
        return nextFunc(errorObj);
    }
}

export default new HttpErrors();
