import { Request, Response } from 'express';
export default {
    test: (_: Request, res: Response) => {
        try {
            res.status(200).json({
                message: 'Welcome to Birthday Genie'
            });
        } catch (err) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: err
            });
        }
    }
}