import express, { NextFunction, Response, Request } from 'express';
import apiRouter from './router/apiRouter';
import globalErrorHandler from './middlewares/globalErrorHandler';
import httpErrors from './utils/httpErrors';
import responseMessage from './constant/responseMessage';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        //middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        //Routes
        this.app.use('/api', apiRouter);

        //4o4 Handler
        this.app.use('*', (req:Request, res:Response, next: NextFunction) => {
            try{
                throw new Error(responseMessage.NOT_FOUND('route'));
            }catch(err){
                httpErrors.badRequest(next, err, req, 404);
            }
        })

        //Global Error Handler
        this.app.use(globalErrorHandler);
    }
}

export default new App().app;