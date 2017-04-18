import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}
