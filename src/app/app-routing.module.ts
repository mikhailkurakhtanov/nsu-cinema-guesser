import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {authGuard} from '@core/guards/auth.guard';
import {ChangePasswordComponent} from '@features/auth/components/change-password/change-password.component';
import {LoginComponent} from '@features/auth/components/login/login.component';
import {RegisterComponent} from '@features/auth/components/register/register.component';
import {LayoutComponent} from '@features/layout/layout.component';
import {MainComponent} from '@features/main/main.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: MainComponent,
      },
    ],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
