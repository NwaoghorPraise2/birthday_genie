import config from '../config/config';
import TwilioConnect from '../lib/twilio/twilioConnect';
import logger from './logger';

export default class TwilioService {
    public static async sendSMS(to: string, message: string) {
        try {
            await TwilioConnect.messages.create({
                body: message,
                from: config.TWILIO_PHONE_NUMBER,
                to
            });
        } catch (error) {
            logger.error({meta: error});
            throw new Error('Failed to send SMS');
        }
    }

    public static async sendWhatsApp(to: string, message: string) {
        try {
            await TwilioConnect.messages.create({
                body: message,
                from: `whatsapp:${config.TWILIO_PHONE_NUMBER}`,
                to: `whatsapp:${to}`
            });
        } catch (error) {
            logger.error({meta: error});
        }
    }
}

