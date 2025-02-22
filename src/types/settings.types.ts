export default interface IAccountSettings {
    birthdayNotificationTime?: number;
    timeToSendBirthdayMessages?: number;
    defaultMessageChannel?: MessageChannel;
    useNickNameInMessage?: boolean;
}

enum MessageChannel {
    EMAIL = 'EMAIL',
    WHATSAPP = 'WHATSAPP',
    TEXTMESSAGE = 'TEXTMESSSAGE'
}

