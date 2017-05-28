import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../services';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private loginForm: FormGroup;
  private registerForm: FormGroup;
  private demoImg: string = '/src/assets/images/demo.png';
  private error: string = null;
  private formError: string = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.initLoginForm();
    this.initRegisterForm();
    let callbackUrl = '';
    this.route.url.subscribe((data) => {
      data.map((d) => {
        callbackUrl += `/${d.path}`
      });
    })
    if (callbackUrl === '/auth/google/callback') {
      this.userService.socialCalllback(`${callbackUrl}/${window.location.search}`);
    }
    if (callbackUrl === '/auth/facebook/callback') {
      this.userService.socialCalllback(`${callbackUrl}/${window.location.search}`);
    }
  }
  private initLoginForm() {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }
  private initRegisterForm() {
    const EMAILRegx = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    const OnlyNumberRegx = /^[0-9]{10}$/;
    const OnlyAlphaNumericRegx = /^[^-\s][\w\s]{2,100}$/;
    const OnlyAlphaNumericNospaceRegx = /^[a-z0-9]{4,20}$/i;
    this.registerForm = this.formBuilder.group({
      'displayName': [null, Validators.compose([Validators.required, Validators.pattern(OnlyAlphaNumericRegx)])],
      'email': [null, Validators.compose([Validators.required, Validators.pattern(EMAILRegx)])],
      'username': [null, Validators.compose([Validators.required, Validators.pattern(OnlyAlphaNumericNospaceRegx)])],
      'phone': [null, Validators.compose([Validators.pattern(OnlyNumberRegx)])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(16)])]
    });
  }
  private login() {
    this.error = null;
    const user = this.loginForm.value;
    if (user.email.trim() === "") {
      this.error = "email or username can't be blank";
      return;
    }
    if (user.password.trim() === "") {
      this.error = "password can't be blank";
      return;
    }
    this.userService.login(user)
      .subscribe(data => {
        console.log(data);
        this.router.navigateByUrl('/chat');
      }, err => {
        console.log(err);
        this.error = `${Object.keys(err.errors)[0]} ${err.errors[Object.keys(err.errors)[0]]}`;
      });

  }
  private createNewUser() {
    this.formError = null;
    this.userService.createUser(this.registerForm.value).subscribe(data => {
      console.log(data);
      this.router.navigateByUrl('/chat');
    }, err => {
      console.log(err);
      this.formError = `${Object.keys(err.errors)[0]} ${err.errors[Object.keys(err.errors)[0]]}`;
    })
  }
  private loginWithGoogle() {
    this.userService.googleLogin();
  }
  private loginWithFacebook(){
    this.userService.facebookLogin();
  }
}
