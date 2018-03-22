import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { UserService, ApiService } from '../services';
import { User } from '../models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User = new User();
  profileForm: FormGroup;
  errorList: Array<string>;
  constructor(
    private toastr: ToastsManager,
    private vRef: ViewContainerRef,
    private router: Router,
    private userService: UserService,
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.toastr.setRootViewContainerRef(vRef);
    this.initForm();
  }
  ngOnInit() {
    if (Object.keys(this.userService.getCurrentUser()).length === 0) {
      this.apiService.get('/user').subscribe(data => {
        this.updateUser(data.user);
      });
    } else {
      this.updateUser(this.userService.getCurrentUser());
    }
  }
  initForm() {
    this.profileForm = this.formBuilder.group({
      username: '',
      email: '',
      image: '',
      phone: '',
      password: '',
      displayName: ''
    });
  }
  updateUser(values: Object) {
    (<any>Object).assign(this.user, values);
    this.profileForm.patchValue(this.user);
  }
  submitForm() {
    this.errorList = [];
    this.updateUser(this.profileForm.value);
    for (const u in this.user) {
      if (this.user.hasOwnProperty(u) && this.user[u] === '') {
        delete this.user[u];
      }
    }
    this.userService.updateUser(this.user).subscribe(updatedUser => {
      this.updateUser(updatedUser);
      this.toastr.success('Information updated!', '', { showCloseButton: true });
    }, err => {
      const errors = err.errors;
      for (const field in errors) {
        if (errors.hasOwnProperty(field)) {
          this.errorList.push(`${field} ${errors[field]}`);
        }
      }
    });
  }
  logout() {
    this.userService.clearAuth();
    this.router.navigateByUrl('/');
  }
}
