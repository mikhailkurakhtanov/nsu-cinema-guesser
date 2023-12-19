import {inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CanDeactivateFn} from '@angular/router';

import {GameComponent} from '@features/game/game.component';

export const gameGuard: CanDeactivateFn<GameComponent> = (component, routerState) => {
  const snackBar: MatSnackBar = inject(MatSnackBar);

  if (component.alive) {
    snackBar.open('Необходимо завершить текущую игру');
    return false;
  } else return true;
};
