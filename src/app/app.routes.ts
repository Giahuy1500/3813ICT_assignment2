import { Routes } from '@angular/router';
import { LoginComponent } from './front-end/login/login.component';
import { HomeComponent } from './front-end/home/home.component';
import { ChatComponent } from './front-end/chat/chat.component';
import { ChannelSelectionComponent } from './front-end/channel-selection/channel-selection.component';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: ChatComponent },
  {
    path: 'channel-selection',
    component: ChannelSelectionComponent,
  },
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
          import('../app/front-end/create-user/create-user.component').then(
            (m) => m.CreateUserComponent
          ),
      },
    ],
  },
];
