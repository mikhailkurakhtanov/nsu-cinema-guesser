import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {GameRoutingModule} from '@features/game/game-routing.module';
import {GameComponent} from '@features/game/game.component';
import {GameService} from '@features/game/services/game.service';
import {SharedModule} from '@shared/shared.module';
import { GameParamLocalizePipe } from './pipes/game-param-localize.pipe';

@NgModule({
  declarations: [GameComponent, GameParamLocalizePipe],
  imports: [CommonModule, GameRoutingModule, SharedModule],
  providers: [GameService],
})
export class GameModule {}
