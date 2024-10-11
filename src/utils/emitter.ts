import config from '../config/config';
import EventEmitter from 'events';

class Emitter extends EventEmitter {
    private readonly frontendurl: string;

    constructor(){
        super();
        this.frontendurl = config.FRONTEND_URL as string;
    }

    private async sendWelcomeEmail(data: {email: string, name: string}){
        const emailContent = await 

    }

}