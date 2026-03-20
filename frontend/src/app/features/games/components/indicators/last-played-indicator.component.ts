import {NgIf} from "@angular/common";
import {Component, Input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'last-played-indicator',
  standalone: true,
  imports: [NgIf, MatIcon, TranslatePipe],
  template: `
    <div class="last-played-card" [class.last-played-card--muted]="!lastPlayed">
      <div class="last-played-main">
        <div class="last-played-icon-wrap" aria-hidden="true">
          <mat-icon class="last-played-icon">calendar_today</mat-icon>
        </div>

        <div class="last-played-content">
          <div class="last-played-title">
            {{ 'play.lastPlayed' | translate }}
          </div>

          <div class="last-played-date">
            {{ formatLastPlayed() }}
          </div>

          <div class="last-played-ago" *ngIf="getLastPlayedAgo() as ago">
            {{ ago }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .last-played-card {
      display: inline-flex;
      align-items: center;
      min-width: 220px;
      max-width: 280px;
      padding: 12px 14px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .last-played-card--muted {
      opacity: 0.55;
    }

    .last-played-main {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .last-played-icon-wrap {
      flex: 0 0 auto;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.06);
    }

    .last-played-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      line-height: 22px;
    }

    .last-played-content {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .last-played-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      opacity: 0.7;
      line-height: 1.2;
    }

    .last-played-date {
      font-size: 16px;
      font-weight: 700;
      line-height: 1.2;
      word-break: break-word;
    }

    .last-played-ago {
      font-size: 12px;
      line-height: 1.2;
      opacity: 0.8;
    }

    @media (max-width: 600px) {
      .last-played-card {
        min-width: 190px;
        padding: 10px 12px;
      }

      .last-played-icon-wrap {
        width: 40px;
        height: 40px;
      }

      .last-played-date {
        font-size: 15px;
      }

      .last-played-ago {
        font-size: 11px;
      }
    }
  `]
})
export class LastPlayedIndicatorComponent {
  @Input() lastPlayed?: string | null;

  constructor(
    private readonly translate: TranslateService
  ) {
  }

  formatLastPlayed(): string {
    if (!this.lastPlayed) {
      return '—';
    }

    const played = new Date(this.lastPlayed);
    if (Number.isNaN(played.getTime())) {
      return '—';
    }

    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(played);
  }

  getLastPlayedAgo(): string {
    if (!this.lastPlayed) {
      return '';
    }

    const played = new Date(this.lastPlayed);
    if (Number.isNaN(played.getTime())) {
      return '';
    }

    const today = new Date();
    const start = new Date(played.getFullYear(), played.getMonth(), played.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years > 0) {
      const dateUnit = this.translate.instant(`play.year${years === 1 ? '' : 's'}`);
      return this.translate.instant('play.playedAgo', {count: years, dateUnit});
    }

    if (months > 0) {
      const dateUnit = this.translate.instant(`play.month${months === 1 ? '' : 's'}`);
      return this.translate.instant('play.playedAgo', {count: months, dateUnit});
    }

    const totalDays = Math.max(
      0,
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );

    if (totalDays >= 7) {
      const weeks = Math.floor(totalDays / 7);
      const dateUnit = this.translate.instant(`play.week${weeks === 1 ? '' : 's'}`);
      return this.translate.instant('play.playedAgo', {count: weeks, dateUnit});
    }

    const safeDays = Math.max(0, totalDays);
    const dateUnit = this.translate.instant(`play.day${safeDays === 1 ? '' : 's'}`);
    return this.translate.instant('play.playedAgo', {count: safeDays, dateUnit});
  }
}
