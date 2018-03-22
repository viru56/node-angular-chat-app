import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

import { Chat, User } from '../../models';
import { ChatService } from '../../services';
export interface ChatDialog {
    title: string,
    sender: User,
    userId: string
}
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'app-chatDialog',
    styleUrls: ['./chat-dialog.component.css'],
    templateUrl: './chat-dialog.component.html'
})
// tslint:disable-next-line:component-class-suffix
export class ChatDialog extends DialogComponent<ChatDialog, null> implements OnInit, AfterViewChecked {
    @ViewChild('scroll') chatDiv: ElementRef;
    title: string;
    content: string;
    sender: User;
    userId: string;
    message: Array<Chat> = [];
    constructor(
        dialogService: DialogService,
        private chatService: ChatService,
    ) {
        super(dialogService);
    }
    ngOnInit() {
        console.log(this.sender._id, this.userId);
        this.getConversation();
    }
    ngAfterViewChecked() {
        this.scrollChatDiv();
    }
    getConversation() {
        this.chatService.get(this.sender._id).subscribe(data => {
            console.log(data);
            this.message.push(data);
        }, err => console.log(err));
    }

    sendMessage(ev) {
        ev.preventDefault();

        if (this.message.length > 0) {
            if (this.content.length > 0) {
                this.createNewRoom();
            }
        }
    }


    createNewRoom() {
        const query = { sender: this.sender._id, content: this.content };
        this.chatService.create(query).subscribe(data => {
            this.message.push(data);
            this.content = '';
        }, err => console.log(err));
    }
    scrollChatDiv(): void {
        try {
            this.chatDiv.nativeElement.scrollTop = this.chatDiv.nativeElement.scrollHeight;
        } catch (err) { }
    }
}
