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
          <button type="button" (click)="setPlayers(2)" [class.active]="players === 2">2p</button>
          <button type="button" (click)="setPlayers(3)" [class.active]="players === 3">3p</button>
          <button type="button" (click)="setPlayers(4)" [class.active]="players === 4">4p</button>
          <button type="button" (click)="clearPlayers()" [class.active]="players == null">
            {{ 'common.all' | translate }}
          </button>
        </div>

        <div class="filters">
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
        <game-card
          *ngFor="let game of games"
          [game]="game"
          [filterPlayers]="players"
        ></game-card>
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
      padding-top: 8px;
      padding-bottom: 8px;
      margin-bottom: 14px;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sticky-header h1 {
      margin: 0;
    }

    .games-count {
      font-size: 14px;
      font-weight: 600;
      color: #555;
      white-space: nowrap;
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
      grid-template-columns: minmax(80px, 0.8fr) minmax(0, 1fr) auto;
      gap: 10px;
      margin-bottom: 14px;
      align-items: center;
    }

    .list {
      position: relative;
      z-index: 1;
    }

    @media (min-width: 700px) {
      .filters {
        grid-template-columns: repeat(4, 1fr);
      }
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
  `]
})
export class GamesListComponent implements OnInit {
  games: GameDetail[] = [];

  players?: number;
  sort = 'name';
  dir = 'asc';

  selectedPlayDate: Date | null = new Date();

  private readonly storageKey = 'games-list.state.v1';
  private readonly filtersChanged$ = new Subject<void>();

  constructor(private readonly api: BoardgamesService) {
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
    ).subscribe(g => this.games = g);
  }

  setPlayers(players: number): void {
    this.players = players;
    this.onFiltersChanged();
  }

  clearPlayers(): void {
    this.players = undefined;
    this.onFiltersChanged();
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

  private saveState(): void {
    const state = {
      minPlayers: this.players ?? null,
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
        players: number | null;
        sort: string;
        dir: string;
        selectedPlayDate: string | null;
      };

      this.players = state.players ?? undefined;
      this.sort = state.sort || 'name';
      this.dir = state.dir || 'asc';
      this.selectedPlayDate = state.selectedPlayDate ? new Date(state.selectedPlayDate) : new Date();

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
}
