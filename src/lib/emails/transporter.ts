import nodemailer from 'nodemailer';
import config from '../../config/config';
import {TransportOptionsType} from '../../types/email.types';

// const sendEmail = async (options: EmailOptions): Promise<void> => {
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

//     const message = {
//         from: `${config.EMAIL_FROM} <${config.SMTP_FROM}>`,
//         to: options.email,
//         subject: options.subject,
//         html: options.content,
//         category: options.category
//     };
//     logger.info(`Attempting to send email to ${options.email}`);
//     transporter.sendMail(message, (error, info))=>{
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(info);
//         }
//     });
//     logger.info(`Email successfully sent to ${options.email}. Message ID: ${info.messageId}`);
// };

// export default sendEmail;

