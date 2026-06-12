import {NgForOf, NgIf} from '@angular/common';
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
import {AssetFile, Expansion, GameDetail} from "../models/game.model";
import {Play} from "../models/play.model";
import {DetailPageUiService} from "../services/detail-page-ui.service";
import {GameIndicatorsComponent} from "./game-indicators.component";
import {LanguageSwitcherComponent} from "./language-switcher.component";
import {LastPlayedOverviewComponent} from "./last-played-overview.component";

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
    NgForOf,
    NgIf,
    RouterLink,
    TranslatePipe,
    GameIndicatorsComponent,
    LanguageSwitcherComponent,
    LastPlayedOverviewComponent
  ],
  template: `
    <div class="page">
      <div class="nav-actions">
        <button class="nav-btn" type="button" (click)="back.emit()">
          <mat-icon>arrow_back</mat-icon>
          {{ 'navigation.back' | translate }}
        </button>

        <a class="nav-btn home-btn" routerLink="/">
          <mat-icon>home</mat-icon>
          {{ 'navigation.home' | translate }}
        </a>

        <app-language-switcher></app-language-switcher>
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

      <div
        class="card"
        *ngIf="!loading && !error && game?.name"
        [class.recent]="ui.isRecentlyPlayed(game?.lastPlayed ?? null)"
      >
        <div class="media" *ngIf="game?.imageUrl">
          <img
            class="cover clickable"
            [src]="game?.imageUrl!"
            (click)="openImagePreview()"
            [alt]="game?.name"
          >
        </div>

        <h1>{{ game?.name }}</h1>

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

          <span class="meta-item">
            <mat-icon class="meta-icon">schedule</mat-icon>
            {{ playingTimeText }} {{ 'game.time' | translate }}
          </span>
        </div>

        <game-indicators
          [bggId]="game?.bggId!!"
          [isExpansion]="mainGameName != null"
          [ratingBgg]="game?.ratingBgg"
          [ratingPersonal]="game?.ratingPersonal"
          [complexity]="game?.complexity"
          [lastPlayed]="game?.lastPlayed"
        ></game-indicators>

        <section class="notes" *ngIf="game?.notes">
          <h2>{{ 'game.notes' | translate }}</h2>
          <p>{{ game?.notes }}</p>
        </section>

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

        <div *ngIf="game?.files?.length" class="asset-section">
          <h2 class="asset-title">{{ 'common.files' | translate }}</h2>

          <div class="asset-language-groups">
            <div *ngFor="let group of groupedFiles" class="asset-language-group">
              <div class="asset-language-header">
                <img
                  class="asset-language-flag"
                  [src]="flagUrl(group.language)"
                  [alt]="group.language.toUpperCase()"
                >
                <span>{{ languageLabel(group.language) }}</span>
              </div>

              <div class="asset-list">
                <a
                  *ngFor="let file of group.files"
                  class="asset-link"
                  [href]="file.url"
                  target="_blank"
                  rel="noopener"
                  [attr.aria-label]="file.label + ' ' + group.language"
                >
                  <span class="asset-label">{{ file.label }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <last-played-overview
          [plays]="lastPlayedEntries"
          (deletePlay)="deletePlay.emit($event)"
        ></last-played-overview>
      </div>

      <div
        *ngIf="imagePreviewOpen && game?.imageUrl"
        class="image-overlay"
        (click)="closeImagePreview()"
      >
        <img
          class="image-preview"
          [src]="game?.imageUrl!"
          [alt]="game?.name"
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
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      padding: 8px 12px;
      margin-bottom: 12px;
    }

    .nav-actions > *:first-child {
      justify-self: start;
    }

    .home-btn {
      justify-self: center;
    }

    app-language-switcher {
      justify-self: end;
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

    .nav-btn mat-icon {
      margin-right: 5px;
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
      padding: 14px;
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
      margin-bottom: 8px;
      font-size: 13px;
    }

    .main-game-link a {
      text-decoration: none;
      font-weight: 600;
      color: #1976d2;
    }

    .meta {
      font-size: 13px;
      opacity: 0.75;
      margin-top: 6px;
      margin-bottom: 12px;
    }

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-right: 10px;
    }

    .meta-icon {
      font-size: 1em;
      width: 1em;
      height: 1em;
      line-height: 1;
      vertical-align: middle;
    }

    .notes {
      margin-top: 18px;
      margin-bottom: 27px;
    }

    .notes h2 {
      margin: 0 0 8px;
    }

    .notes p {
      margin: 0;
      white-space: pre-line;
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

    .asset-section {
      margin: 16px 0 18px;
    }

    .asset-title {
      margin-top: 18px;
    }

    .asset-language-groups {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .asset-language-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .asset-language-header {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #4b647d;
    }

    .asset-language-flag {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
      flex: 0 0 16px;
    }

    .asset-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .asset-link {
      display: inline-flex;
      align-items: center;
      min-height: 40px;
      padding: 8px 12px;
      border-radius: 12px;
      border: 1px solid #d8e2f0;
      background: #f8fbff;
      color: #174a7c;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: background 120ms ease, border-color 120ms ease, transform 120ms ease;
    }

    .asset-link:hover {
      background: #eef6ff;
      border-color: #b8d2ee;
      transform: translateY(-1px);
    }

    .asset-label {
      line-height: 1.2;
    }

    @media (max-width: 600px) {
      .asset-list {
        flex-direction: column;
      }

      .asset-link {
        justify-content: space-between;
      }
    }
  `]
})
export class DetailShellComponent {
  @Input() loading = false;
  @Input() loadingText: string | null = null;
  @Input() error: string | null = null;
  @Input() successMessage: string | null = null;

  @Input() game?: GameDetail | Expansion;

  @Input() mainGameName?: string | null;
  @Input() mainGameLink?: unknown[] | null;

  @Input() selectedPlayDate: Date | null = null;
  @Input() playDateLabel = 'today';
  @Input() playSubmitting = false;
  @Input() playError: string | null = null;

  @Input() lastPlayedEntries: Play[] = []

  @Output() back = new EventEmitter<void>();
  @Output() today = new EventEmitter<void>();
  @Output() recordPlay = new EventEmitter<void>();
  @Output() selectedPlayDateChange = new EventEmitter<Date | null>();
  @Output() deletePlay = new EventEmitter<Play>();

  imagePreviewOpen = false;

  constructor(
    public ui: DetailPageUiService,
  ) {
  }

  get playersText(): string {
    return formatRange(this.game?.playersMin, this.game?.playersMax);
  }

  get playersRecText(): string {
    return formatRange(this.game?.playersRecMin, this.game?.playersRecMax);
  }

  get playingTimeText(): string {
    return formatRange(this.game?.playingTimeMin, this.game?.playingTimeMax, ' min');
  }

  get groupedFiles(): Array<{ language: string; files: AssetFile[] }> {
    const groups = new Map<string, AssetFile[]>();

    for (const file of this.game?.files || []) {
      const language = (file.language ?? '').toLowerCase();
      const existing = groups.get(language) ?? [];
      existing.push(file);
      groups.set(language, existing);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([language, files]) => ({
        language,
        files: files.slice().sort((a, b) => a.label.localeCompare(b.label)),
      }));
  }

  languageLabel(language: string | null | undefined): string {
    const code = (language ?? '').toLowerCase();
    if (code === 'de') return 'Deutsch';
    if (code === 'en') return 'English';
    return code.toUpperCase();
  }

  flagUrl(language: string | null | undefined): string {
    const code = (language ?? '').toLowerCase();
    return code === 'de' || code === 'en'
      ? `assets/flags/${code}.svg`
      : 'assets/flags/en.svg';
  }

  openImagePreview(): void {
    if (this.game?.imageUrl) {
      this.imagePreviewOpen = true;
    }
  }

  closeImagePreview(): void {
    this.imagePreviewOpen = false;
  }
}
