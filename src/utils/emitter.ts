/* eslint-disable @typescript-eslint/no-misused-promises */
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
        this.on('Welcome-Email', this.sendWelcomeEmail);
    }

    private sendWelcomeEmail = async (data: { email: string, name: string }) => {
            const emailContent: string = await welcomeUsertemp.generateWelcomeEmail(data.email, data.name);

            await sendEmail({
                email: data.email,
                subject: 'Welcome to Birthday Genie',
                content: emailContent
            });
            logger.info(`Welcome email successfully sent to ${data.email}`);
    }
}

const emailEmitter = new EmailEmitter(config.FRONTEND_URL as string);

export default emailEmitter;
