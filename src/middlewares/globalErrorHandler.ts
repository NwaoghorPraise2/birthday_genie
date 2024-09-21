/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ThttpError } from '../types/types';



class GlobalError {
    public globalErrorHandler(
        err: ThttpError,
         __: Request,
        res: Response,
        _:NextFunction
    ):void {
        res.status(err.statusCode).json(err);
    }
}

// eslint-disable-next-line @typescript-eslint/unbound-method
export default new GlobalError().globalErrorHandler;