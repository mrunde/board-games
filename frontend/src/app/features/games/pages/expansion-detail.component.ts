import {Location} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Subject, takeUntil} from 'rxjs';
import {distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {BoardgamesService} from '../../../core/api/boardgames.service';
import {DetailShellComponent} from '../components/detail-shell.component';
import {Expansion, GameDetail} from '../models/game.model';
import {DetailPageUiService} from '../services/detail-page-ui.service';

@Component({
  selector: 'expansion-detail',
  standalone: true,
  imports: [DetailShellComponent, TranslatePipe],
  template: `
    <detail-shell
      [loading]="loading"
      [loadingText]="'expansion.loading' | translate"
      [error]="error"
      [successMessage]="successMessage"
      [bggId]="expansion?.bggId"
      [title]="expansion?.name"
      [imageUrl]="expansion?.imageUrl"
      [ratingBgg]="expansion?.ratingBgg"
      [ratingPersonal]="expansion?.ratingPersonal"
      [playingTimeMin]="expansion?.playingTimeMin"
      [playingTimeMax]="expansion?.playingTimeMax"
      [complexity]="expansion?.complexity"
      [playersMin]="expansion?.playersMin"
      [playersMax]="expansion?.playersMax"
      [playersRecMin]="expansion?.playersRecMin"
      [playersRecMax]="expansion?.playersRecMax"
      [lastPlayed]="expansion?.lastPlayed"
      [files]="expansion?.files"
      [mainGameName]="mainGame?.name"
      [mainGameLink]="mainGame ? ['/games', mainGame.bggId] : null"
      [selectedPlayDate]="selectedPlayDate"
      [playDateLabel]="selectedPlayDateLabel"
      [playSubmitting]="playSubmitting"
      [playError]="playError"
      (selectedPlayDateChange)="selectedPlayDate = $event"
      (back)="goBack()"
      (today)="setToday()"
      (recordPlay)="recordPlay()"
    >
    </detail-shell>
  `
})
export class ExpansionDetailComponent implements OnInit, OnDestroy {
  expansion?: Expansion;
  mainGame?: GameDetail;
  loading = false;
  error: string | null = null;
  playSubmitting = false;
  playError: string | null = null;
  successMessage: string | null = null;
  selectedPlayDate: Date | null = new Date();

  private readonly destroy$ = new Subject<void>();
  private successTimeoutId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: BoardgamesService,
    private readonly location: Location,
    private readonly translate: TranslateService,
    public ui: DetailPageUiService
  ) {
  }

  get selectedPlayDateLabel(): string {
    return this.ui.toIsoDate(this.selectedPlayDate)
      ?? this.translate.instant('play.today');
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => Number(params.get('id'))),
        filter(id => !Number.isNaN(id)),
        distinctUntilChanged(),
        tap(() => {
          this.loading = true;
          this.error = null;
          this.playError = null;
          this.expansion = undefined;
          this.mainGame = undefined;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(id => this.load(id));
  }

  load(id: number): void {
    this.api.getExpansionById(id).subscribe({
      next: expansion => {
        this.expansion = expansion;

        this.api.getGameById(expansion.mainGameId).subscribe({
          next: mainGame => {
            this.mainGame = mainGame;
            this.loading = false;
          },
          error: err => {
            this.error = err?.error?.error ?? err?.message
              ?? this.translate.instant('errors.mainGame');
            this.loading = false;
          }
        });
      },
      error: err => {
        this.error = err?.error?.error ?? err?.message
          ?? this.translate.instant('errors.expansion');
        this.loading = false;
      }
    });
  }

  setToday(): void {
    this.selectedPlayDate = new Date();
  }

  recordPlay(): void {
    if (!this.expansion) return;

    const playedOn = this.ui.toIsoDate(this.selectedPlayDate);
    if (!playedOn) return;

    this.playSubmitting = true;
    this.playError = null;
    this.successMessage = null;
    this.ui.clearTimedSuccess(this.successTimeoutId);

    this.api.recordPlay(this.expansion.bggId, playedOn).subscribe({
      next: () => {
        this.playSubmitting = false;
        this.successTimeoutId = this.ui.startTimedSuccess(
          this.translate.instant('play.recorded', {playedOn: playedOn}),
          value => this.successMessage = value
        );
        this.load(this.expansion!.bggId);
      },
      error: err => {
        this.playSubmitting = false;
        this.playError = err?.error?.error ?? err?.message
          ?? this.translate.instant('errors.play');
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.ui.clearTimedSuccess(this.successTimeoutId);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
