import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


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
         AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBkCrRk81jIwnUfMooaAMF70_6XR3Ha0w4'
    })
    ],
    declarations: [ChatComponent],
    providers: []
})
export class ChatModule { }

