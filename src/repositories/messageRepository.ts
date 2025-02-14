import IMessage, {MessageStatus} from '../types/message.types';
import db from '../config/db';

export default class MessageRepository {
    public static async createMessage(message: IMessage, userId: string) {
        return await db.message.create({
            data: {
                ...message,
                userId
            }
        });
    }

    public static async getMessagesByUserId(userId: string) {
        return await db.message.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    public static async deleteMessage(messageId: string) {
        return await db.message.update({
            where: {
                id: messageId
            },
            data: {
                isDeleted: true
            }
        });
    }

    public static async updateMessageStatus(messageId: string, MessageStatus: MessageStatus, historyId: string) {
        return await db.message.update({
            where: {
                id: messageId
            },
            data: {
                status: MessageStatus,
                historyId
            }
        });
    }

    public static async getMessageById(messageId: string) {
        return await db.message.findUnique({
            where: {
                id: messageId
            }
        });
    }
}

