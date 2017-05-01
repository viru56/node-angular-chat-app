import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ApiService } from './api.service';
import { Chat } from '../models';

@Injectable()
export class ChatService {
    constructor(
        private apiService: ApiService,
    ) { }

    get(receiver: string): Observable<Chat> {
        return this.apiService.get('/chat/' + receiver)
            .map((data) => {
                return data.data
            });
    }

    update(chat: any): Observable<string> {
        return this.apiService.put('/chat', { chat })
            .map(data => {
                return data;
            });
    }

    create(chat: any): Observable<Chat> {
        return this.apiService.post('/chat', { chat })
            .map(data => {
                return data.data;
            });
    }


}
