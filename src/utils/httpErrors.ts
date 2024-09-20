import { NextFunction, Request} from 'express';
import errorObject from './errorObject';

class HttpErrors {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    public badRequest(nextFunc: NextFunction, err: Error | unknown, req: Request, errorStatusCode: number = 500 ): void {
        const errorObj = errorObject.badRequest(err, req, errorStatusCode)
        return nextFunc(errorObj);
    }
}

export default new HttpErrors();