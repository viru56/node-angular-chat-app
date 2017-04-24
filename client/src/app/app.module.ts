import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header';
import { FooterComponent } from './footer';
import { HomeModule } from './home';
import { SignupModule } from './signup';
import { ProfileModule } from './profile';
import { ChatModule } from './chat';
import { ErrorModule } from './error';
import { ShowAuthDirective } from './directives';
import {
  ApiService,
  UserService,
  JwtService,
  AuthGuard,
  NoAuthGuard,
  ChatService,
  SocketSerivce
} from './services';

import { ToastModule } from 'ng2-toastr';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([], { useHash: false });

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HomeModule,
    rootRouting,
    SignupModule,
    ProfileModule,
    ChatModule,
    ErrorModule,
    ToastModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ShowAuthDirective
  ],
  providers: [
    ApiService,
    UserService,
    JwtService,
    AuthGuard,
    NoAuthGuard,
    ChatService,
    SocketSerivce
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
