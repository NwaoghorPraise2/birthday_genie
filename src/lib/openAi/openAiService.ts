import OpenAi from 'openai';
import config from '../../config/config';

class OpenAiService {
    private openai: OpenAi;

    constructor() {
        this.openai = new OpenAi({
            apiKey: config.OPEN_AI_SECRET
        });
    }

    async generateMessage(prompt: string): Promise<string> {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0125',
            messages: [
                {role: 'system', content: config.ASSIGN_MODEL_ROLE as string},
                {role: 'user', content: prompt}
            ]
        });
        return response.choices[0].message.content as string;
    }

    async generateStreamChat(prompt: string) {
        const stream = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{role: 'user', content: prompt}],
            stream: true
        });
        for await (const chunk of stream) {
            process.stdout.write(chunk.choices[0]?.delta?.content || '');
        }
    }
}

export default new OpenAiService();

