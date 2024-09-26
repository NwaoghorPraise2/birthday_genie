import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
import { ApplicationENV } from '../constant/application';
import rateLimter from '../config/rate-limiter';
import httpErrors from '../utils/httpErrors';
import responseMessage from '../constant/responseMessage';

class RateLimit {
    private config;
    private ApplicationENV;

    constructor() {
        this.config = config;
        this.ApplicationENV = ApplicationENV;
    }

    public rateLimter = (req: Request, res: Response, next: NextFunction) => {
        // if (this.config.ENV === this.ApplicationENV.DEVELOPMENT) return next();

        if (rateLimter.rateLimiterMongo){
            rateLimter.rateLimiterMongo.consume(req.ip as string,1)
                .then(() => {
                    next();
                })
                .catch(() => {
                    httpErrors.badRequest(next, new Error(responseMessage.TOO_MANY_REQUEST), req, 429)
                });
        }
    }
}

export default new RateLimit().rateLimter;