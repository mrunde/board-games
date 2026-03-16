import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'detail-shell',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  template: `
    <div class="page">
      <div class="nav-actions">
        <button class="nav-btn" type="button" (click)="back.emit()">← Back</button>
        <a class="nav-btn home-btn" routerLink="/">⌂ Home</a>
      </div>

      <div *ngIf="loading" class="info-card">
        {{ loadingText }}
      </div>

      <div *ngIf="error" class="error-card">
        {{ error }}
      </div>

      <div *ngIf="successMessage" class="success-card">
        {{ successMessage }}
      </div>

      <div class="card" *ngIf="!loading && !error && title" [class.recent]="recent">
        <h1>{{ title }}</h1>

        <div *ngIf="mainGameName && mainGameLink" class="main-game-link">
          Main game:
          <a [routerLink]="mainGameLink">{{ mainGameName }}</a>
        </div>

        <div class="meta">
          Players {{ playersMin }}–{{ playersMax }}
          · Recommended {{ playersRecMin }}–{{ playersRecMax }}
          · Time {{ playingTimeMin }}–{{ playingTimeMax }} min
        </div>

        <div class="stats">
          <div>BGG {{ ratingBgg }}</div>
          <div>You {{ ratingPersonal ?? '—' }}</div>
          <div>Weight {{ weight }}</div>
          <div>Last played {{ lastPlayed || '—' }}</div>
        </div>

        <div class="play-picker">
          <mat-form-field appearance="outline">
            <mat-label>Play date</mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              [ngModel]="selectedPlayDate"
              (ngModelChange)="selectedPlayDateChange.emit($event)">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <button type="button" class="today-btn" (click)="today.emit()">Today</button>
          <button type="button" class="play-btn" (click)="play.emit()" [disabled]="playSubmitting">
            {{ playSubmitting ? 'Saving…' : 'Played on ' + playDateLabel }}
          </button>
        </div>

        <div *ngIf="playError" class="error-inline">
          {{ playError }}
        </div>

        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 800px;
      margin: auto;
      padding: 12px;
    }

    .nav-actions {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .nav-btn {
      border: 1px solid #ccc;
      background: white;
      border-radius: 10px;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
      color: inherit;
      display: inline-flex;
      align-items: center;
    }

    .home-btn {
      font-weight: 500;
    }

    .info-card,
    .error-card,
    .success-card {
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 12px;
      background: white;
    }

    .error-card,
    .error-inline {
      color: #b3261e;
    }

    .success-card {
      color: #1b5e20;
      background: #edf7ed;
      border: 1px solid #a5d6a7;
    }

    .card {
      background: white;
      border-radius: 14px;
      padding: 16px;
      border: 2px solid transparent;
    }

    .card.recent {
      border-color: #7cb342;
    }

    .main-game-link {
      margin-bottom: 10px;
      font-size: 14px;
    }

    .main-game-link a {
      text-decoration: none;
      font-weight: 600;
      color: #1976d2;
    }

    .meta {
      opacity: 0.75;
      margin: 8px 0 12px;
    }

    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 14px;
    }

    .play-picker {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }

    .play-picker mat-form-field {
      flex: 1 1 240px;
    }

    .today-btn,
    .play-btn {
      border: 1px solid #ccc;
      background: white;
      border-radius: 10px;
      padding: 8px 12px;
      cursor: pointer;
    }

    .play-btn {
      background: #1976d2;
      border-color: #1976d2;
      color: white;
    }

    .play-btn:disabled {
      opacity: 0.7;
      cursor: default;
    }

    .error-inline {
      margin-bottom: 12px;
    }
  `]
})
export class DetailShellComponent {
  @Input() loading = false;
  @Input() loadingText = 'Loading…';
  @Input() error: string | null = null;
  @Input() successMessage: string | null = null;

  @Input() title?: string;
  @Input() ratingBgg?: number;
  @Input() ratingPersonal?: number | null;
  @Input() playingTimeMin?: number;
  @Input() playingTimeMax?: number;
  @Input() weight?: number;
  @Input() playersMin?: number;
  @Input() playersMax?: number;
  @Input() playersRecMin?: number;
  @Input() playersRecMax?: number;
  @Input() lastPlayed?: string | null;
  @Input() recent = false;

  @Input() mainGameName?: string | null;
  @Input() mainGameLink?: unknown[] | null;

  @Input() selectedPlayDate: Date | null = null;
  @Input() playDateLabel = 'today';
  @Input() playSubmitting = false;
  @Input() playError: string | null = null;

  @Output() back = new EventEmitter<void>();
  @Output() today = new EventEmitter<void>();
  @Output() play = new EventEmitter<void>();
  @Output() selectedPlayDateChange = new EventEmitter<Date | null>();
}
