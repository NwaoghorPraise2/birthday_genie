import { Request, Response } from 'express';
import { ThttpResponse } from '../types/types';
import { ApplicationENV } from '../constant/application';
import config from '../config/config';
import logger from '../utils/logger';

/**
 * HttpResponses Class provides standardized methods for sending HTTP responses.
 * 
 * - Response Standardization: Ensures a consistent structure across all responses in the application.
 * - Logging: Logs outgoing responses for easier debugging and monitoring of API behavior.
 * - Security Consideration: In production environments, sensitive information such as client IP addresses are removed from responses.
 * - Customizability: Supports default status codes while allowing customization of response messages and payloads.
 * 
 * Key Considerations:
 * - Response Consistency: All responses include fields such as success, statusCode, message, and data.
 * - Debugging and Auditing: Logs the details of each response to aid in identifying issues and understanding application flow.
 * - Enhanced Security: Protects user privacy by omitting IP addresses in production environments.
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
        data?: unknown, // Data to include in the response
        access_token?: string,
        refresh_token?: string
    ): void {
        const response: ThttpResponse = {
            success: true,
            statusCode: responseStatusCode,
            request: {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip || null
            },
            access_token: access_token || null,
            refresh_token: refresh_token || null,
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
