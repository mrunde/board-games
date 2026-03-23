import {NgIf} from '@angular/common';
import {Component, Input} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'rating-indicator',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  template: `
    <div class="rating-hex-group" [class.rating-hex-group--mini]="size === 'mini'">
      <div
        class="rating-hex"
        [style.background]="getRatingColor(value)"
      >
        <span class="rating-value">{{ value ?? '—' }}</span>
      </div>

      <a
        *ngIf="bggId != null; else plainLabel"
        class="rating-label rating-link"
        [href]="bggUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ 'game.ratingBgg' | translate }}
      </a>

      <ng-template #plainLabel>
        <span class="rating-label">{{ 'game.ratingPersonal' | translate }}</span>
      </ng-template>
    </div>
  `,
  styles: [`
    .rating-hex-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .rating-hex {
      width: 120px;
      aspect-ratio: 1;
      clip-path: polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      text-align: center;
      box-sizing: border-box;
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.16);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .rating-value {
      font-size: 44px;
      font-weight: 700;
      line-height: 1;
    }

    .rating-label {
      font-size: 12px;
      font-weight: 600;
      line-height: 1.1;
      opacity: 0.9;
      text-align: center;
      min-height: 13px;
    }

    .rating-hex-group--mini .rating-hex {
      width: 64px;
      padding: 4px;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.14);
    }

    .rating-hex-group--mini .rating-value {
      font-size: 22px;
    }

    .rating-hex-group--mini .rating-label {
      font-size: 10px;
      min-height: auto;
    }

    .rating-link {
      color: #1976d2;
      text-decoration: none;
    }

    .rating-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 600px) {
      .rating-hex {
        width: 100px;
      }
    }
  `]
})
export class RatingIndicatorComponent {
  @Input() value?: number | null;
  @Input() bggId: number | null = null;
  @Input() isExpansion: boolean = false;

  @Input() size: 'default' | 'mini' = 'default';

  getRatingColor(value?: number | null): string {
    if (value == null || Number.isNaN(value)) {
      return '#9e9e9e';
    }

    const clamped = Math.max(1, Math.min(10, value));
    const hue = ((clamped - 1) / 9) * 120;

    return `hsl(${hue}, 65%, 45%)`;
  }

  get bggUrl(): string {
    if (this.isExpansion) {
      return "https://boardgamegeek.com/boardgameexpansion/" + this.bggId;
    } else {
      return "https://boardgamegeek.com/boardgame/" + this.bggId;
    }
  }
}
