import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SignupComponent } from './signup.component';
import { NoAuthGuard } from '../services';

const authRouting: ModuleWithProviders = RouterModule.forChild([{
    path: 'login',
    component: SignupComponent,
    canActivate: [NoAuthGuard]
}, {
    path: 'register',
    component: SignupComponent,
    canActivate: [NoAuthGuard]
}
]);

@NgModule({
    imports: [
        authRouting,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [SignupComponent],
    providers: []
})

export class SignupModule { }
