import {Component, Input} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {GameDetail} from '../models/game.model';

@Component({
  selector: 'game-card',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  template: `
    <div
      class="card"
      [class.recent]="isRecentlyPlayed(game.lastPlayed)"
      [class.recommended]="isRecommendedMatch()"
    >
      <div class="media">
        <ng-container *ngIf="game.imageUrl; else placeholder">
          <img
            class="cover"
            [src]="game.imageUrl!"
            (error)="game.imageUrl = null"
            [alt]="game.name"
            [routerLink]="['/games', game.bggId]"
          >
        </ng-container>

        <ng-template #placeholder>
          <div class="cover placeholder" aria-label="No image available">
            <span>No image</span>
          </div>
        </ng-template>
      </div>

      <div class="content">
        <div class="header">
          <div class="title-wrap">
            <a class="title" [routerLink]="['/games', game.bggId]">{{ game.name }}</a>

            <span *ngIf="isRecommendedMatch()" class="recommended-badge">
              ★ Recommended
            </span>
          </div>

          <div class="last">
            Last played
            <div class="value">{{ game.lastPlayed || '—' }}</div>
          </div>
        </div>

        <div class="meta">
          Players {{ game.playersMin }}–{{ game.playersMax }}
          · Time {{ game.playingTimeMin }}–{{ game.playingTimeMax }} min
        </div>

        <div class="stats">
          <div>BGG {{ game.ratingBgg }}</div>
          <div>You {{ game.ratingPersonal ?? '—' }}</div>
          <div>Weight {{ game.weight }}</div>
        </div>
      </div>

      <div *ngIf="game.expansions?.length" class="exp">
        <div class="exp-title">
          Expansions ({{ game.expansions.length }})
        </div>

        <div
          class="exp-item"
          *ngFor="let e of game.expansions"
          [class.recent-exp]="isRecentlyPlayed(e.lastPlayed)"
        >
          <div class="exp-left">
            <ng-container *ngIf="e.imageUrl; else expPlaceholder">
              <img
                class="exp-cover"
                [src]="e.imageUrl!"
                (error)="e.imageUrl = null"
                [alt]="e.name"
              >
            </ng-container>

            <ng-template #expPlaceholder>
              <div class="exp-cover placeholder small"></div>
            </ng-template>

            <a [routerLink]="['/expansions', e.bggId]">{{ e.name }}</a>
          </div>

          <span>{{ e.lastPlayed || '—' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      display: grid;
      grid-template-columns: 110px minmax(0, 1fr);
      gap: 14px;
      background: white;
      border-radius: 14px;
      padding: 14px;
      margin-bottom: 12px;
      border: 2px solid transparent;
      align-items: stretch;
    }

    .card.recent {
      border-color: #7cb342;
      box-shadow: 0 0 0 1px rgba(124, 179, 66, 0.15);
    }

    .card.recommended {
      border-color: #ffb300;
      box-shadow: 0 0 0 1px rgba(255, 179, 0, 0.35);
    }

    .card.recent.recommended {
      border-color: #ff9800;
    }

    .media {
      min-height: 150px;
      height: 100%;
    }

    .cover {
      width: 100%;
      height: 100%;
      min-height: 150px;
      display: block;
      object-fit: cover;
      border-radius: 10px;
      background: #eee;
    }

    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #777;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border: 1px dashed #c7c7c7;
      background: linear-gradient(135deg, #f3f3f3 25%, #ebebeb 25%, #ebebeb 50%, #f3f3f3 50%, #f3f3f3 75%, #ebebeb 75%, #ebebeb 100%);
      background-size: 20px 20px;
    }

    .content {
      min-width: 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }

    .title-wrap {
      min-width: 0;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      text-decoration: none;
      color: inherit;
    }

    .recommended-badge {
      display: inline-block;
      margin-top: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #8a5a00;
      background: rgba(255, 179, 0, 0.18);
      border-radius: 999px;
      padding: 4px 8px;
    }

    .last {
      text-align: right;
      font-size: 12px;
      flex: 0 0 auto;
    }

    .value {
      font-weight: 600;
    }

    .meta {
      font-size: 13px;
      opacity: 0.7;
      margin-top: 4px;
    }

    .stats {
      margin-top: 8px;
      display: flex;
      gap: 12px;
      font-size: 13px;
      flex-wrap: wrap;
    }

    .exp {
      grid-column: 1 / -1;
      margin-top: 2px;
    }

    .exp-title {
      font-weight: 600;
      margin-bottom: 6px;
      font-size: 13px;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .recent-exp {
      background: rgba(124, 179, 66, 0.08);
      border-radius: 8px;
      padding: 6px 8px;
    }

    @media (max-width: 640px) {
      .card {
        grid-template-columns: 84px minmax(0, 1fr);
        gap: 12px;
      }

      .media,
      .cover {
        min-height: 120px;
      }

      .header {
        flex-direction: column;
      }

      .last {
        text-align: left;
      }
    }
  `]
})
export class GameCardComponent {
  @Input() game!: GameDetail;
  @Input() filterMinPlayers?: number;
  @Input() filterMaxPlayers?: number;

  isRecentlyPlayed(value: string | null): boolean {
    if (!value) return false;
    const played = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - played.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }

  isRecommendedMatch(): boolean {
    if (this.filterMinPlayers == null && this.filterMaxPlayers == null) {
      return false;
    }

    const min = this.filterMinPlayers ?? this.filterMaxPlayers!;
    const max = this.filterMaxPlayers ?? this.filterMinPlayers!;

    return (
      this.game.playersRecMin <= max &&
      this.game.playersRecMax >= min
    );
  }
}
