import {DatePipe, NgFor, NgIf} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {BoardgamesService} from '../../../core/api/boardgames.service';
import {LanguageSwitcherComponent} from '../components/language-switcher.component';
import {PlayCalendarEntry} from '../models/play.model';

interface CalendarDay {
  date: Date;
  isoDate: string;
  inMonth: boolean;
  plays: PlayCalendarEntry[];
}

@Component({
  selector: 'plays-calendar-page',
  standalone: true,
  imports: [
    DatePipe,
    LanguageSwitcherComponent,
    MatButtonModule,
    MatIcon,
    NgFor,
    NgIf,
    RouterLink,
    TranslatePipe
  ],
  template: `
    <div class="page">
      <div class="sticky-header">
        <div class="header-row">
          <div>
            <a routerLink="/" class="back-link">
              <mat-icon>home</mat-icon>
              {{ 'navigation.home' | translate }}
            </a>
            <h1>{{ monthLabel }}</h1>
          </div>
          <app-language-switcher></app-language-switcher>
        </div>

        <div class="quick-filters">
          <button mat-stroked-button type="button" (click)="previousMonth()">
            <mat-icon>chevron_left</mat-icon>
            {{ 'calendar.previousMonth' | translate }}
          </button>
          <button mat-stroked-button type="button" (click)="goToCurrentMonth()">
            {{ 'calendar.today' | translate }}
          </button>
          <button mat-stroked-button type="button" (click)="nextMonth()">
            {{ 'calendar.nextMonth' | translate }}
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>

      <section class="calendar">
        <div class="weekday" *ngFor="let weekdayLabel of weekdayLabels">
          {{ weekdayLabel }}
        </div>

        <div
          class="day"
          *ngFor="let day of days"
          [class.outside]="!day.inMonth"
          [class.today]="day.isoDate === todayIso"
        >
          <div class="day-number">{{ day.date | date:'d' }}</div>

          <div class="plays" *ngIf="day.plays.length">
            <a
              class="play"
              *ngFor="let play of day.plays"
              [routerLink]="[play.isExpansion ? '/expansions' : '/games', play.bggId]"
              [title]="play.name"
            >
              <img [src]="play.imageUrl" [alt]="play.name" loading="lazy"/>
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page {
      max-width: 800px;
      margin: auto;
      padding: 12px;
    }

    .sticky-header {
      position: sticky;
      top: 0;
      z-index: 20;
      background: #f5f5f5;
      padding: 8px 12px;
      margin-bottom: 14px;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
    }

    .sticky-header h1 {
      margin: 8px 0 0;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: inherit;
      text-decoration: none;
      font-weight: 600;
    }

    app-language-switcher {
      justify-self: end;
      flex: 0 0 auto;
    }

    .quick-filters {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .quick-filters mat-icon {
      font-size: 1em;
      width: 1em;
      height: 1em;
      line-height: 1;
      vertical-align: middle;
    }

    .calendar {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      border: 1px solid #d8d8d8;
      border-radius: 14px;
      overflow: hidden;
      background: white;
    }

    .weekday {
      padding: 10px 4px;
      text-align: center;
      font-weight: 700;
      background: #f5f5f5;
      border-bottom: 1px solid #d8d8d8;
    }

    .day {
      min-height: 108px;
      padding: 5px;
      border-right: 1px solid #e2e2e2;
      border-bottom: 1px solid #e2e2e2;
      background: white;
    }

    .day:nth-child(7n) {
      border-right: 0;
    }

    .outside {
      background: #fafafa;
      color: #999;
    }

    .day-number {
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .today .day-number {
      background: #333;
      color: white;
    }

    .plays {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
      gap: 4px;
    }

    .play {
      border-radius: 8px;
      overflow: hidden;
      background: #eee;
      display: block;
      min-height: 44px;
    }

    .play img {
      width: 100%;
      height: 52px;
      object-fit: cover;
      display: block;
    }

    @media (max-width: 700px) {
      .calendar {
        font-size: 12px;
      }

      .day {
        min-height: 84px;
        padding: 4px;
      }

      .weekday {
        padding: 8px 2px;
      }

      .plays {
        grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
      }

      .play img {
        height: 40px;
      }
    }
  `]
})
export class PlaysCalendarPageComponent implements OnInit {
  visibleMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  readonly todayIso = this.toIsoDate(new Date());
  days: CalendarDay[] = [];
  monthLabel = '';
  weekdayLabels: string[] = [];

  private plays: PlayCalendarEntry[] = [];

  constructor(
    private readonly api: BoardgamesService,
    private readonly translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.updateLocalizedLabels();
    this.translate.onLangChange.subscribe(() => {
      this.updateLocalizedLabels();
    })

    this.loadMonth();
  }

  private updateLocalizedLabels(): void {
    const lang = this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'en';

    // Create labels for weekdays
    const monday = new Date(2024, 0, 1);
    this.weekdayLabels = Array.from({length: 7}, (_, index) =>
      new Intl.DateTimeFormat(lang, {weekday: 'short'}).format(
        new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index),
      ),
    );

    // Create label for visible month
    this.monthLabel = new Intl.DateTimeFormat(lang, {
      month: 'long',
      year: 'numeric'
    }).format(this.visibleMonth)
  }

  previousMonth(): void {
    this.visibleMonth = new Date(this.visibleMonth.getFullYear(), this.visibleMonth.getMonth() - 1, 1);
    this.loadMonth();
  }

  nextMonth(): void {
    this.visibleMonth = new Date(this.visibleMonth.getFullYear(), this.visibleMonth.getMonth() + 1, 1);
    this.loadMonth();
  }

  goToCurrentMonth(): void {
    const now = new Date();
    this.visibleMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    this.loadMonth();
  }

  private loadMonth(): void {
    const year = this.visibleMonth.getFullYear();
    const month = this.visibleMonth.getMonth() + 1;

    this.api.getPlaysByYearAndMonth(year, month).subscribe(plays => {
      this.plays = plays;
      this.buildCalendarDays();
    });
  }

  private buildCalendarDays(): void {
    const year = this.visibleMonth.getFullYear();
    const month = this.visibleMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const start = new Date(firstOfMonth);
    const mondayOffset = (firstOfMonth.getDay() + 6) % 7;

    start.setDate(firstOfMonth.getDate() - mondayOffset);

    const playsByDate = this.plays.reduce<Record<string, PlayCalendarEntry[]>>((acc, play) => {
      (acc[play.playedOn] ??= []).push(play);
      return acc;
    }, {});

    this.days = Array.from({length: 42}, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const isoDate = this.toIsoDate(date);

      return {
        date,
        isoDate,
        inMonth: date.getMonth() === month,
        plays: playsByDate[isoDate] ?? [],
      };
    });
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
