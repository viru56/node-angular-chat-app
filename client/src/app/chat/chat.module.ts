import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { ChatDialog } from './chat-dialog/chat-dialog.component';
// google map module
import { AgmCoreModule } from 'angular2-google-maps/core';

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
        BootstrapModalModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBkCrRk81jIwnUfMooaAMF70_6XR3Ha0w4'
        })
    ],
    declarations: [ChatComponent, ChatDialog],
    entryComponents: [ ChatDialog ],
    providers: []
})
export class ChatModule { }

