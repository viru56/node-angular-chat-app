import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { User, Chat, Room } from '../models';
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
  private messages: Array<Chat> = [];
  private room: Room = new Room();
  private rooms: Array<Room> = [];
  private user: User = new User();
  private markers: Array<User> = [];
  private friends: Array<User> = [];
  private iconUrl: string;
  private zoom: number = 15;
  private writerName: string;
  private socketSubscribe: any;
  private writerSubscribe: any;
  private roomSubscribe: any;
  private findAllUsersRoomsSubscribe: any;

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
    this.socketSerivce.initSocket(this.user._id);
    this.iconUrl = this.user.iconUrl = `${environment.google_image_path}${this.user.username}.jpg`;
    this.initUserLocationOnMap();
    // this.getAllUsers();
    this.socketSerivce.getAllUsersRooms(this.user._id);
    this.socketSubscribe = this.socketSerivce.getMessages().subscribe(data => {
      this.messages.push(data.message);
      this.rooms = data.rooms;
      this.updateNotification();
    });

    this.writerSubscribe = this.socketSerivce.getWriter().subscribe(data => {
      this.writerName = data.username;
      setTimeout(() => {
        this.writerName = null;
      }, 10000);
    });

    this.roomSubscribe = this.socketSerivce.getRoom().subscribe(data => {
      this.room = data.room;
      this.messages = data.messages;
      this.socketSerivce.updateRoom({connection: this.room.connection,sender: this.showPanel});      
    });

    this.findAllUsersRoomsSubscribe = this.socketSerivce.setAllUsersRooms().subscribe((data) => {
      this.friends = this.cloneArray(data.users);
      this.markers = this.cloneArray(data.users);
      this.markers.push(this.user);
      this.rooms = data.rooms;
      this.updateNotification();
    });
  }
  ngAfterViewChecked() {
    this.scrollChatDiv();
  }
  ngOnDestroy() {
    this.socketSubscribe.unsubscribe();
    this.writerSubscribe.unsubscribe();
    this.roomSubscribe.unsubscribe();
    this.findAllUsersRoomsSubscribe.unsubscribe();
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

  private updateUserLocation() {
    this.userService.updateUser(this.user);
  }

  private sendMessage(ev, receiver) {
    ev.preventDefault();
    if (this.content.length > 0) {
      const query = {
        connection: this.room.connection,
        sender: this.user._id,
        receiver: receiver,
        content: this.content
      }
      this.socketSerivce.sendMessage(query);
      this.messages.push(query);
      this.content = '';
    }
  }
  //show hide panel
  private mainLiClick(friend) {
    if (this.showPanel === friend._id) {
      this.showPanel = null
    } else {
      friend.unreadMessage = 0;
      const secondUser = this.room.connection && this.room.connection.split('-')[1];
      if (friend._id !== this.user._id && secondUser !== friend._id) {
        this.socketSerivce.joinRoom({
          sender: this.user._id,
          receiver: friend._id,
          username: this.user.username
        });
        this.showPanel = friend._id;
      } else {
        this.showPanel = friend._id;
      }
    }
  }
  private onKeyUp(ev) {
    if (this.messages.length > 0) {
      const writer = {
        connection: this.messages[0].connection,
        username: this.user.username
      }
      this.socketSerivce.setWriter(writer);
    }
    if (ev.keyCode === 13 && this.messages.length > 0) {
      const writer = {
        connection: this.messages[0].connection,
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
  private updateNotification() {
    for (let room of this.rooms) {
      for (let receiver of room.receivers) {
        for (let friend of this.friends) {
          if (receiver._id === friend._id && this.showPanel !== friend._id) {
            friend.unreadMessage = receiver.unreadMessage;
          }
        }
      }
    }
  }
}