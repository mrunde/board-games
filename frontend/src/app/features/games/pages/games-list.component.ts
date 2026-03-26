import {DatePipe, NgFor, NgIf} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from "@angular/material/icon";
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {debounceTime, Subject} from "rxjs";
import {BoardgamesService} from '../../../core/api/boardgames.service';
import {GameCardComponent} from '../components/game-card.component';
import {LanguageSwitcherComponent} from "../components/language-switcher.component";
import {GameDetail} from '../models/game.model';

@Component({
  selector: 'games-list',
  standalone: true,
  imports: [
    GameCardComponent,
    LanguageSwitcherComponent,
    FormsModule,
    NgFor,
    NgIf,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatInputModule,
    MatNativeDateModule,
    MatTooltipModule,
    TranslatePipe
  ],
  providers: [DatePipe],
  template: `
    <div class="page">
      <div class="sticky-header">
        <div class="header-row">
          <h1>{{ 'games.title' | translate }}</h1>

          <div class="header-actions">
            <div class="games-count">
              {{
                (games.length === 1 ? 'games.count_one' : 'games.count_other')
                  | translate:{count: games.length}
              }}
            </div>

            <app-language-switcher></app-language-switcher>
          </div>
        </div>

        <div class="quick-filters">
          <button type="button" (click)="setPlayers(2)" [class.active]="players === 2">
            2
            <mat-icon>group</mat-icon>
          </button>
          <button type="button" (click)="setPlayers(3)" [class.active]="players === 3">
            3
            <mat-icon>group</mat-icon>
          </button>
          <button type="button" (click)="setPlayers(4)" [class.active]="players === 4">
            4
            <mat-icon>group</mat-icon>
          </button>
          <button type="button" (click)="clearFilters()" [class.active]="players == null && !search">
            {{ 'common.all' | translate }}
          </button>

          <button
            type="button"
            (click)="toggleRecommendedSplit()"
            [class.active]="splitRecommended"
            [disabled]="players == null"
          >
            {{ 'common.recommended' | translate }}
          </button>
        </div>

        <div class="filters">
          <input
            type="text"
            [placeholder]="'game.name' | translate"
            [(ngModel)]="search"
            (ngModelChange)="onFiltersChanged()"
          />

          <input
            type="number"
            [placeholder]="'game.players' | translate"
            [(ngModel)]="players"
            (ngModelChange)="onFiltersChanged()"
          />

          <select [(ngModel)]="sort" (change)="onSortChanged()">
            <option value="name">{{ 'game.name' | translate }}</option>
            <option value="lastPlayed">{{ 'play.lastPlayed' | translate }}</option>
            <option value="ratingBgg">{{ 'game.ratingBgg' | translate }}</option>
            <option value="ratingPersonal">{{ 'game.ratingPersonal' | translate }}</option>
            <option value="complexity">{{ 'game.complexity' | translate }}</option>
          </select>

          <button
            mat-icon-button
            color="primary"
            (click)="toggleDirection()"
            [matTooltip]="(dir === 'asc' ? 'games.sortAscending' : 'games.sortDescending') | translate"
          >
            <mat-icon>
              {{ dir === 'asc' ? 'north' : 'south' }}
            </mat-icon>
          </button>
        </div>
      </div>

      <div class="list" *ngIf="games.length > 0; else noResults">
        <ng-container *ngIf="shouldSplitRecommended(); else plainList">
          <game-card
            *ngFor="let game of recommendedGames"
            [game]="game"
            [filterPlayers]="players"
          ></game-card>

          <hr *ngIf="recommendedGames.length > 0 && otherGames.length > 0" class="games-divider">

          <game-card
            *ngFor="let game of otherGames"
            [game]="game"
            [filterPlayers]="players"
          ></game-card>
        </ng-container>

        <ng-template #plainList>
          <game-card
            *ngFor="let game of games"
            [game]="game"
            [filterPlayers]="players"
          ></game-card>
        </ng-template>
      </div>

      <ng-template #noResults>
        <div class="no-results">
          <mat-icon>search_off</mat-icon>
          <div>{{ 'games.noResults' | translate }}</div>
        </div>
      </ng-template>
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

    .sticky-header h1 {
      margin: 0;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .header-actions {
      display: grid;
      grid-template-columns: max-content auto;
      align-items: center;
      gap: 12px;
    }

    .games-count {
      font-size: 14px;
      font-weight: 600;
      color: #555;
      white-space: nowrap;
      min-width: 92px;
      text-align: right;
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

    .quick-filters button.active {
      background: rgba(63, 81, 181, 0.12);
      color: #3f51b5;
      border-color: #3f51b5;
    }

    .quick-filters button,
    .filters select,
    .filters input {
      padding: 8px 10px;
      border-radius: 10px;
      border: 1px solid #ccc;
      background: white;
    }

    .filters {
      display: grid;
      grid-template-columns: minmax(80px, 0.8fr) minmax(0, 1fr) auto auto;
      gap: 10px;
      margin-bottom: 14px;
      align-items: center;
    }

    @media (min-width: 700px) {
      .filters {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .quick-filters mat-icon {
      font-size: 1em;
      width: 1em;
      height: 1em;
      line-height: 1;
      vertical-align: middle;
    }

    .list {
      position: relative;
      z-index: 1;
    }

    .no-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 32px 16px;
      color: #757575;
      text-align: center;
    }

    .no-results mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    .games-divider {
      border: 0;
      border-top: 1px solid #d8d8d8;
      margin: 16px 0 18px;
    }
  `]
})
export class GamesListComponent implements OnInit {
  games: GameDetail[] = [];
  allGames: GameDetail[] = [];
  splitRecommended = false;

  search = '';
  players?: number;
  sort = 'name';
  dir = 'asc';

  selectedPlayDate: Date | null = new Date();

  private readonly storageKey = 'games-list.state.v1';
  private readonly filtersChanged$ = new Subject<void>();

  constructor(private readonly api: BoardgamesService) {
  }

  get recommendedGames(): GameDetail[] {
    if (this.players == null) {
      return this.games;
    }

    return this.games.filter(game => this.isRecommendedForPlayers(game));
  }

  get otherGames(): GameDetail[] {
    if (this.players == null) {
      return [];
    }

    return this.games.filter(game => !this.isRecommendedForPlayers(game));
  }

  ngOnInit(): void {
    this.restoreState();

    this.filtersChanged$
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.saveState();
        this.load();
      });

    this.load();
  }

  load(): void {
    this.api.getGames(
      this.players,
      this.sort,
      this.dir
    ).subscribe(g => {
      this.allGames = g;
      this.applySearchFilter();
    });
  }

  setPlayers(players: number): void {
    this.players = players;
    this.onFiltersChanged();
  }

  clearFilters(): void {
    this.search = '';
    this.players = undefined;
    this.splitRecommended = false;
    this.onFiltersChanged();
  }

  toggleRecommendedSplit(): void {
    if (this.players == null) {
      this.splitRecommended = false;
      return;
    }

    this.splitRecommended = !this.splitRecommended;
    this.saveState();
  }

  shouldSplitRecommended(): boolean {
    return this.splitRecommended && this.players != null;
  }

  onFiltersChanged(): void {
    this.filtersChanged$.next();
  }

  onSortChanged(): void {
    if (this.sort === 'name') {
      this.dir = 'asc';
    } else if (
      this.sort === 'lastPlayed' ||
      this.sort === 'ratingBgg' ||
      this.sort === 'ratingPersonal' ||
      this.sort === 'complexity'
    ) {
      this.dir = 'desc';
    }

    this.onFiltersChanged();
  }

  toggleDirection(): void {
    this.dir = this.dir === 'asc' ? 'desc' : 'asc';
    this.onFiltersChanged();
  }

  private applySearchFilter(): void {
    const query = this.search.trim().toLowerCase();

    if (!query) {
      this.games = this.allGames;
      return;
    }

    this.games = this.allGames.filter(game => {
      const gameMatches = game.name.toLowerCase().includes(query);
      const expansionMatches = game.expansions?.some(expansion =>
        expansion.name.toLowerCase().includes(query)
      );

      return gameMatches || expansionMatches;
    });
  }

  private saveState(): void {
    const state = {
      search: this.search,
      players: this.players ?? null,
      splitRecommended : this.splitRecommended,
      sort: this.sort,
      dir: this.dir,
    };

    sessionStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  private restoreState(): void {
    const raw = sessionStorage.getItem(this.storageKey);
    if (!raw) {
      return;
    }

    try {
      const state = JSON.parse(raw) as {
        search: string | null;
        players: number | null;
        splitRecommended: boolean;
        sort: string;
        dir: string;
      };

      this.search = state.search || '';
      this.players = state.players ?? undefined;
      if (this.players == null) {
        this.splitRecommended = false;
      } else {
        this.splitRecommended = state.splitRecommended;
      }
      this.sort = state.sort || 'name';
      this.dir = state.dir || 'asc';

      if (this.sort === 'name') {
        this.dir = 'asc';
      } else if (
        this.sort === 'lastPlayed' ||
        this.sort === 'ratingBgg' ||
        this.sort === 'ratingPersonal' ||
        this.sort === 'complexity'
      ) {
        if (!state.dir) {
          this.dir = 'desc';
        }
      }
    } catch {
      this.selectedPlayDate = new Date();
      this.sort = 'name';
      this.dir = 'asc';
    }
  }

  private isRecommendedForPlayers(game: GameDetail): boolean {
    return (
      this.players != null &&
      game.playersRecMin <= this.players &&
      game.playersRecMax >= this.players
    );
  }
}
