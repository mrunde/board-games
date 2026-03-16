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

      <div *ngIf="game.expansions?.length" class="exp">
        <div class="exp-title">
          Expansions ({{ game.expansions.length }})
        </div>

        <div
          class="exp-item"
          *ngFor="let e of game.expansions"
          [class.recent-exp]="isRecentlyPlayed(e.lastPlayed)"
        >
          <a [routerLink]="['/expansions', e.bggId]">{{ e.name }}</a>
          <span>{{ e.lastPlayed || '—' }}</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 14px;
      padding: 14px;
      margin-bottom: 12px;
      border: 2px solid transparent;
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

    .header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      text-decoration: none;
      color: inherit;
    }

    .last {
      text-align: right;
      font-size: 12px;
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

    .actions button {
      border: none;
      background: #1976d2;
      color: white;
      border-radius: 10px;
      padding: 8px 12px;
      cursor: pointer;
    }

    .exp {
      margin-top: 12px;
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
    }

    .exp-item a {
      text-decoration: none;
      color: inherit;
    }

    .recent-exp {
      background: rgba(124, 179, 66, 0.08);
      border-radius: 8px;
      padding: 6px 8px;
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
