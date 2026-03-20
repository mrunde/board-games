import {NgIf} from '@angular/common';
import {Component, Input} from '@angular/core';

@Component({
  selector: 'rating-indicator',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="rating-hex-group">
      <div
        class="rating-hex"
        [style.background]="getRatingColor(value)"
      >
        <span class="rating-value">{{ value ?? '—' }}</span>
      </div>

      <a
        *ngIf="isBgg; else plainLabel"
        class="rating-label rating-link"
        [href]="bggUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ label }}
      </a>

      <ng-template #plainLabel>
        <span class="rating-label">{{ label }}</span>
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
  @Input() label = '';
  @Input() isBgg = false;
  @Input() bggUrl?: string | null;

  getRatingColor(value?: number | null): string {
    if (value == null || Number.isNaN(value)) {
      return '#9e9e9e';
    }

    const clamped = Math.max(1, Math.min(10, value));
    const hue = ((clamped - 1) / 9) * 120;

    return `hsl(${hue}, 65%, 45%)`;
  }
}
