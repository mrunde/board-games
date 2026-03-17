import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location, NgFor, NgIf} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {BoardgamesService} from '../../../core/api/boardgames.service';
import {GameDetail} from '../models/game.model';
import {DetailShellComponent} from '../components/detail-shell.component';
import {DetailPageUiService} from '../services/detail-page-ui.service';

@Component({
  selector: 'game-detail',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, DetailShellComponent],
  template: `
    <detail-shell
      [loading]="loading"
      loadingText="Loading game…"
      [error]="error"
      [successMessage]="successMessage"
      [title]="game?.name"
      [imageUrl]="game?.imageUrl"
      [ratingBgg]="game?.ratingBgg"
      [ratingPersonal]="game?.ratingPersonal"
      [playingTimeMin]="game?.playingTimeMin"
      [playingTimeMax]="game?.playingTimeMax"
      [weight]="game?.weight"
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
      (play)="recordPlay()"
    >
      <div *ngIf="game?.expansions?.length" class="expansions">
        <h2>Expansions</h2>
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
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 0;
      align-items: center;
    }

    .exp-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .exp-cover {
      width: 36px;
      height: 36px;
      object-fit: cover;
      border-radius: 6px;
      flex: 0 0 36px;
      background: #eee;
    }

    .exp-cover.small.placeholder {
      border: 1px dashed #c7c7c7;
      background:
        linear-gradient(135deg, #f3f3f3 25%, #ebebeb 25%, #ebebeb 50%, #f3f3f3 50%, #f3f3f3 75%, #ebebeb 75%, #ebebeb 100%);
      background-size: 12px 12px;
    }

    .exp-item a {
      text-decoration: none;
      color: inherit;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      padding: 8px;
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
          this.game = undefined;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(id => this.load(id));
  }

  get selectedPlayDateLabel(): string {
    return this.ui.toIsoDate(this.selectedPlayDate) ?? 'today';
  }

  load(id: number): void {
    this.api.getGameById(id).subscribe({
      next: game => {
        this.game = game;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.error ?? err?.message ?? 'Failed to load game.';
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
          `Play recorded for ${playedOn}.`,
          value => this.successMessage = value
        );
        this.load(this.game!.bggId);
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
