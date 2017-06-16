import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';

@Injectable()
export class UserService {
    private currentUserSubject = new BehaviorSubject<User>(new User());
    public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

    private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();
    constructor(
        private http: Http,
        private apiService: ApiService,
        private router: Router,
        private jwtService: JwtService
    ) { }

    init() {
        if (this.jwtService.getToken()) {
            this.apiService.get('/user')
                .subscribe(
                data => {
                    this.setAuth(data.user);
                    this.router.navigateByUrl('/chat');
                },
                err => this.clearAuth()
                );
        } else {
            this.clearAuth();
        }
    }

    setAuth(user: User) {
        this.jwtService.saveToken(user.token);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
    }

    clearAuth() {
        this.jwtService.destroyToken();
        this.currentUserSubject.next(new User());
        this.isAuthenticatedSubject.next(false);
    }

    attemptAuth(path, user): Observable<User> {
        const route = (path === 'login') ? '/login' : '';
        return this.apiService.post(`/user${route}`, { user })
            .map(data => {
                this.setAuth(data.user);
                return data;
            });
    }
    login(user): Observable<User> {
        return this.apiService.post(`/user/login`, { user })
            .map(data => {
                this.setAuth(data.user);
                return data;
            });
    }
    createUser(user): Observable<User>{
        return this.apiService.post(`/user`, { user })
            .map(data => {
                this.setAuth(data.user);
                return data;
            });
    }
    updateUser(user): Observable<User> {
        return this.apiService
            .put('/user', { user })
            .map(data => {
                this.currentUserSubject.next(data.user);
                return data.user;
            });
    }
    // login with google
    googleLogin(): void {
        window.location.href = `${environment.api_url}/auth/google`;
    }
    // login with facebook
    facebookLogin() {
        window.location.href = `${environment.api_url}/auth/facebook`;
    }

    // google or facebook callback
    socialCalllback(path: string): void {
        this.apiService.get(path).subscribe((user: User) => {
            console.log(user);
            this.setAuth(user);
            this.router.navigateByUrl('/chat');
        });
    }

    getCurrentUser(): User {
        return this.currentUserSubject.value;
    }
}
