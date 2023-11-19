import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {CoreModule} from '@core/core.module';
import {FeaturesModule} from '@features/features.module';
import {SharedModule} from '@shared/shared.module';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, CoreModule, SharedModule, FeaturesModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
