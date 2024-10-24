import GlobalError from '../utils/HttpsErrors';
import JWTService from '../utils/jwt';
import {Request, Response, NextFunction} from 'express';
import responseMessage from '../constant/responseMessage';
import logger from '../utils/logger';

class Auth {
    private static JWTService = JWTService.getInstance();

    /**
     * Middleware to authenticate a user based on the JWT token.
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next function
     */
    public static authenticate = (req: Request, res: Response, next: NextFunction) => {
        // Retrieve the token from the authorization header or cookies
        const token = req.headers?.authorization?.split(' ')[1] || (req.cookies?.access_token as string);

        // Check if the token is present
        if (!token) {
            logger.warn('Authentication failed: No token provided');
            return next(new GlobalError(401, responseMessage.UNAUTHORIZED));
        }

        // Verify the token and extract user information
        const decodedToken = Auth.JWTService.verifyAccessToken(token);

        // Check if the token is valid
        if (!decodedToken) {
            logger.warn('Authentication failed: Invalid token');
            return next(new GlobalError(401, responseMessage.UNAUTHORIZED));
        }

        // Attach the user ID to the request object for further processing
        req.user = decodedToken.id;
        logger.info(`Authentication successful for user ID: ${req.user}`);
        next();
    };
}

export default Auth;

