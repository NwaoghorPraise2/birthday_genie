/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import nodemailer, { TransportOptions } from 'nodemailer';
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
}

interface EmailOptions {
    email: string;
    subject: string;
    content: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        // Create transporter object using SMTP transport
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
            html: options.content
        };

        // Send email
        const info = await transporter.sendMail(message);

        // Log successful email send
        logger.info(`Email successfully sent to ${options.email}. Message ID: ${info.messageId}`);
    } catch (error) {
        // Log error details for debugging
        logger.error(`Failed to send email to ${options.email}. Error: ${error instanceof Error ? error.message : error}`);
        throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export default sendEmail;
