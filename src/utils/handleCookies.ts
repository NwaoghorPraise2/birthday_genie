import { ApplicationENV } from '../constant/application';
import {Response} from 'express';

export class CookiesHandler {
    static setCookies(res: Response, userId: string, token: string){
        res.cookie('token', token, {
            httpOnly: true,
            secure: ApplicationENV.PRODUCTION as string === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })
    }
}

