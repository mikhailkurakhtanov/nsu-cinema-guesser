import {NgModule} from '@angular/core';
import {MaterialModule} from './modules/material/material.module';

@NgModule({
  imports: [MaterialModule],
  exports: [MaterialModule],
})
export class SharedModule {}
