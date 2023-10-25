import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SharedModule} from '@shared/shared.module';
import {LayoutComponent} from '@views/layout/layout.component';

import {HeaderComponent} from './layout/header/header.component';
import {MainComponent} from './main/main.component';

@NgModule({
  declarations: [LayoutComponent, MainComponent, HeaderComponent],
  imports: [CommonModule, RouterModule, SharedModule, NgOptimizedImage],
})
export class ViewsModule {}
