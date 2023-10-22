import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
  exports: [MatToolbarModule, MatButtonModule, MatInputModule, MatCardModule, MatMenuModule],
})
export class MaterialModule {}
