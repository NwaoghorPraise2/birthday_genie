import config from '../config/config';
import { ApplicationENV } from '../constant/application';
import responseMessage from '../constant/responseMessage';
import { ThttpError } from '../types/types';
import { Request } from 'express';
import logger from './logger';

/**
 * ErrorObject Class - Creates standardized error objects for handling HTTP errors.
 * 
 * - Ensures consistency in error responses across the application.
 * - Logs errors for easier debugging and monitoring.
 * - Modifies the error object in production environments to hide sensitive data like stack traces and IP addresses.
 * 
 * Key Considerations:
 * - Standardization: Ensures all error responses follow the same structure, simplifying error handling and logging.
 * - Security: Removes sensitive information (e.g., stack trace, IP address) in production to prevent exposing internal details.
 * - Flexibility: Accepts any type of error and provides a default message when needed, making it adaptable to various error scenarios.
 */
class ErrorObject {
    /**
     * Creates a standardized error object for bad request errors (or other errors depending on the status code).
     *
     * @param err - The error object or message to handle
     * @param req - The Express request object to extract method, URL, and IP for logging
     * @param errorStatusCode - Optional status code for the error (default is 500)
     * @returns A ThttpError object ready to be sent in the response or passed to the next middleware
     */
    public badRequest(
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        err: Error | unknown, 
        req: Request,
        errorStatusCode: number = 500,
    ): ThttpError {
        const errorObj: ThttpError = {
            success: false,
            statusCode: errorStatusCode,
            request: {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip || null,
            },
            message: err instanceof Error ? err.message : responseMessage.SOMETHING_WENT_WRONG,
            data: null,
            trace: err instanceof Error ? { Error: err.stack } : null,
        };

        // Log the error for debugging and audit purposes
        logger.info('Controller Error', {
            meta: errorObj,
        });

        // In production, remove sensitive information like the IP address and stack trace
        if (config.ENV === ApplicationENV.PRODUCTION) {
            delete errorObj.request.ip;
            delete errorObj.trace;
        }

        return errorObj;
    }
}

export default new ErrorObject();
