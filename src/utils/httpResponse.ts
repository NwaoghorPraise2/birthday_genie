import { Request, Response } from 'express';
import { ThttpResponse } from '../types/types';
import { ApplicationENV } from '../constant/application';
import config from '../config/config';
import logger from './logger';

/**
 * HttpResponses Class - Provides standardized methods for sending HTTP responses
 * 
 * - Standardizes response structure across the application.
 * - Logs responses for easier debugging and monitoring.
 * - Removes sensitive information (like IP address) in production environments to enhance security.
 * - Uses default status codes and allows for customization of response messages and data.
 * 
 * Key Considerations:
 * - Response Consistency: Ensures all responses follow a similar structure (success, statusCode, message, data, etc.).
 * - Logging: Logs all outgoing responses to provide useful context for debugging issues.
 * - Security: Automatically removes the client's IP address in production environments to avoid logging sensitive data.
 */
class HttpResponses {
    /**
     * Sends a success response (HTTP 200 OK by default) with the provided message and data.
     *
     * @param req - The Express Request object
     * @param res - The Express Response object
     * @param responseStatusCode - Optional HTTP status code (default is 200)
     * @param responseMessage - A custom message for the response
     * @param data - Any data to send in the response body
     */
    public ok(
        req: Request, 
        res: Response, 
        responseStatusCode: number = 200, // Default status code to 200 for success
        responseMessage: string, // Message to include in the response
        data: unknown
    ): void {
        const response: ThttpResponse = {
            success: true,
            statusCode: responseStatusCode,
            request: {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip || null
            },
            message: responseMessage,
            data: data
        };

        // Log the response for debugging and audit purposes
        logger.info('Controller Response', {
            meta: response
        });

        // In production environments, remove the IP address for security reasons
        if (config.ENV === ApplicationENV.PRODUCTION) {
            delete response.request.ip;
        }

        // Send the response with the provided status code and JSON payload
        res.status(responseStatusCode).json(response);
    }
}

export default new HttpResponses();
