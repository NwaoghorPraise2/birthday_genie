import config from '../config/config';
import { ApplicationENV } from '../constant/application';
import responseMessage from '../constant/responseMessage';
import { ThttpError } from '../types/types';
import { Request } from 'express';
import logger from './logger';


class ErrorObject {
    public badRequest(
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        err: Error | unknown, 
        req: Request,
        errorStatusCode: number = 500,
    ):ThttpError{
        const errorObj: ThttpError = {
            success: false,
            statusCode: errorStatusCode,
            request: {
                method: req.method,
                url: req.originalUrl,
                ip: req.ip || null
            },
            message: err instanceof Error ? err.message : responseMessage.SOMETHING_WENT_WRONG, 
            data: null,
            trace: err instanceof Error ? {Error: err.stack} : null,
        };

        //log
        logger.info(`Controller Error`, {
            meta: errorObj,
        })


        //production
        if (config.ENV === ApplicationENV.PRODUCTION){
            delete errorObj.request.ip;
            delete errorObj.trace;
        }

        return errorObj;
    }
 }

export default new ErrorObject();