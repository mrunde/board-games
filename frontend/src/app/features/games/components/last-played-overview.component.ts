import {NgForOf, NgIf} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIconButton} from "@angular/material/button";
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {formatLastPlayed} from "../../../shared/utils/last-played-format.util";
import {Play} from "../models/play.model";

@Component({
  selector: 'last-played-overview',
  standalone: true,
  imports: [
    MatDividerModule,
    MatExpansionModule,
    MatIcon,
    MatIconButton,
    MatListModule,
    NgForOf,
    NgIf,
    TranslatePipe,
  ],
  template: `
    <mat-expansion-panel
      class="last-played-panel"
      *ngIf="plays.length"
      [expanded]="true"
    >
      <mat-expansion-panel-header>
        <mat-panel-title>
          <mat-icon class="title-icon">history</mat-icon>
          {{ 'play.lastPlayed' | translate }}
        </mat-panel-title>

        <mat-panel-description>
          {{ plays.length }}
        </mat-panel-description>
      </mat-expansion-panel-header>

      <ng-container *ngFor="let group of groupedPlays">
        <div class="year-header">
          {{ group.year }}
        </div>

        <mat-list class="last-played-list">
          <mat-list-item *ngFor="let play of group.plays">
            <mat-icon matListItemIcon>event_available</mat-icon>

            <div matListItemTitle>
              {{ formatLastPlayedRef(play.playedOn) }}
            </div>

            <button
              mat-icon-button
              matListItemMeta
              type="button"
              class="delete-play-button"
              (click)="deletePlay.emit(play)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </mat-list-item>
        </mat-list>
      </ng-container>
    </mat-expansion-panel>
  `,
  styles: [`
    .last-played-panel {
      margin: 10px 0 16px;
      border: 1px solid #d8e2f0;
      border-radius: 14px;
      box-shadow: none;
      background: #f8fbff;
      overflow: hidden;
    }

    mat-panel-title {
      align-items: center;
      gap: 8px;
      color: #174a7c;
      font-weight: 600;
    }

    mat-panel-description {
      justify-content: flex-end;
      flex-grow: 0;
      min-width: 32px;
      color: #174a7c;
      font-weight: 600;
    }

    .title-icon {
      color: #1976d2;
    }

    .year-header {
      margin: 12px 0 6px;
      padding: 4px 8px;
      font-weight: 600;
      font-size: 14px;
      color: #174a7c;
    }

    .last-played-list {
      margin-bottom: 8px;
      padding: 0;
      background: white;
      border: 1px solid #d8e2f0;
      border-radius: 12px;
      overflow: hidden;
    }

    mat-list-item {
      --mdc-list-list-item-leading-icon-color: #1976d2;
    }

    mat-list-item {
      cursor: default;
    }
  `]
})
export class LastPlayedOverviewComponent {
  @Input() plays: Play[] = [];

  @Output() deletePlay = new EventEmitter<Play>();

  constructor(
    private readonly translate: TranslateService
  ) {
  }

  formatLastPlayedRef(playedOn: string): string {
    const lang = this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'en';
    return formatLastPlayed(playedOn, lang);
  }

  get groupedPlays(): { year: number; plays: Play[] }[] {
    const groups = new Map<number, Play[]>();

    for (const play of this.plays) {
      const year = new Date(play.playedOn).getFullYear();

      if (!groups.has(year)) {
        groups.set(year, []);
      }

      groups.get(year)!.push(play);
    }

    return Array.from(groups.entries())
      .map(([year, plays]) => ({year, plays}))
      .sort((a, b) => b.year - a.year); // newest year first
  }
}
