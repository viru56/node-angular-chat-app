import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';
import { Message } from '../models';
export class SocketSerivce {
    private socket;
    constructor() {
        this.socket = io(environment.base_url);
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
    getMessages() {
        let observable = new Observable<Message>(observer => {
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