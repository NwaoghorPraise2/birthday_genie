import {transporter} from '../lib/emails/transporter';
import {EmailOptions} from '../types/email.types';
import config from '../config/config';
import logger from '../utils/logger';

export default class EmailService {
    private sendEmail(options: EmailOptions) {
        const message = {
            from: `${config.EMAIL_FROM} <${config.SMTP_FROM}>`,
            to: options.email,
            subject: options.subject,
            html: options.content,
            category: options.category
        };
        setImmediate(() => {
            transporter.sendMail(message, (error, info) => {
                if (error) {
                    logger.error(`Failed to send email to ${message.to}:`, {
                        meta: {
                            error: error.message
                        }
                    });
                } else {
                    logger.info(`Email sent to ${message.to}: ${info.response}`);
                }
            });
        });
    }

    public sendPlainTextEmail(options: EmailOptions) {
        return this.sendEmail(options);
    }

    public sendHTMLEmail(options: EmailOptions) {
        return this.sendEmail(options);
    }
}

