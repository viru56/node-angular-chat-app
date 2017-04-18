import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChatComponent } from './chat.component';
import { AuthGuard } from '../services';

const chatRouting: ModuleWithProviders = RouterModule.forChild([
    {
        path: 'chat',
        component: ChatComponent,
        canActivate: [AuthGuard]
    }
]);

@NgModule({
    imports: [
        chatRouting,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [ChatComponent],
    providers: []
})
export class ChatModule { }

