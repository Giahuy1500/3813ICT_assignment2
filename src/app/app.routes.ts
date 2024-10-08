import { Routes } from '@angular/router';
import { LoginComponent } from './front-end/login/login.component';
import { HomeComponent } from './front-end/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'groups',
        loadComponent: () =>
          import('../app/front-end/groups/groups.component').then(
            (m) => m.GroupsComponent
          ),
      },
      {
        path: 'create-user',
        loadComponent: () =>
          import('../app/create-user/create-user.component').then(
            (m) => m.CreateUserComponent
          ),
      },
    ],
  },
];
