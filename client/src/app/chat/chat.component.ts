import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { User, Chat, Room } from '../models';
import { UserService, ApiService, ChatService, SocketSerivce, MapService } from '../services';
import { environment } from '../../environments/environment';
import { ChatDialog } from './chat-dialog/chat-dialog.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroll') private chatDiv: ElementRef;
  @ViewChild('map') private mapElement: ElementRef;
  @ViewChild('pano') private panoElement: ElementRef;
  
  private showPanel: string = null;
  private content: string = "";
  private showList: boolean = true;
  private panelHeading: string = "Friends";
  private messages: Array<Chat> = [];
  private user: User = new User();
  private room: Room = new Room();
  private markers: Array<User> = [];
  private friends: Array<User> = [];
  // private iconUrl: string;
  private writerName: string;
  private getMessageSubscribe: any;
  private writerSubscribe: any;
  private findAllUsersSubscribe: any;
  private userJoinLeftSubscribe: any;
  private setChatHistorySubscribe: any;
  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private chatService: ChatService,
    private socketSerivce: SocketSerivce,
    private dialogService: DialogService,
    private mapService: MapService
  ) {
  }

  ngOnInit() {
    (<any>Object).assign(this.user, this.userService.getCurrentUser());
    this.socketSerivce.initSocket(this.user);
    this.socketSerivce.getAllUsers(this.user._id);
    // initilize map
    this.mapService.initMap(this.mapElement.nativeElement,this.panoElement.nativeElement);

    // get Lat and long of user and update his/her location
    this.mapService.getUserLocation((latlng) => {
      this.user.latitude = latlng.latitude;
      this.user.longitude = latlng.longitude;
      this.updateUserLocation();
    });
    this.user.iconUrl = this.user.image ? `${environment.google_image_path}${this.user.username}.jpg` : `${environment.google_image_path}default.jpg`;
    // this.getAllUsers();
    this.getMessageSubscribe = this.socketSerivce.getMessage().subscribe(data => {
      this.room = data.room;
      this.messages.push(data.doc);
      this.writerName = null;
      this.updateNotification();
    });
    this.setChatHistorySubscribe = this.socketSerivce.setChatHistory().subscribe((messages) => {
      this.messages = messages;
    });
    this.writerSubscribe = this.socketSerivce.getWriter().subscribe(writerName => {
      this.writerName = writerName;
      setTimeout(() => {
        this.writerName = null;
      }, 3000);
    });


    this.findAllUsersSubscribe = this.socketSerivce.setAllUsers().subscribe((users) => {
      this.friends = this.cloneArray(users);
      this.markers = this.cloneArray(users);
      this.markers.push(this.user);
      this.userService.UsersSubject.next(this.markers);
      this.mapService.setMarker(this.markers);
    });
    this.userJoinLeftSubscribe = this.socketSerivce.userJoinLeft().subscribe((user) => {
      const length = this.friends.length;
      if (user._id != this.user._id) {
        for (let i = 0; i < length; i++) {
          if (this.friends[i]._id == user._id) {
            user['iconUrl'] = user.image ? `${environment.google_image_path}${user.username}.jpg` : `${environment.google_image_path}default.jpg`;
            user.unreadMessage = this.friends[i].unreadMessage;
            this.friends[i] = user;
            break;
          }
        }
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollChatDiv();
  }

  // on destroy view unsubscribe all observer
  ngOnDestroy() {
    this.getMessageSubscribe.unsubscribe();
    this.findAllUsersSubscribe.unsubscribe();
    this.writerSubscribe.unsubscribe();
    this.userJoinLeftSubscribe.unsubscribe();
    this.setChatHistorySubscribe.unsubscribe();
  }

  private updateUserLocation() {
    this.socketSerivce.initSocket(this.user);
    this.socketSerivce.getAllUsers(this.user._id);
  }

  //show hide panel
  private mainLiClick(receiver) {
    if (this.showPanel === receiver._id) {
      this.showPanel = null
    } else {
      if (receiver._id != this.user._id) {
        this.socketSerivce.getChatHistory(this.user._id);
        this.showPanel = receiver._id;
        if (receiver.unreadMessage !== 0) {
          this.socketSerivce.updateUnreadMessageToZero(receiver.connection);
          receiver.unreadMessage = 0;
        }
      }
      this.showPanel = receiver._id;
    }
  }
  private onKeyUp(ev, frnd) {
    const keyCode = ev.which || ev.keyCode;
    if (keyCode !== 13 && this.content.trim().length > 0) {
      const writer = {
        socketId: frnd.socketId,
        writerName: this.user.username
      }
      this.socketSerivce.setWriter(writer);
    }
    if (keyCode === 13 && this.content.trim().length > 0) {
      const query = {
        sender: this.user._id,
        receiver: frnd._id,
        socketId: frnd.socketId,
        content: this.content.trim()
      }
      this.socketSerivce.sendMessage(query);
      this.messages.push(query);
      this.content = '';
    }
  }

  // deep clone of an array
  private cloneArray(source) {
    let target = [];
    for (let obj of source) {
      obj['iconUrl'] = obj.image ? `${environment.google_image_path}${obj.username}.jpg` : `${environment.google_image_path}default.jpg`;
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
    if (this.showPanel !== this.room.sender) {
      for (let fr of this.friends) {
        if (this.room.sender == fr._id) {
          fr.unreadMessage = this.room.unreadMessage;
          fr.connection = this.room.connection;
          break;
        }
      }
    } else {
      // update room unreadMessage to 0
      this.socketSerivce.updateUnreadMessageToZero(this.room.connection);
    }
  }
  private showUserList() {
    this.showList = !this.showList;
  }
  private showChatPanel(panel){
    this.showList = true;
    this.panelHeading = panel;
  }

  // open chat dialog om dblClick

  private initiateChatDialog(sender) {
    this.showPanel = null;
    this.dialogService.addDialog(ChatDialog, { sender: sender, userId: this.user._id }, { closeByClickingOutside: true });
  }

}