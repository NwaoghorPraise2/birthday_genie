import {NextFunction, Request, Response } from 'express';
import httpResponse from '../utils/httpResponse';
import responseMessage from '../constant/responseMessage';
import httpError from '../utils/httpErrors';
import quickers from '../utils/quickers';

class ApiController {
    public test = (req: Request, res: Response, next: NextFunction): void => {
        try {
            httpResponse.ok(req, res, 200, responseMessage.SUCCESS, null);
        } catch (err) {
            httpError.badRequest(next, err, req, 500);
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
            httpError.badRequest(next, err, req, 500);
        }
    }
}

export default new ApiController();
