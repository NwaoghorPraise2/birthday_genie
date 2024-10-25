/* eslint-disable @typescript-eslint/restrict-template-expressions */
import nodemailer, {TransportOptions} from 'nodemailer';
import config from '../../config/config';
import logger from '../logger';

type TransportOptionsType = TransportOptions & {
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

interface EmailOptions {
    email: string;
    subject: string;
    content: string;
    category: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    const transporter = nodemailer.createTransport({
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

    const message = {
        from: `${config.EMAIL_FROM} <${config.SMTP_FROM}>`,
        to: options.email,
        subject: options.subject,
        html: options.content,
        category: options.category
    };
    logger.info(`Attempting to send email to ${options.email}`);
    const info = await transporter.sendMail(message);
    logger.info(`Email successfully sent to ${options.email}. Message ID: ${info.messageId}`);
};

export default sendEmail;

