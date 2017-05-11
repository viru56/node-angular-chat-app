import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  placeholder: String = '';
  title: String = '';
  authType: String = '';
  errorList: Array<string>;
  authForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.initForm();
  }
  initForm() {
    this.authForm = this.formBuilder.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }
  ngOnInit() {
    this.route.url.subscribe(data => {
      this.authType = data[data.length - 1].path;
      console.log(this.authType);
      this.title = (this.authType === 'login') ? 'Sign In ' : 'Sign Up';
      this.placeholder = (this.authType === 'login') ? 'Email or Username' : 'Email';
      if (this.authType === 'register') {
        this.authForm.addControl('username', new FormControl('', Validators.required));
      }
    });
  }
  submitForm() {
    this.errorList = [];
    const user = this.authForm.value;
    this.userService.attemptAuth(this.authType, user)
      .subscribe(data => {
        console.log(data);
        this.router.navigateByUrl('/chat');
      }, err => {
        const errors = err.errors;
        for (const field in errors) {
          if (errors.hasOwnProperty(field)) {
            this.errorList.push(`${field} ${errors[field]}`);
          }
        }
      });
  }
  loginWithGoogle() {
    this.userService.googleLogin();
  }
  loginWithFacebook(){
    this.userService.facebookLogin();
  }

}
