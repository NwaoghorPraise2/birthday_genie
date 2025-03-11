import openAiService from '../lib/openAi/openAiService';
import TwilioService from '../utils/twilioService';

export default class MessageService {
    public static async generateMessage(prompt: string) {
        const messageResponse = await openAiService.generateMessage(prompt);
        if (!messageResponse) {
            throw new Error('Error generating message');
        }

        return {
            message: messageResponse,
            twilio: await TwilioService.sendWhatsApp('+447917490416', messageResponse)
        };
    }
}

