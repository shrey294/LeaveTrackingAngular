export interface AppNotification{
    notificationId: number;
    notificationType: string;
    message: string;
    isRead:boolean;
    readDate:string;
    createdDate:string;
    recevierUserId:number;
    senderUserId:number;
    senderUserName:string;
}