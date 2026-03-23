import {Component, Input} from "@angular/core";
import {ComplexityIndicatorComponent} from "./indicators/complexity-indicator.component";
import {LastPlayedIndicatorComponent} from "./indicators/last-played-indicator.component";
import {RatingIndicatorComponent} from "./indicators/rating-indicator.component";

@Component({
  selector: 'game-indicators',
  standalone: true,
  imports: [
    ComplexityIndicatorComponent,
    LastPlayedIndicatorComponent,
    RatingIndicatorComponent
  ],
  template: `
    <div class="indicators">
      <rating-indicator
        [value]="ratingBgg"
        [bggId]="bggId"
        [isExpansion]="isExpansion"
        [size]="size"
      ></rating-indicator>

      <rating-indicator [value]="ratingPersonal" [size]="size"></rating-indicator>

      <complexity-indicator [complexity]="complexity" [size]="size"></complexity-indicator>

      <last-played-indicator [lastPlayed]="lastPlayed" [size]="size"></last-played-indicator>
    </div>
  `,
  styles: [`
    .indicators {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 14px;
      align-items: center;
      justify-items: center;
    }

    /* Mobile: 2x2 layout */
    @media (max-width: 600px) {
      .indicators {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `]
})
export class GameIndicatorsComponent {
  @Input() bggId: number | null = null;
  @Input() isExpansion: boolean = false;
  @Input() ratingBgg?: number;
  @Input() ratingPersonal?: number | null;
  @Input() complexity?: number;
  @Input() lastPlayed?: string | null;

  @Input() size: 'default' | 'mini' = 'default';
}
