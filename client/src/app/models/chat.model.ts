export class Message {
    _id?: any;
    sender: string;
    receiver: string;
    content: string;
    updatedAt?: Date;
    createdAt?: Date;
    connection?: string;
}

export class Chat {
    _id: any;
    connection: string;
    messages: Array<Message>;
}