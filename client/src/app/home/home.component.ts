import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

import { UserService } from '../services';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    let callbackUrl = ''
    this.route.url.subscribe((data) => {
      data.map((d) => {
        callbackUrl += `/${d.path}`
      });
    })
    if (callbackUrl === '/auth/google/callback') {
      this.userService.socialCalllback(`${callbackUrl}/${window.location.search}`);
    }
    if(callbackUrl === '/auth/facebook/callback'){
       this.userService.socialCalllback(`${callbackUrl}/${window.location.search}`);
    }
  }

}
