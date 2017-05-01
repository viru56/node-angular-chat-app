import { Component, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

import { Chat, User } from '../../models';
import { ChatService } from '../../services';
export interface ChatDialog {
    title: string,
    sender: User,
    userId: string
}
@Component({
    selector: 'app-chatDialog',
    styleUrls: ['./chat-dialog.component.css'],
    templateUrl: './chat-dialog.component.html'
})
export class ChatDialog extends DialogComponent<ChatDialog, null> {
    @ViewChild('scroll') private chatDiv: ElementRef;
    title: string;
    content: string;
    sender: User;
    userId: string;
    private message: Chat;
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
    private getConversation() {
        this.chatService.get(this.sender._id).subscribe(data => {
            console.log(data);
            this.message = data;
        }, err => console.log(err));
    }

    private sendMessage(ev) {
        ev.preventDefault();

        if (this.message) {
            if (this.content.length > 0)
                this.updateMessageInRoom();
        } else {
            if (this.content.length > 0)
                this.createNewRoom();
        }
    }

    private updateMessageInRoom() {
        this.message.messages.push({
            receiver: this.userId,
            content: this.content,
            sender: this.sender._id
        });
        let query = {
            connection: this.message.connection,
            content: this.content,
            sender: this.sender._id
        }
        this.chatService.update(query).subscribe(data => {
            this.content = "";
        }, err => console.log(err));
    }

    private createNewRoom() {
        let query = { sender: this.sender._id, content: this.content };
        this.chatService.create(query).subscribe(data => {
            this.message = data;
            this.content = "";
        }, err => console.log(err));
    }
    private scrollChatDiv(): void {
        try {
            this.chatDiv.nativeElement.scrollTop = this.chatDiv.nativeElement.scrollHeight;
        } catch (err) { }
    }
}
