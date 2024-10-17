import sendEmail from './sendEmail';
import logger from '../logger';
import {VERIFICATION_EMAIL_TEMPLATE}  from '../mail/email templates/sendEmailTemps';

export class HandleEmails {
    static sendVerificationEmail = async (email: string, name: string, verificationToken: string) => {
        const emailContent = VERIFICATION_EMAIL_TEMPLATE.replace(/{{NAME}}/g, name).replace(/{{VERIFICATION_TOKEN}}/g, verificationToken)

        await sendEmail({
            email: email,
            subject: 'Verify your email',
            content: emailContent,
            category: 'Email Verification'
        });
        logger.info(`Welcome email successfully sent to ${email}`);
    }
}