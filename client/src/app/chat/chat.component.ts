import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { User, Chat } from '../models';
import { UserService, ApiService, ChatService, SocketSerivce } from '../services';
import { environment } from '../../environments/environment';
import { ChatDialog } from './chat-dialog/chat-dialog.component';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroll') private chatDiv: ElementRef;
  private showPanel: string = null;
  private content: string = "";
  private message: Chat;
  private user: User = new User();
  private markers: Array<User> = [];
  private friends: Array<User> = [];
  private iconUrl: string;
  private zoom: number = 15;
  private socket: any;
  private writer: any;
  private writerName: string;

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private chatService: ChatService,
    private socketSerivce: SocketSerivce,
    private dialogService: DialogService
  ) {
  }

  ngOnInit() {
    (<any>Object).assign(this.user, this.userService.getCurrentUser());
    this.iconUrl = this.user.iconUrl = `${environment.google_image_path}${this.user.username}.jpg`;
    this.initUserLocationOnMap();
    this.getAllUsers();
    this.socket = this.socketSerivce.getMessages().subscribe(message => {
      this.message.messages.push(message);
    });
    this.writer = this.socketSerivce.getWriter().subscribe(data => {
      this.writerName = data.username;
      setTimeout(() => {
        this.writerName = null;
      }, 5000);
    });
  }
  ngAfterViewChecked() {
    this.scrollChatDiv();
  }
  ngOnDestroy() {
    this.socket.unsubscribe();
    this.writer.unsubscribe();
  }
  private initiateChatDialog(sender) {
    this.showPanel = null;
    this.dialogService.addDialog(ChatDialog, { sender: sender, userId: this.user._id }, { closeByClickingOutside: true });
  }
  private initUserLocationOnMap() {
    const self = this;
    navigator.geolocation.getCurrentPosition(function (position) {
      self.user.latitude = position.coords.latitude;
      self.user.longitude = position.coords.longitude;
      self.updateUserLocation();
    });
  }
  private getAllUsers() {
    this.apiService.get('/users').subscribe(users => {
      this.friends = this.cloneArray(users.users);
      this.markers = this.cloneArray(users.users);
      this.markers.push(this.user);
    }, err => console.log(err));
  }

  private sendMessage(ev, sender) {
    ev.preventDefault();

    if (this.message) {
      if (this.content.length > 0)
        this.updateMessageInRoom(sender);
    } else {
      if (this.content.length > 0)
        this.createNewRoom(sender);
    }
  }
  private updateUserLocation() {
    this.userService.updateUser(this.user);
  }

  private updateMessageInRoom(sender) {
    this.message.messages.push({
      receiver: this.user._id,
      content: this.content,
      sender
    });
    let query = {
      connection: this.message.connection,
      content: this.content,
      receiver: this.user._id,
      sender
    }
    this.socketSerivce.sendMessage(query);
    this.chatService.update(query).subscribe(data => {
      this.content = "";
    }, err => console.log(err));
  }

  private createNewRoom(sender) {
    let query = { sender, content: this.content };
    this.chatService.create(query).subscribe(data => {
      this.message = data;
      this.content = "";
    }, err => console.log(err));
  }
  //show hide panel
  private mainLiClick(userId) {
    if (this.showPanel === userId) {
      this.showPanel = null
    } else {
      if (userId !== this.user._id) {
        this.chatService.get(userId).subscribe(data => {
          this.message = data;
          if (this.message) {
            this.socketSerivce.joinRoom({ connection: data.connection, username: this.user.username });
          }
          this.showPanel = userId;
        }, err => console.log(err));
      } else {
        this.showPanel = userId;
      }
    }
  }
  private onKeyUp(ev) {
    if (this.message) {
      const writer = {
        connection: this.message.connection,
        username: this.user.username
      }
      this.socketSerivce.setWriter(writer);
    }
    if (ev.keyCode === 13 && this.message) {
      const writer = {
        connection: this.message.connection,
        username: null
      }
      this.socketSerivce.setWriter(writer);
    }
  }

  // deep clone of an array
  private cloneArray(source) {
    let target = [];
    for (let obj of source) {
      obj['iconUrl'] = `${environment.google_image_path}${obj.username}.jpg`
      target.push((<any>Object).assign({}, obj));
    }
    return target;
  }
  private scrollChatDiv(): void {
    try {
      this.chatDiv.nativeElement.scrollTop = this.chatDiv.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
