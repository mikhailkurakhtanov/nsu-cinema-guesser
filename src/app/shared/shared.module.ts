import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {MaterialModule} from '@shared/modules/material.module';

@NgModule({
  imports: [MaterialModule],
  exports: [MaterialModule, ReactiveFormsModule, HttpClientModule],
})
export class SharedModule {}
