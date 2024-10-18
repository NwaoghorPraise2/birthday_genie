import { ApplicationENV } from '../constant/application';
import {Response} from 'express';

export class CookiesHandler {
    static setAccessTokenCookies(res: Response, userId: string, access_token: string){
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: ApplicationENV.PRODUCTION as string === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })
    }
    static setRefreshTokenCookies(res: Response, userId: string, refresh_token: string){
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: ApplicationENV.PRODUCTION as string === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })
    }
}

