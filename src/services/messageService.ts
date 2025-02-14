import openAiService from '../lib/openAi/openAiService';

export default class MessageService {
    public static async generateMessage(prompt: string) {
        const messageResponse = await openAiService.generateMessage(prompt);
        if (!messageResponse) {
            throw new Error('Error generating message');
        }
        return messageResponse;
    }
}

