import {NgModule} from '@angular/core';

import {AuthModule} from '@features/auth/auth.module';
import {HeaderComponent} from '@features/layout/header/header.component';
import {LayoutComponent} from '@features/layout/layout.component';
import {MainComponent} from '@features/main/main.component';
import {SharedModule} from '@shared/shared.module';

@NgModule({
  declarations: [LayoutComponent, MainComponent, HeaderComponent],
  imports: [AuthModule, SharedModule],
})
export class FeaturesModule {}
