export default interface IMessage {
    id: string;
    userId: string;
    status?: MessageStatus;
    message?: string;
    tag?: MessageTag;
    isDeleted?: boolean;
    historyId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum MessageStatus {
    SENT = 'sent',
    DELETED = 'deleted',
    DRAFT = 'draft'
}

export enum MessageTag {
    HUMAN = 'human',
    AI = 'ai'
}

