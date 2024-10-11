import GlobalError from '../utils/HttpsErrors';
import JWTService from '../utils/jwt';
import { Request, Response, NextFunction } from 'express';
import responseMessage from '../constant/responseMessage';

class Auth {
    private static JWTService = JWTService.getInstance();

    public static authenticate = (req: Request, res: Response, next: NextFunction) => {

        const token = req.headers.authorization;
        if (!token) return next(new GlobalError(401, responseMessage.UNAUTHORIZED));

        const splitedToken = token.split(' ')[1];
        if (!splitedToken) return next(new GlobalError(401, responseMessage.UNAUTHORIZED));

        try {
            // Verify token
            const decodedToken = Auth.JWTService.verifyAccessToken(splitedToken); // Explicitly referencing the class
            if (!decodedToken) return next(new GlobalError(401, responseMessage.UNAUTHORIZED));

            req.user = decodedToken;
            next();
        } catch (error) {
            // Return error
            next(error);
        }
    }
}

export default Auth;
