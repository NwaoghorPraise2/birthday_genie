import { NextFunction, Request, Response } from 'express';
import httpResponse from '../utils/httpResponse';
import responseMessage from '../constant/responseMessage';
import httpError from '../utils/httpErrors';
export default {
    test: (req: Request, res: Response, next: NextFunction) => {
        try {
            httpResponse.ok(req, res, 200, responseMessage.SUCCESS, null)
        } catch (err) {
            httpError.badRequest(next, err, req, 500);
        }
    }
}