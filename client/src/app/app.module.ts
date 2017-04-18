import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header';
import { FooterComponent } from './footer';
import { HomeModule } from './home';
import { SignupModule } from './signup';
import { ProfileModule } from './profile';
import {ChatModule} from './chat';
import { ErrorModule } from './error';
import { ApiService, UserService, JwtService, AuthGuard, NoAuthGuard } from './services';
import { ShowAuthDirective } from './directives';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([], { useHash: true });

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    HomeModule,
    rootRouting,
    SignupModule,
    ProfileModule,
    ChatModule,
    ErrorModule
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
    NoAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
