import {ChangeDetectorRef, Component, OnDestroy, OnInit, Self} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, switchMap, takeUntil} from 'rxjs';

import {NgOnDestroy} from '@core/services/ng-on-destroy.service';
import {GameParameterType, GameRound} from '@features/game/models/game.model';
import {GameService} from '@features/game/services/game.service';
import {AppPath} from '@shared/enums/app-path.enum';
import {LevelType} from '@shared/enums/level-type.enum';

@Component({
  selector: 'cinema-guesser-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [NgOnDestroy],
})
export class GameComponent implements OnInit, OnDestroy {
  roundInfo!: GameRound;

  availableParams: GameParameterType[] = [];
  usedParams: GameParameterType[] = [];

  alive = false;
  selectedAnswer = '';
  imageSrc = '';
  totalScore = 0;
  currentRound = 1;
  gameIsLoaded = false;
  receivedTextParams: string[] = [];

  private levelType!: LevelType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private gameService: GameService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Self() private destroy: NgOnDestroy,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroy)).subscribe(params => {
      this.levelType = params.get('mode') as LevelType;

      if (!this.levelType) {
        this.router.navigate([`${AppPath.GAME}/${LevelType.EASY}`]).finally();
      } else {
        this.alive = true;
        this.startGame();
      }
    });
  }

  ngOnDestroy(): void {
    if (!this.alive && this.levelType) {
      if (this.roundInfo?.id) {
        this.gameService.endGame(this.roundInfo.id).pipe(takeUntil(this.destroy)).subscribe();
      }

      this.snackBar.open(`Игра закончена. Счет: ${this.totalScore}. Пройдено раундов: ${this.currentRound - 1}`);
    }
  }

  endGame(): void {
    if (!this.roundInfo) {
      return;
    }

    this.gameService
      .endGame(this.roundInfo.id)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.roundInfo.id = 0;
        this.alive = false;
        this.router.navigate(['']).then();
      });
  }

  getParameter(type: GameParameterType, localizedParam: string): void {
    if (!this.roundInfo) {
      return;
    }

    this.gameService
      .getParameter(this.roundInfo.id, type)
      .pipe(takeUntil(this.destroy))
      .subscribe(param => {
        if (!param.score) {
          this.alive = false;
          this.router.navigate(['']).then();
        }

        const index = this.availableParams.indexOf(type);
        this.availableParams.splice(index, 1);
        this.usedParams.push(type);
        this.changeDetectorRef.markForCheck();

        this.roundInfo.score = param.score;
        if (param.parameter.length) {
          this.receivedTextParams.push(`${localizedParam}: ${param.parameter.join(', ')}`);
        } else this.snackBar.open('Не удалось получить подсказку');
      });
  }

  private startGame(): void {
    this.gameService
      .start(this.levelType)
      .pipe(
        map(roundInfo => (this.roundInfo = roundInfo)),
        filter(() => !!this.roundInfo),
        switchMap(() => this.gameService.getAvailableParameters(Number(this.roundInfo.id))),
        map(params => (this.availableParams = params)),
        filter(() => !!this.availableParams.find(param => param === GameParameterType.IMAGES)),
        switchMap(() => this.gameService.getParameter(this.roundInfo.id, GameParameterType.IMAGES)),
        takeUntil(this.destroy),
      )
      .subscribe(param => {
        this.roundInfo.score = param.score;
        this.imageSrc = param.parameter[0];

        const index = this.availableParams.indexOf(GameParameterType.IMAGES);
        this.availableParams.splice(index, 1);
        this.usedParams.push(GameParameterType.IMAGES);
        this.changeDetectorRef.markForCheck();

        this.gameIsLoaded = true;
      });
  }

  confirmAnswer(): void {
    if (!this.roundInfo || !this.selectedAnswer.length) {
      this.snackBar.open('Выберите вариант ответа');
      return;
    }

    this.gameIsLoaded = false;

    this.gameService
      .setAnswer(this.roundInfo.id, this.selectedAnswer)
      .pipe(
        map(result => {
          if (!result.alive) {
            this.alive = false;
            this.router.navigate(['']).then();
          }

          if (result.right) {
            this.usedParams = [];
            this.receivedTextParams = [];
            this.roundInfo = result.round;
            this.totalScore += result.score;

            this.snackBar.open(`Вы угадали! Начислено ${result.score} очков`);
          } else {
            this.gameIsLoaded = true;
            this.roundInfo.score = result.score;
            this.snackBar.open('Неверный ответ. Попробуйте еще раз!');
          }

          return result.alive && result.right;
        }),
        filter(refreshRoundData => refreshRoundData),
        switchMap(() => this.gameService.getAvailableParameters(Number(this.roundInfo.id))),
        map(params => (this.availableParams = params)),
        switchMap(() => this.gameService.getParameter(this.roundInfo.id, GameParameterType.IMAGES)),
        map(param => {
          this.imageSrc = param.parameter[0];

          const index = this.availableParams.indexOf(GameParameterType.IMAGES);
          this.availableParams.splice(index, 1);
          this.usedParams.push(GameParameterType.IMAGES);

          this.changeDetectorRef.markForCheck();
        }),
        takeUntil(this.destroy),
      )
      .subscribe(() => {
        this.currentRound++;
        this.selectedAnswer = '';
        this.gameIsLoaded = true;
      });
  }
}
