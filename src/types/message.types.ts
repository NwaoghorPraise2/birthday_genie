export default interface IMessage {
    id: string;
    userId: string;
    status?: MessageStatus;
    message?: string;
    tag?: MessageTag;
    isDeleted?: boolean;
    historyId?: string;
}

export interface Prompt {
    prompt: string;
}

export enum MessageStatus {
    SENT = 'SENT',
    DELETED = 'DELETED',
    DRAFT = 'DRAFT'
}

export enum MessageTag {
    HUMAN = 'HUMAN',
    AI = 'AI'
}

