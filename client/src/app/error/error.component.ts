import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router'

// import { UserService } from '../services';
// import { environment } from '../../environments/environment';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  images: Array<string> = [
    '/src/assets/images/404_2.jpg',
    '/src/assets/images/404_1.jpg',
    '/src/assets/images/404.jpg'
  ];
  private routeSubscribe: any;
  constructor(
   // private route: ActivatedRoute,
   // private userService: UserService
  ) { }

  ngOnInit() {
    // let callbackUrl = ''
    // console.log(this.route.url);
    // this.route.url.subscribe((data) => {
    //   console.log(data);
    //   data.map((d) => {
    //     callbackUrl += `/${d.path}`
    //   });
    // })
    // if (callbackUrl === '/auth/google/callback') {
    //   //  window.location.href = `${environment.api_url}/${callbackUrl}${window.location.search}`;
    //   // this.apiService.get(`${callbackUrl}/${window.location.search}`).subscribe((data) => {
    //   //  this.userService.setAuth(data);
    //   // })
    //   this.userService.googleCalllback(`${callbackUrl}/${window.location.search}`);
    // }
  }


}
