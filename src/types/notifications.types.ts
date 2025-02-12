export interface INotification {
    id: string;
    userId: string;
    tag?: string;
    title: string;
    message: string;
    isDeleted?: boolean;
    isRead?: boolean;
}

