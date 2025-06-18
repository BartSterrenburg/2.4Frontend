import { Route } from '@angular/router';
import { StartscreenComponent } from '../lib/startscreen/startscreen';
import { LoginComponent } from '../lib/login/login';

export const appRoutes: Route[] = [
    {path: '', component: StartscreenComponent},
    {path: 'login', component: LoginComponent},
];
