import { Component, OnInit } from '@angular/core';

import { User } from '../models';
import { UserService, ApiService } from '../services';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private showPanel: string = null;
  private userInput: string = "";
  private userMessage: Array<string> = [];
  private user: User = new User();
  private markers: Array<User> = [];
  private users: Array<User> = [];
  private googleIconUrl: string;
  private zoom: number = 15;

  constructor(
    private userService: UserService,
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    (<any>Object).assign(this.user, this.userService.getCurrentUser());
    this.googleIconUrl = this.user.googleIconUrl = `${environment.google_image_path}${this.user.username}.jpg`;
    this.initUserLocationOnMap();
    this.getAllUsers();
  }

  initUserLocationOnMap() {
    const self = this;
    navigator.geolocation.getCurrentPosition(function (position) {
      self.user.latitude = position.coords.latitude;
      self.user.longitude = position.coords.longitude;
      self.updateUserLocation();
    });
  }
  getAllUsers() {
    this.apiService.get('/users').subscribe(users => {
      this.users = this.cloneArray(users.users);
      this.markers = this.cloneArray(users.users);
      this.markers.push(this.user);
    }, err => console.log(err));
  }
  sendMessage() {
    this.userMessage.push(this.userInput);
    this.userInput = "";
  }
  updateUserLocation() {
    this.userService.updateUser(this.user);
  }

  //show hide panel
  mainLiClick(userId) {
    this.showPanel === userId ? this.showPanel = null : this.showPanel = userId;
  }

  // deep clone of an array
  cloneArray(source) {
    let target = [];
    for (let obj of source) {
      obj['googleIconUrl'] = `${environment.google_image_path}${obj.username}.jpg`
      target.push((<any>Object).assign({}, obj));
    }
    return target;
  }
}
