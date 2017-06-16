import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Chat, User } from '../models';
export class SocketSerivce {
    private socket: any;
    constructor() {
        this.socket = io(environment.base_url);
    }
    // update all users to join 
    initSocket(user: User) {
        console.log('initSocket');
        if (this.socket.json.connected) {
            this.socket.emit('join', user);
        } else {
            this.socket = io(environment.base_url);
            this.socket.emit('join', user);
        }
    }

    userJoinLeft() {
        let observable = new Observable<User>(observer => {
            this.socket.on('user-join-left', (user) => {
                observer.next(user);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    // set writer name
    setWriter(data) {
        this.socket.emit('get-writer', data);
    }
    getWriter() {
        let observable = new Observable<string>(observer => {
            this.socket.on('set-writer', (writerName) => {
                observer.next(writerName);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }
    // get set message
    sendMessage(data) {
        this.socket.emit('get', data);
    }
    updateUnreadMessageToZero(connetion) {
        this.socket.emit('room-update', connetion);
    }
    getMessage() {
        let observable = new Observable<any>(observer => {
            this.socket.on('set', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    // get-set all chat
    getChatHistory(userId) {
        this.socket.emit('get-chat-history', userId);
    }
    setChatHistory() {
        let observable = new Observable<Array<Chat>>(observer => {
            this.socket.on('set-chat-history', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    // joinRoom(data) {
    //     this.socket.emit('join', data);
    // }
    // updateRoom(data){
    //     this.socket.emit('update-room', data);
    // }

    // get set all user
    getAllUsers(userId) {
        this.socket.emit('get-users', userId);
    }
    setAllUsers() {
        let observable = new Observable<Array<User>>(observer => {
            this.socket.on('set-users', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }



    // getRoom() {
    //     let observable = new Observable<any>(observer => {
    //         this.socket.on('room-joined', (data) => {
    //             observer.next(data);
    //         });
    //         return () => {
    //             this.socket.disconnect();
    //         };
    //     });
    //     return observable;
    // }


}