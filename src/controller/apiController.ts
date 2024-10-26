/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response} from 'express';
import httpResponse from '../dto/httpResponse';
import responseMessage from '../constant/responseMessage';
import quickers from '../utils/quickers';
import GlobalError from '../utils/HttpsErrors';
import logger from '../utils/logger';

class ApiController {
    /**
     * Test endpoint - responds with success message.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     */
    public test = (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Log the request details
            logger.info(`Test: ${JSON.stringify(req.body)}`, {
                meta: {
                    method: req.method,
                    body: req.body
                }
            });

            // Send success response
            httpResponse.ok(req, res, 200, responseMessage.SUCCESS, null);
        } catch (err) {
            // Pass error to global error handler
            next(new GlobalError(500, `Error`));
        }
    };

    /**
     * Health check endpoint - provides application and system health.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     */
    public health = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const healthData = {
                application: quickers.getApplicationHealth(),
                system: quickers.getSystemHealth(),
                timeStamp: new Date()
            };

            // Send health data response
            httpResponse.ok(req, res, 200, responseMessage.SUCCESS, healthData);
        } catch (err) {
            // Pass error to global error handler
            next(new GlobalError(500, `Error`));
        }
    };

    public getClient = (req: Request, res: Response, next: NextFunction): void => {
        try {
            httpResponse.ok(req, res, 200, 'welcome to Birthday Genie');
        } catch (err) {
            // Pass error to global error handler
            next(new GlobalError(500, `Error`));
        }
    };
}

export default new ApiController();

