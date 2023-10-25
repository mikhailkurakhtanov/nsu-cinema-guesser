import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {AuthService} from '@core/services/auth/auth.service';
import {NgOnDestroy} from '@core/services/ng-on-destroy/ng-on-destroy.service';

@NgModule({
  providers: [AuthService, NgOnDestroy],
  imports: [CommonModule],
})
export class CoreModule {}
