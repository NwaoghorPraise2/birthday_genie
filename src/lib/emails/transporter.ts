import nodemailer from 'nodemailer';
import config from '../../config/config';
import {TransportOptionsType} from '../../types/email.types';

export const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
} as TransportOptionsType);

