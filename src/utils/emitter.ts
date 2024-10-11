/* eslint-disable @typescript-eslint/restrict-template-expressions */
import config from '../config/config';
import EventEmitter from 'events';
import sendEmail from './mail/sendEmail';
import welcomeUsertemp from './template';
import logger from './logger';

class EmailEmitter extends EventEmitter {
    private readonly frontEndUrl: string;

    constructor(frontEndUrl: string) {
        super();
        this.frontEndUrl = frontEndUrl;
    }

    private async sendWelcomeEmail(data: { email: string, name: string }): Promise<void> {
        try {
            const emailContent: string = await welcomeUsertemp.generateWelcomeEmail(data.email, data.name);

            await sendEmail({
                email: data.email,
                subject: 'Welcome to Birthday Genie',
                content: emailContent
            });

            logger.info(`Welcome email successfully sent to ${data.email}`);
        } catch (error) {
            logger.error(`Failed to send welcome email to ${data.email}. Error: ${error instanceof Error ? error.message : error}`);
            throw error;
        }
    }
}

const emailEmitter = new EmailEmitter(config.FRONTEND_URL as string);

export default emailEmitter;
