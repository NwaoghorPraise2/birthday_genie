/* eslint-disable @typescript-eslint/no-misused-promises */
import config from '../../config/config';
import EventEmitter from 'events';
import sendEmail from './sendEmail';
import welcomeUsertemp from './email templates/template';
import logger from '../logger';
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} from './email templates/sendEmailTemps';

class EmailEmitter extends EventEmitter {
    private readonly frontEndUrl: string;

    constructor(frontEndUrl: string) {
        super();
        this.frontEndUrl = frontEndUrl;
        this.on('Verification-Email', this.sendVerificationEmail);
        this.on('Welcome-Email', this.sendWelcomeEmail);
        this.on('Reset-Password-Email', this.sendResetPasswordEmail);
        this.on('Reset-Password-Success-Email', this.sendResetPasswordSucessEmail);
    }

    private sendWelcomeEmail = async (data: { email: string, name: string }) => {
            const emailContent: string = await welcomeUsertemp.generateWelcomeEmail(data.email, data.name);

            await sendEmail({
                email: data.email,
                subject: 'Welcome to Birthday Genie',
                content: emailContent,
                category: 'Welcome'
            });
            logger.info(`Welcome email successfully sent to ${data.email}`);
    }

    private sendVerificationEmail = async (data: {email: string, name: string, verificationToken: string}) => {
        const emailContent = VERIFICATION_EMAIL_TEMPLATE.replace('{verificationToken}', data.verificationToken).replace('{name}', data.name);

        await sendEmail({
            email: data.email,
            subject: `Verify your email: ${data.verificationToken} `,
            content: emailContent,
            category: 'Email Verification'
        });
        logger.info(`Welcome email successfully sent to ${data.email}`);
    }

    private sendResetPasswordEmail = async (data: {email: string, name: string, resetToken: string}) => {
        const emailContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', data.resetToken).replace('{name}', data.name);

        await sendEmail({
            email: data.email,
            subject: `Reset your password: ${data.resetToken} `,
            content: emailContent,
            category: 'Reset Password'
        });
        logger.info(`Reset password email successfully sent to ${data.email}`);
    }

    private sendResetPasswordSucessEmail = async (data: {email: string, name: string}) => {
        const emailContent = PASSWORD_RESET_SUCCESS_TEMPLATE.replace('{name}', data.name);

        await sendEmail({
            email: data.email,
            subject: `Password Reset Successful!!`,
            content: emailContent,
            category: 'Reset Password'
        });
        logger.info(`Reset password email successfully sent to ${data.email}`);
    }
}

const emailEmitter = new EmailEmitter(config.FRONTEND_URL as string);

export default emailEmitter;
