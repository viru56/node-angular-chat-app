import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ErrorComponent } from './error.component';

const errorRouting: ModuleWithProviders = RouterModule.forChild([
    {
        path: '**',
        component: ErrorComponent
    }
]);

@NgModule({
    imports: [
        errorRouting
    ],
    declarations: [ErrorComponent],
    providers: []
})
export class ErrorModule { }

