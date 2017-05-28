import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { NoAuthGuard } from '../services';
const homeRouting: ModuleWithProviders = RouterModule.forChild([
    {
        path: '',
        component: HomeComponent,
        canActivate: [NoAuthGuard]

    }, {
        path: 'auth/google/callback',
        component: HomeComponent,
        canActivate: [NoAuthGuard]

    }, {
        path: 'auth/facebook/callback',
        component: HomeComponent,
        canActivate: [NoAuthGuard]
    }
]);

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        homeRouting
    ],
    declarations: [
        HomeComponent
    ],
    providers: []
})
export class HomeModule { }
