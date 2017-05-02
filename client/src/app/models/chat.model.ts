export class Chat {
    _id?: any;
    connection?: string;
    sender: string;
    receiver: string;
    content: string;
    updatedAt?: Date;
    createdAt?: Date;
    unread?: boolean;
}