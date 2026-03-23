import {NgFor} from '@angular/common';
import {Component, Input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'complexity-indicator',
  standalone: true,
  imports: [NgFor, MatIcon],
  template: `
    <div class="complexity-group" [class.complexity-group--mini]="size === 'mini'">
      <div class="icon-indicator">
        <mat-icon
          class="complexity-icon"
          [style.color]="getComplexityIconColor(complexity)"
        >
          psychology
        </mat-icon>

        <div class="complexity-meter complexity-meter-overlay">
          <div
            class="complexity-segment"
            *ngFor="let fill of getComplexitySegments(complexity)"
            [style.background]="getComplexitySegmentsColor(fill, complexity)"
          ></div>
        </div>
      </div>

      <span
        class="icon-indicator-label">{{ complexity != null ? (complexity + ' / 5') : '—' }}</span>
    </div>
  `,
  styles: [`
    .complexity-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .icon-indicator {
      position: relative;
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 600px) {
      .icon-indicator {
        width: 100px;
        height: 100px;
      }
    }

    .icon-indicator .complexity-icon {
      width: 88px;
      height: 88px;
      font-size: 88px;
      line-height: 88px;
      transition: color 0.3s ease;
    }

    .complexity-meter {
      display: flex;
      gap: 6px;
      align-items: center;
      justify-content: center;
      min-height: 14px;
    }

    .complexity-meter-overlay {
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
    }

    @media (max-width: 600px) {
      .complexity-meter-overlay {
        top: 85px;
      }
    }

    .complexity-segment {
      width: 16px;
      height: 10px;
      border-radius: 999px;
    }

    .icon-indicator-label {
      font-size: 12px;
      font-weight: 600;
      line-height: 1.1;
      opacity: 0.9;
      text-align: center;
      min-height: 13px;
    }

    .complexity-group--mini .icon-indicator {
      width: 64px;
      height: 64px;
    }

    .complexity-group--mini .complexity-icon {
      width: 42px;
      height: 42px;
      font-size: 42px;
      line-height: 42px;
    }

    .complexity-group--mini .complexity-meter-overlay {
      top: 52px;
    }

    .complexity-group--mini .complexity-meter {
      gap: 3px;
      min-height: 8px;
    }

    .complexity-group--mini .complexity-segment {
      width: 8px;
      height: 5px;
    }

    .complexity-group--mini .icon-indicator-label {
      font-size: 10px;
      min-height: auto;
    }
  `]
})
export class ComplexityIndicatorComponent {
  @Input() complexity?: number | null;

  @Input() size: 'default' | 'mini' = 'default';

  getComplexitySegments(value?: number | null): number[] {
    if (value == null || Number.isNaN(value)) {
      return [0, 0, 0, 0, 0];
    }

    const clamped = Math.max(0, Math.min(5, value));

    return Array.from({length: 5}, (_, index) => {
      const segmentValue = clamped - index;
      return Math.max(0, Math.min(1, segmentValue));
    });
  }

  getComplexitySegmentsColor(fill: number = 1, value?: number | null): string {
    if (value == null || Number.isNaN(value)) {
      return 'rgba(0, 0, 0, 0.12)';
    }

    const clamped = Math.max(1, Math.min(5, value));
    const hue = 120 - ((clamped - 1) / 4) * 120;
    const color = `hsl(${hue}, 65%, 45%)`;

    return `linear-gradient(
    to right,
    ${color} 0%,
    ${color} ${fill * 100}%,
    rgba(0, 0, 0, 0.12) ${fill * 100}%,
    rgba(0, 0, 0, 0.12) 100%
  )`;
  }

  getComplexityIconColor(value?: number | null): string {
    if (value == null || Number.isNaN(value)) {
      return 'rgba(0,0,0,0.3)';
    }

    const clamped = Math.max(1, Math.min(5, value));
    const hue = 120 - ((clamped - 1) / 4) * 120;

    return `hsl(${hue}, 50%, 45%)`;
  }
}
