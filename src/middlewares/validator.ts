import { ZodError } from 'zod';
import RequestValidator from '../types/validator.types';
import { NextFunction, Request, Response } from 'express';
import GlobalError from '../utils/HttpsErrors';

export default class Validator {
    public static validateRequest(validator: RequestValidator){
        return async(req: Request, res: Response, next: NextFunction) => {
            try {
                if (validator.body){
                    req.body = await validator.body.parseAsync(req.body);
                }
                if (validator.params){
                    req.params = await validator.params.parseAsync(req.params);
                }
                if (validator.query){
                    req.query = await validator.query.parseAsync(req.query);
                }
    
                next()
            } catch (error) {
                if (error instanceof ZodError) {
                    const specificMessages = error.errors.map(err => err.message);
                    return next(new GlobalError(422, specificMessages.join(', ')));
                }
                next(error);
            }
        }
    }
}