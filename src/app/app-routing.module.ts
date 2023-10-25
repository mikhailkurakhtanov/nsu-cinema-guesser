import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {authGuard} from '@core/guards/auth.guard';
import {LayoutComponent} from '@views/layout/layout.component';
import {LoginComponent} from '@views/login/login.component';
import {MainComponent} from '@views/main/main.component';

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
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
