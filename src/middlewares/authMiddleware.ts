import GlobalError from '../utils/HttpsErrors';
import JWTService from '../utils/jwt';
import { Request, Response, NextFunction } from 'express';
import responseMessage from '../constant/responseMessage';

class Auth {
    private static JWTService = JWTService.getInstance();

    public static authenticate = (req: Request, res: Response, next: NextFunction) => {
        const incomingHeaderToken = req.headers.authorization as string;
        const headerToken = incomingHeaderToken.split(' ')[1];
        const cookieToken = req.cookies.access_token as string;
        const token = headerToken || cookieToken ;
        if (!token) return next(new GlobalError(401, responseMessage.UNAUTHORIZED));

        try {
            const decodedToken = Auth.JWTService.verifyAccessToken(token);
            if (!decodedToken) return next(new GlobalError(401, responseMessage.UNAUTHORIZED));

            req.user = decodedToken.id;
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default Auth;
