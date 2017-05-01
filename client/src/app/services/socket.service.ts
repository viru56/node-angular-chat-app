import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Chat, Room } from '../models';
export class SocketSerivce {
    private socket: any;
    constructor() {
        this.socket = io(environment.base_url);
    }
    initSocket(userId) {
        this.socket = io(environment.base_url);
        this.socket.emit('update-user', userId);
    }
    setWriter(data) {
        this.socket.emit('get-writer', data);
    }
    sendMessage(data) {
        this.socket.emit('get', data);
    }
    joinRoom(data) {
        this.socket.emit('join', data);
    }
    updateRoom(data){
        this.socket.emit('update-room', data);
    }
    getAllUsersRooms(userId) {
        this.socket.emit('get-users-rooms', userId);
    }
    setAllUsersRooms() {
        let observable = new Observable<any>(observer => {
            this.socket.on('set-users-rooms', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }
    getRoom() {
        let observable = new Observable<any>(observer => {
            this.socket.on('room-joined', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    getMessages() {
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

    getWriter() {
        let observable = new Observable<any>(observer => {
            this.socket.on('set-writer', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }
}