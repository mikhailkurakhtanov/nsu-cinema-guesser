import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';

import {constants} from '@shared/constants';

export const snackbarDefaultConfig: MatSnackBarConfig = {
  duration: constants.defaultSnackBarDuration,
  verticalPosition: 'bottom',
  horizontalPosition: 'center',
};

@NgModule({
  providers: [{provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: snackbarDefaultConfig}],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatTooltipModule,
  ],
})
export class MaterialModule {}
