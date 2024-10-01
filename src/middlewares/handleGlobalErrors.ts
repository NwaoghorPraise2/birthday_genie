import { Response, Request, NextFunction } from 'express';
import { ThttpError } from '../types/types';
import logger from '../utils/logger';

export default class HandleError {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static errorHandler = (err: ThttpError, req: Request, res: Response, _next: NextFunction) => {
        let  {statusCode} = err;
        statusCode = err.statusCode || 500;

        const errObject = {
            success: false,
            statusCode: statusCode,
            request: {
                method: req.method,
                url: req.url,
                ip: req.ip || null,
            },
            message: err.message,
            data: err.data || null,
            trace: err instanceof Error ? {Error: err.stack} : null,
        }

        logger.info('Controller Error', {
            meta: errObject,
        });

        res.status(errObject.statusCode).json(errObject)
    }
}



// success: false,
//             statusCode: errorStatusCode,
//             request: {
//                 method: req.method,
//                 url: req.originalUrl,
//                 ip: req.ip || null,
//             },
//             message: err instanceof Error ? err.message : responseMessage.SOMETHING_WENT_WRONG,
//             data: null,
//             trace: err instanceof Error ? { Error: err.stack } : null,
//         };

//         // Log the error for debugging and audit purposes
//         logger.info('Controller Error', {
//             meta: errorObj,
//         });

//         // In production, remove sensitive information like the IP address and stack trace
//         if (config.ENV === ApplicationENV.PRODUCTION) {
//             delete errorObj.request.ip;
//             delete errorObj.trace;
//         }