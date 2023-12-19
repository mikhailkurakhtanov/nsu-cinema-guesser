import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {authGuard} from '@core/guards/auth.guard';
import {GameComponent} from '@features/game/game.component';
import {gameGuard} from '@features/game/guards/game.guard';

const routes: Routes = [
  {
    path: '',
    component: GameComponent,
    canActivate: [authGuard],
    canDeactivate: [gameGuard],
  },
  {
    path: ':mode',
    component: GameComponent,
    canActivate: [authGuard],
    canDeactivate: [gameGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
