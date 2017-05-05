export class Room {
    _id?: string;
    connection: string;
    sender: string;
    receiver: string;
    updatedAt?: Date;
    createdAt?: Date;
    unreadMessage?: number;
}