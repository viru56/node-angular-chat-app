export class User {
    _id: string;
    email: string;
    username: string;
    token: string;
    image: string;
    iconUrl: string;
    phone: number;
    latitude: number;
    longitude: number;
    logedIn?: any;
    socketId?: string;
    unreadMessage?: any;
    connection?: any;
    provider?: string;
    profileUrl?: string;
}
