import {Location, NgFor, NgIf} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Subject, takeUntil} from 'rxjs';
import {distinctUntilChanged, filter, map, tap} from 'rxjs/operators';
import {BoardgamesService} from '../../../core/api/boardgames.service';
import {formatLastPlayed} from "../../../shared/utils/last-played-format.util";
import {DetailShellComponent} from '../components/detail-shell.component';
import {GameEditDialogComponent} from "../components/game-edit-dialog.component";
import {GameDetail, Play} from '../models/game.model';
import {DetailPageUiService} from '../services/detail-page-ui.service';

@Component({
  selector: 'game-detail',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, DetailShellComponent, TranslatePipe, MatButton],
  template: `
    <detail-shell
      [loading]="loading"
      [loadingText]="'game.loading' | translate"
      [error]="error"
      [successMessage]="successMessage"
      [game]="game"
      [selectedPlayDate]="selectedPlayDate"
      [playDateLabel]="selectedPlayDateLabel"
      [playSubmitting]="playSubmitting"
      [playError]="playError"
      [lastPlayedEntries]="lastPlayedEntries"
      (selectedPlayDateChange)="selectedPlayDate = $event"
      (back)="goBack()"
      (today)="setToday()"
      (recordPlay)="recordPlay()"
    >
      <div class="edit-game" *ngIf="game">
        <button mat-flat-button color="primary" type="button" (click)="editGame()">
          {{ 'common.edit' | translate }}
        </button>
      </div>

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
    .edit-game {
      display: flex;
      justify-content: flex-end;
      margin: 14px 0;
    }

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
  lastPlayedEntries: Play[] = [];
  selectedPlayDate: Date | null = new Date();

  private readonly destroy$ = new Subject<void>();
  private successTimeoutId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: BoardgamesService,
    private readonly dialog: MatDialog,
    private readonly location: Location,
    private readonly translate: TranslateService,
    public ui: DetailPageUiService
  ) {
  }

  get selectedPlayDateLabel(): string {
    const lang = this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'en';
    return formatLastPlayed(this.selectedPlayDate, lang);
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
    this.api.getPlays(id).subscribe(plays => {
      this.lastPlayedEntries = plays;
    });
  }

  editGame(): void {
    if (!this.game) return;

    this.dialog.open(GameEditDialogComponent, {
      data: this.game,
      width: '760px',
      maxWidth: '94vw'
    })
      .afterClosed().subscribe((updatedGame?: GameDetail) => {
      if (!updatedGame) return;

      this.api.updateGame(updatedGame).subscribe({
        next: game => this.game = game,
        error: err => {
          this.error = err?.error?.error ?? err?.message ?? this.translate.instant('errors.editGame');
        }
      })
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
