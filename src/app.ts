import express from 'express';
import apiRouter from './router/apiRouter';

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
    }
}

export default new App().app;