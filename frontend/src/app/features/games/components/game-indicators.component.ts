import {Component, Input} from "@angular/core";
import {TranslatePipe} from "@ngx-translate/core";
import {ComplexityIndicatorComponent} from "./indicators/complexity-indicator.component";
import {LastPlayedIndicatorComponent} from "./indicators/last-played-indicator.component";
import {RatingIndicatorComponent} from "./indicators/rating-indicator.component";

@Component({
  selector: 'game-indicators',
  standalone: true,
  imports: [
    ComplexityIndicatorComponent,
    LastPlayedIndicatorComponent,
    RatingIndicatorComponent,
    TranslatePipe
  ],
  template: `
    <div class="indicators">
      <rating-indicator
        [value]="ratingBgg"
        label="BGG"
        [isBgg]="true"
        [bggUrl]="bggUrl"
      ></rating-indicator>

      <rating-indicator
        [value]="ratingPersonal"
        [label]="'game.ratingPersonal' | translate"
      ></rating-indicator>

      <complexity-indicator [complexity]="complexity"></complexity-indicator>

      <last-played-indicator [lastPlayed]="lastPlayed"></last-played-indicator>
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
  @Input() bggId?: number;
  @Input() ratingBgg?: number;
  @Input() ratingPersonal?: number | null;
  @Input() complexity?: number;
  @Input() lastPlayed?: string | null;

  @Input() mainGameName?: string | null;

  get bggUrl(): string {
    if (this.mainGameName == null) {
      return "https://boardgamegeek.com/boardgame/" + this.bggId;
    } else {
      return "https://boardgamegeek.com/boardgameexpansion/" + this.bggId;
    }
  }
}
