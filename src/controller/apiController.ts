/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response } from 'express';
import httpResponse from '../dto/httpResponse';
import responseMessage from '../constant/responseMessage';
import quickers from '../utils/quickers'; 
import GlobalError from '../utils/HttpsErrors';

class ApiController {
    public test = (req: Request, res: Response, next: NextFunction): void => {
        try {
            httpResponse.ok(req, res, 200, responseMessage.SUCCESS, null);
        } catch (err) {
            next(new GlobalError(500, `Error`));
        }
    }
    public health = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const healthData = {
                application: quickers.getApplicationHealth(),
                system: quickers.getSystemHealth(),
                timeStamp: new Date()
            }

            httpResponse.ok(req, res, 200, responseMessage.SUCCESS, healthData);
        } catch (err) {
            next(new GlobalError(500, `Error`));
        }
    }
}

export default new ApiController();
