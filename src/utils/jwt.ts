/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import config from '../config/config';
import jwt from 'jsonwebtoken';

class JWTService {
    private static instance: JWTService;
    private secret: string;
    private expiresIn: string;
    private refreshExpiresIn: string;
    private refreshSecret: string;

    private constructor() { 
        this.secret = config.JWT_SECRET as string;
        this.expiresIn = config.JWT_EXPIRES_IN as string;
        this.refreshSecret = config.JWT_REFRESH_SECRET as string;
        this.refreshExpiresIn = config.JWT_REFRESH_EXPIRES_IN as string;
    }

    public static getInstance(): JWTService {
        if (!JWTService.instance) {
            JWTService.instance = new JWTService();
        }
        return JWTService.instance;
    }

    public signToken(payload: object): string { 
            return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn }) as string;
    }

    public verifyToken(token: string): string{
            return jwt.verify(token, this.secret) as string;
    }

    public signRefreshToken(payload: object): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.refreshExpiresIn }) as string;
    }
}

export default JWTService;