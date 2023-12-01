import {NgModule} from '@angular/core';

import {ChangePasswordComponent} from '@features/auth/components/change-password/change-password.component';
import {LoginComponent} from '@features/auth/components/login/login.component';
import {RegisterComponent} from '@features/auth/components/register/register.component';
import {AuthService} from '@features/auth/services/auth.service';
import {SharedModule} from '@shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [LoginComponent, RegisterComponent, ChangePasswordComponent],
  providers: [AuthService],
})
export class AuthModule {}
