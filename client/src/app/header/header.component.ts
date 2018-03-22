import { Component, OnInit } from '@angular/core';

import { UserService } from '../services';
import { User } from '../models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: User = new User();
  showHeader = false;
  logo = '/src/assets/images/logo.png';
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser.username) {
        this.showHeader = true;
      } else {
        this.showHeader = false;
      }
    });
  }
  openUserModal() {
    // open user upadate modal
  }

}
