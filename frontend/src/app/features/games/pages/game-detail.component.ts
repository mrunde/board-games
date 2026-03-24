import {Location, NgFor, NgIf} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Subject, takeUntil} from 'rxjs';
import {distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {BoardgamesService} from '../../../core/api/boardgames.service';
import {DetailShellComponent} from '../components/detail-shell.component';
import {GameDetail} from '../models/game.model';
import {DetailPageUiService} from '../services/detail-page-ui.service';

@Component({
  selector: 'game-detail',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, DetailShellComponent, TranslatePipe],
  template: `
    <detail-shell
      [loading]="loading"
      [loadingText]="'game.loading' | translate"
      [error]="error"
      [successMessage]="successMessage"
      [bggId]="game?.bggId"
      [title]="game?.name"
      [imageUrl]="game?.imageUrl"
      [ratingBgg]="game?.ratingBgg"
      [ratingPersonal]="game?.ratingPersonal"
      [playingTimeMin]="game?.playingTimeMin"
      [playingTimeMax]="game?.playingTimeMax"
      [complexity]="game?.complexity"
      [playersMin]="game?.playersMin"
      [playersMax]="game?.playersMax"
      [playersRecMin]="game?.playersRecMin"
      [playersRecMax]="game?.playersRecMax"
      [lastPlayed]="game?.lastPlayed"
      [recent]="ui.isRecentlyPlayed(game?.lastPlayed ?? null)"
      [selectedPlayDate]="selectedPlayDate"
      [playDateLabel]="selectedPlayDateLabel"
      [playSubmitting]="playSubmitting"
      [playError]="playError"
      (selectedPlayDateChange)="selectedPlayDate = $event"
      (back)="goBack()"
      (today)="setToday()"
      (recordPlay)="recordPlay()"
    >
      <div *ngIf="game?.expansions?.length" class="expansions">
        <h2>{{ 'common.expansions' | translate }}</h2>
        <div
          class="exp-item"
          *ngFor="let e of game?.expansions"
          [class.recent-exp]="ui.isRecentlyPlayed(e.lastPlayed)"
        >
          <div class="exp-left">
            <ng-container *ngIf="e.imageUrl; else expPlaceholder">
              <img
                class="exp-cover"
                [src]="e.imageUrl!"
                (error)="e.imageUrl = null"
                [alt]="e.name">
            </ng-container>

            <ng-template #expPlaceholder>
              <div class="exp-cover placeholder small"></div>
            </ng-template>

            <a [routerLink]="['/expansions', e.bggId]">{{ e.name }}</a>
          </div>

          <span>{{ e.lastPlayed || '—' }}</span>
        </div>
      </div>
    </detail-shell>
  `,
  styles: [`
    .expansions {
      margin-top: 18px;
    }

    .exp-item {
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 6px 0;
      align-items: center;
    }

    .exp-left {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .exp-cover {
      width: 32px;
      height: 32px;
      object-fit: cover;
      border-radius: 6px;
      flex: 0 0 32px;
      background: #eee;
    }

    .exp-cover.small.placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed #c7c7c7;
      background: linear-gradient(135deg, #f3f3f3 25%, #ebebeb 25%, #ebebeb 50%, #f3f3f3 50%, #f3f3f3 75%, #ebebeb 75%, #ebebeb 100%);
      background-size: 12px 12px;
    }

    .exp-item a {
      text-decoration: none;
      color: inherit;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .recent-exp {
      background: rgba(124, 179, 66, 0.08);
      border-radius: 8px;
      padding: 6px 8px;
    }
  `]
})
export class GameDetailComponent implements OnInit, OnDestroy {
  game?: GameDetail;
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
    return this.ui.toIsoDate(this.selectedPlayDate) ??
      this.translate.instant('play.today');
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
          this.game = undefined;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(id => this.load(id));
  }

  load(id: number): void {
    this.api.getGameById(id).subscribe({
      next: game => {
        this.game = game;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.error ?? err?.message
          ?? this.translate.instant('errors.game');
        this.loading = false;
      }
    });
  }

  setToday(): void {
    this.selectedPlayDate = new Date();
  }

  recordPlay(): void {
    if (!this.game) return;

    const playedOn = this.ui.toIsoDate(this.selectedPlayDate);
    if (!playedOn) return;

    this.playSubmitting = true;
    this.playError = null;
    this.successMessage = null;
    this.ui.clearTimedSuccess(this.successTimeoutId);

    this.api.recordPlay(this.game.bggId, playedOn).subscribe({
      next: () => {
        this.playSubmitting = false;
        this.successTimeoutId = this.ui.startTimedSuccess(
          this.translate.instant('play.recorded', {playedOn: playedOn}),
          value => this.successMessage = value
        );
        this.load(this.game!.bggId);
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
