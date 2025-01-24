import {TransportOptions} from 'nodemailer';

export type TransportOptionsType = TransportOptions & {
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    };
    tls: {
        rejectUnauthorized: boolean;
    };
};

export interface EmailOptions {
    email: string;
    subject: string;
    content: string;
    category?: string;
}

