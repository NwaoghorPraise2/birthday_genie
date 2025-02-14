import IMessage, {MessageStatus, MessageTag} from '../types/message.types';
import db from '../config/db';

export default class MessageRepository {
    public static async createMessage(message: IMessage, userId: string) {
        return db.message.create({
            data: {
                ...message,
                status: message.status ?? MessageStatus.DRAFT,
                tag: message.tag ?? MessageTag.AI,
                userId
            }
        });
    }
}

