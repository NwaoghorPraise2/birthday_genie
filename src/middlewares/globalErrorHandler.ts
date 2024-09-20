import { NextFunction, Request, Response } from 'express';
import { ThttpError } from '../types/types';

class GlobalError {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public globalErrorHandler(
        err: ThttpError,
         __: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _:NextFunction
    ):void {
        res.status(err.statusCode).json(err);
    }
}

// eslint-disable-next-line @typescript-eslint/unbound-method
export default new GlobalError().globalErrorHandler;