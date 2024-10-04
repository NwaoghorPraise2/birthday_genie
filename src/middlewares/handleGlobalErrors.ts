import { Response, Request, NextFunction } from 'express';
import { ThttpError } from '../types/types';
import logger from '../utils/logger';
import config from '../config/config';
import { ApplicationENV } from '../constant/application';

export default class HandleError {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static errorHandler = (err: ThttpError, req: Request, res: Response, _next: NextFunction) => {
        let  {statusCode} = err;
        statusCode = err.statusCode || 500;

        const isProduction = config.ENV === ApplicationENV.PRODUCTION;

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
        }

        logger.info('Controller Error', {
            meta: errObject,
        });

        res.status(errObject.statusCode).json(errObject)
    }
}