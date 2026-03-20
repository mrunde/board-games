import {NgIf} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton} from "@angular/material/button";
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from "@angular/material/icon";
import {MatInputModule} from '@angular/material/input';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from "@ngx-translate/core";
import {formatRange} from "../../../shared/utils/range-format.util";
import {ComplexityIndicatorComponent} from "./indicators/complexity-indicator.component";
import {LastPlayedIndicatorComponent} from "./indicators/last-played-indicator.component";
import {RatingIndicatorComponent} from "./indicators/rating-indicator.component";

@Component({
  selector: 'detail-shell',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    MatNativeDateModule,
    NgIf,
    RouterLink,
    TranslatePipe,
    ComplexityIndicatorComponent,
    LastPlayedIndicatorComponent,
    RatingIndicatorComponent
  ],
  template: `
    <div class="page">
      <div class="nav-actions">
        <button class="nav-btn" type="button" (click)="back.emit()">
          {{ 'navigation.back' | translate }}
        </button>
        <a class="nav-btn home-btn" routerLink="/">
          {{ 'navigation.home' | translate }}
        </a>
      </div>

      <div *ngIf="loading" class="info-card">
        {{ loadingText || 'common.loading' | translate }}
      </div>

      <div *ngIf="error" class="error-card">
        {{ error }}
      </div>

      <div *ngIf="successMessage" class="success-card">
        {{ successMessage }}
      </div>

      <div class="card" *ngIf="!loading && !error && title" [class.recent]="recent">
        <div class="media" *ngIf="imageUrl">
          <img
            class="cover clickable"
            [src]="imageUrl!"
            (click)="openImagePreview()"
            (error)="imageUrl = null"
            [alt]="title"
          >
        </div>

        <h1>{{ title }}</h1>

        <div *ngIf="mainGameName && mainGameLink" class="main-game-link">
          {{ 'expansion.mainGame' | translate }}:
          <a [routerLink]="mainGameLink">{{ mainGameName }}</a>
        </div>

        <div class="meta">
          <span class="meta-item">
            <mat-icon class="meta-icon">group</mat-icon>
            {{ playersText }} {{ 'game.players' | translate }}
            ({{ 'game.playersRecommended' | translate }}: {{ playersRecText }})
          </span>
          ·
          <span class="meta-item">
            <mat-icon class="meta-icon">schedule</mat-icon>
            {{ playingTimeText }} {{ 'game.time' | translate }}
          </span>
        </div>

        <div class="stats">
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

        <div class="play-picker">
          <mat-form-field
            appearance="outline"
            class="play-date-field"
            subscriptSizing="dynamic"
          >
            <mat-label>
              {{ 'play.date' | translate }}
            </mat-label>

            <input
              matInput
              [matDatepicker]="picker"
              [ngModel]="selectedPlayDate"
              (ngModelChange)="selectedPlayDateChange.emit($event)"
            >

            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>

            <mat-datepicker #picker>
              <mat-datepicker-actions>
                <button
                  mat-button
                  type="button"
                  matDatepickerCancel
                >
                  {{ 'common.cancel' | translate }}
                </button>

                <button
                  mat-stroked-button
                  type="button"
                  class="today-inside-picker-btn"
                  (click)="today.emit(); picker.close()"
                >
                  {{ 'play.today' | translate }}
                </button>

                <button
                  mat-flat-button
                  color="primary"
                  type="button"
                  matDatepickerApply
                >
                  {{ 'common.apply' | translate }}
                </button>
              </mat-datepicker-actions>
            </mat-datepicker>
          </mat-form-field>

          <button
            type="button"
            class="play-btn"
            (click)="recordPlay.emit()"
            [disabled]="playSubmitting"
          >
            {{
              playSubmitting ? 'play.saving' : 'play.playedOn'
                | translate:{playedOn: playDateLabel}
            }}
          </button>
        </div>

        <div *ngIf="playError" class="error-inline">
          {{ playError }}
        </div>

        <ng-content></ng-content>
      </div>

      <div
        *ngIf="imagePreviewOpen && imageUrl"
        class="image-overlay"
        (click)="closeImagePreview()"
      >
        <img
          class="image-preview"
          [src]="imageUrl!"
          [alt]="title"
          (click)="$event.stopPropagation()"
        >
        <button
          type="button"
          class="close-preview-btn"
          (click)="closeImagePreview(); $event.stopPropagation()"
        >
          ×
        </button>
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

    .media {
      width: 100%;
      height: 240px;
      margin-bottom: 12px;
    }

    .cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 10px;
      background: #eee;
    }

    .clickable {
      cursor: zoom-in;
    }

    .image-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      z-index: 1000;
    }

    .image-preview {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 10px;
      background: #111;
    }

    .close-preview-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 999px;
      background: white;
      cursor: pointer;
      font-size: 24px;
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

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .meta-icon {
      font-size: 1em;
      width: 1em;
      height: 1em;
      line-height: 1;
      vertical-align: middle;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 14px;
      align-items: center;
      justify-items: center;
    }

    /* Mobile: 2x2 layout */
    @media (max-width: 600px) {
      .stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    .play-picker {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }

    .play-picker mat-form-field,
    .play-date-field {
      flex: 1 1 260px;
      min-width: 220px;
    }

    .play-btn {
      height: 56px;
      box-sizing: border-box;
      border: 1px solid #1976d2;
      background: #1976d2;
      border-radius: 10px;
      padding: 0 16px;
      cursor: pointer;
      color: white;
      font-weight: 600;
      white-space: nowrap;
      align-self: flex-end;
    }

    .play-btn:disabled {
      opacity: 0.7;
      cursor: default;
    }

    @media (max-width: 600px) {
      .play-picker {
        align-items: stretch;
      }

      .play-btn {
        width: 100%;
      }
    }

    .error-inline {
      margin-bottom: 12px;
    }
  `]
})
export class DetailShellComponent {
  @Input() loading = false;
  @Input() loadingText: string | null = null;
  @Input() error: string | null = null;
  @Input() successMessage: string | null = null;

  @Input() bggId?: number;
  @Input() title?: string;
  @Input() imageUrl?: string | null;
  @Input() ratingBgg?: number;
  @Input() ratingPersonal?: number | null;
  @Input() playingTimeMin?: number;
  @Input() playingTimeMax?: number;
  @Input() complexity?: number;
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
  @Output() recordPlay = new EventEmitter<void>();
  @Output() selectedPlayDateChange = new EventEmitter<Date | null>();

  imagePreviewOpen = false;

  get bggUrl(): string {
    if (this.mainGameName == null) {
      return "https://boardgamegeek.com/boardgame/" + this.bggId;
    } else {
      return "https://boardgamegeek.com/boardgameexpansion/" + this.bggId;
    }
  }

  get playersText(): string {
    return formatRange(this.playersMin, this.playersMax);
  }

  get playersRecText(): string {
    return formatRange(this.playersRecMin, this.playersRecMax);
  }

  get playingTimeText(): string {
    return formatRange(this.playingTimeMin, this.playingTimeMax, ' min');
  }

  openImagePreview(): void {
    if (this.imageUrl) {
      this.imagePreviewOpen = true;
    }
  }

  closeImagePreview(): void {
    this.imagePreviewOpen = false;
  }
}
