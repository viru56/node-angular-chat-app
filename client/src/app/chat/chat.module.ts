import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';

import { ChatDialog } from './chat-dialog/chat-dialog.component';
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
        ReactiveFormsModule,
        BootstrapModalModule
    ],
    declarations: [ChatComponent, ChatDialog],
    entryComponents: [ ChatDialog ],
    providers: []
})
export class ChatModule { }

