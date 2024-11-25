import OpenAI from 'openai';
export class MessageService {
    private openai: OpenAI;
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async createMessage(content: string) {
        const chatCompletion = await this.openai.chat.completions.create({
            messages: [{role: 'user', content: content}],
            model: 'gpt-3.5-turbo'
        });
        return chatCompletion.choices[0].message.content;
    }
}

