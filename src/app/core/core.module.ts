import {NgModule} from '@angular/core';

import {LocalStorageService} from '@core/services/local-storage.service';
import {NgOnDestroy} from '@core/services/ng-on-destroy.service';
import {WebPageService} from '@core/services/web-page.service';

@NgModule({
  providers: [WebPageService, NgOnDestroy, LocalStorageService],
})
export class CoreModule {}
