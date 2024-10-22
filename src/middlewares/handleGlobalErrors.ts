import { Response, Request, NextFunction } from 'express';
import { ThttpError } from '../types/types';
import logger from '../utils/logger';
import config from '../config/config';
import { ApplicationENV } from '../constant/application';
/**
 * HandleError Class provides a centralized error handling mechanism for Express applications.
 * 
 * - Error Handling: Captures errors thrown during request processing and formats them into a 
 *   standardized response object.
 * - Logging: Logs error details for debugging and monitoring purposes.
 * - Environment Specific Responses: Adjusts the error response based on the environment (production vs. development).
 * 
 * Key Considerations:
 * - Consistency: Ensures all error responses have a uniform structure, making it easier for clients to 
 *   handle errors.
 * - Security: In production, sensitive information (like IP address and stack trace) is omitted to protect 
 *   user privacy.
 * - Traceability: In development, detailed error information is included to assist with debugging.
 */

export default class HandleError {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static errorHandler = (err: ThttpError, req: Request, res: Response, _next: NextFunction) => {
        let { statusCode } = err;
        statusCode = err.statusCode || 500;

        const isProduction = config.ENV === ApplicationENV.PRODUCTION;

        // Handle Prisma errors in production mode
        // const isPrismaError = err instanceof  Prisma.PrismaClientKnownRequestError;

        const errObject = {
            success: false,
            statusCode: statusCode,
            request: {
                method: req.method,
                url: req.url,
                ...(isProduction ? {} : { ip: req.ip || null }),
            },
            message: err.message,
            data: err.data || null,
            ...(isProduction ? {} : { trace: err instanceof Error ? { Error: err.stack } : null }),
        };

        logger.info('Controller Error', {
            meta: errObject,
        });

        res.status(errObject.statusCode).json(errObject);
    }
}
