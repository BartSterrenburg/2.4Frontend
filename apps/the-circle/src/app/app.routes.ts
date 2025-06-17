import { Route } from '@angular/router';
import { Startscreen } from '../lib/startscreen/startscreen';
import { LoginComponent } from '../lib/login/login';

export const appRoutes: Route[] = [
    {path: '', component: Startscreen},
    {path: 'login', component: LoginComponent},
];
