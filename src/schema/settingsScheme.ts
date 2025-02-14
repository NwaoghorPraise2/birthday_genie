export default interface IAccountSettings {
    birthdayNotificationTime?: number;
    timeToSendBirthdayMessages?: number;
    defaultMessageChannel?: MessageChannel;
    useNickNameInMessage?: boolean;
}

enum MessageChannel {
    EMAIL = 'email',
    WHATSAPP = 'whatsapp',
    TEXTMESSAGE = 'textmessage'
}

