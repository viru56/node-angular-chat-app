import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './profile.component';
import { AuthGuard } from '../services';
const profileRouting: ModuleWithProviders = RouterModule.forChild([
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
    }
]);

@NgModule({
    imports: [
        profileRouting,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [ProfileComponent],
    providers: []
})
export class ProfileModule { }
