import { Routes } from '@angular/router';
import { Students } from './components/students/students';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

export const routes: Routes = [
    {path: 'components/students', component: Students},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: '', redirectTo: 'register', pathMatch: 'full'},
];
