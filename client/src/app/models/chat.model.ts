export class Chat {
    _id?: string;
    connection?: string;
    sender: string;
    receiver: string;
    content: string;
    updatedAt?: Date;
    createdAt?: Date;
    unread?: boolean;
}