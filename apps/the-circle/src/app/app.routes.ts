import { Route } from '@angular/router';
import { StartscreenComponent } from '../lib/startscreen/startscreen';
import { LoginComponent } from '../lib/login/login';
import { ChatboxComponent } from '../lib/chatbox/chatbox';

export const appRoutes: Route[] = [
    {path: '', component: StartscreenComponent},
    {path: 'login', component: LoginComponent},
    {path: 'chat', component: ChatboxComponent}
];
