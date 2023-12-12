import {Pipe, PipeTransform} from '@angular/core';

import {GameParameterType} from '@features/game/models/game.model';

@Pipe({
  name: 'gameParamLocalize',
})
export class GameParamLocalizePipe implements PipeTransform {
  transform(parameterType: GameParameterType): string {
    switch (parameterType) {
      case GameParameterType.ACTOR:
        return 'Актер';
      case GameParameterType.COUNTRIES:
        return 'Страна';
      case GameParameterType.DIRECTOR:
        return 'Режисер';
      case GameParameterType.GENRE:
        return 'Жанр';
      case GameParameterType.IMAGES:
        return 'Изображение';
      case GameParameterType.KEYWORD:
        return 'Ключевые слова';
      case GameParameterType.RATING:
        return 'Рейтинг';
      case GameParameterType.YEARS:
        return 'Годы';
    }
  }
}
