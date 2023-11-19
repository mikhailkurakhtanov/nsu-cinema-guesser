import {CommonModule, NgOptimizedImage} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '@shared/modules/material.module';

@NgModule({
  imports: [MaterialModule, NgOptimizedImage],
  exports: [CommonModule, MaterialModule, ReactiveFormsModule, HttpClientModule, RouterModule, NgOptimizedImage],
})
export class SharedModule {}
