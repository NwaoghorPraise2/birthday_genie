import { Request, Response } from 'express';
import { ThttpResponse } from '../types/types';
import { ApplicationENV } from '../constant/application';
import config from '../config/config';

class HttpResponses {
    public ok(
        req: Request, 
        res: Response, 
        responseStatusCode: number = 200, // Default status code to 200 for success
        responseMessage: string, // Default message
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

        // Log the response for debugging
        console.info(`controller responses`, {
            meta: response
        });

        // Remove IP address in production environments
        if (config.ENV === ApplicationENV.PRODUCTION) {
            delete response.request.ip;
        }

        // Send the response with status code and JSON payload
        res.status(responseStatusCode).json(response);
    }
}

export default new HttpResponses();
