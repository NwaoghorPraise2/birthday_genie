import EmailService from '../../services/emailService';
import welcomeUsertemp from './email templates/template';
import logger from '../logger';
import {VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} from './email templates/sendEmailTemps';

export default class EmailEmitter {
    private EmailServices!: EmailService;

    public staticsendWelcomeEmail = async (data: {email: string; name: string}) => {
        const emailContent: string = await welcomeUsertemp.generateWelcomeEmail(data.email, data.name);

        this.EmailServices.sendHTMLEmail({
            email: data.email,
            subject: 'Welcome to Birthday Genie',
            content: emailContent,
            category: 'Welcome'
        });
        logger.info(`Welcome email successfully sent to ${data.email}`);
    };

    public sendVerificationEmail = (data: {email: string; name: string; verificationToken: string}) => {
        const emailContent = VERIFICATION_EMAIL_TEMPLATE.replace('{verificationToken}', data.verificationToken).replace('{name}', data.name);
        this.EmailServices.sendHTMLEmail({
            email: data.email,
            subject: `Verify your email: ${data.verificationToken} `,
            content: emailContent,
            category: 'Email Verification'
        });
        logger.info(`Welcome email successfully sent to ${data.email}`);
    };

    public sendResetPasswordEmail = (data: {email: string; name: string; resetToken: string}) => {
        const emailContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', data.resetToken).replace('{name}', data.name);

        this.EmailServices.sendHTMLEmail({
            email: data.email,
            subject: `Reset your password: ${data.resetToken} `,
            content: emailContent,
            category: 'Reset Password'
        });
        logger.info(`Reset password email successfully sent to ${data.email}`);
    };

    public sendResetPasswordSucessEmail = (data: {email: string; name: string}) => {
        const emailContent = PASSWORD_RESET_SUCCESS_TEMPLATE.replace('{name}', data.name);

        this.EmailServices.sendHTMLEmail({
            email: data.email,
            subject: `Password Reset Successful!!`,
            content: emailContent,
            category: 'Reset Password'
        });
        logger.info(`Reset password email successfully sent to ${data.email}`);
    };
}

