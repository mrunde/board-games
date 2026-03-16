import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {BoardgamesService} from '../../../core/api/boardgames.service';
import {Expansion, GameDetail} from '../models/game.model';
import {DetailShellComponent} from '../components/detail-shell.component';
import {DetailPageUiService} from '../services/detail-page-ui.service';

@Component({
  selector: 'expansion-detail',
  standalone: true,
  imports: [DetailShellComponent],
  template: `
    <detail-shell
      [loading]="loading"
      loadingText="Loading expansion…"
      [error]="error"
      [successMessage]="successMessage"
      [title]="expansion?.name"
      [ratingBgg]="expansion?.ratingBgg"
      [ratingPersonal]="expansion?.ratingPersonal"
      [playingTimeMin]="expansion?.playingTimeMin"
      [playingTimeMax]="expansion?.playingTimeMax"
      [weight]="expansion?.weight"
      [playersMin]="expansion?.playersMin"
      [playersMax]="expansion?.playersMax"
      [playersRecMin]="expansion?.playersRecMin"
      [playersRecMax]="expansion?.playersRecMax"
      [lastPlayed]="expansion?.lastPlayed"
      [recent]="ui.isRecentlyPlayed(expansion?.lastPlayed ?? null)"
      [mainGameName]="mainGame?.name"
      [mainGameLink]="mainGame ? ['/games', mainGame.bggId] : null"
      [selectedPlayDate]="selectedPlayDate"
      [playDateLabel]="selectedPlayDateLabel"
      [playSubmitting]="playSubmitting"
      [playError]="playError"
      (selectedPlayDateChange)="selectedPlayDate = $event"
      (back)="goBack()"
      (today)="setToday()"
      (play)="recordPlay()"
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

  private destroy$ = new Subject<void>();
  private successTimeoutId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: BoardgamesService,
    private location: Location,
    public ui: DetailPageUiService
  ) {
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

  get selectedPlayDateLabel(): string {
    return this.ui.toIsoDate(this.selectedPlayDate) ?? 'today';
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
            this.error = err?.error?.error ?? err?.message ?? 'Failed to load main game.';
            this.loading = false;
          }
        });
      },
      error: err => {
        this.error = err?.error?.error ?? err?.message ?? 'Failed to load expansion.';
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
          `Play recorded for ${playedOn}.`,
          value => this.successMessage = value
        );
        this.load(this.expansion!.bggId);
      },
      error: err => {
        this.playSubmitting = false;
        this.playError = err?.error?.error ?? err?.message ?? 'Failed to save play.';
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
