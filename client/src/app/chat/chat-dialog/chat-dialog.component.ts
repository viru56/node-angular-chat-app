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
    private message: Array<Chat> = [];
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
            this.message.push(data);
        }, err => console.log(err));
    }

    private sendMessage(ev) {
        ev.preventDefault();

        if (this.message.length > 0) {
            if (this.content.length > 0)
                this.createNewRoom();
        }
    }


    private createNewRoom() {
        let query = { sender: this.sender._id, content: this.content };
        this.chatService.create(query).subscribe(data => {
            this.message.push(data);
            this.content = "";
        }, err => console.log(err));
    }
    private scrollChatDiv(): void {
        try {
            this.chatDiv.nativeElement.scrollTop = this.chatDiv.nativeElement.scrollHeight;
        } catch (err) { }
    }
}
