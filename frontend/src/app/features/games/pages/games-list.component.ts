import {Component, OnInit} from '@angular/core';
import {DatePipe, NgFor} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {BoardgamesService} from '../../../core/api/boardgames.service';
import {GameDetail} from '../models/game.model';
import {GameCardComponent} from '../components/game-card.component';

@Component({
  selector: 'games-list',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    GameCardComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  providers: [DatePipe],
  template: `
    <div class="page">
      <div class="sticky-header">
        <h1>Board Games</h1>

        <div class="quick-filters">
          <button type="button" (click)="setPlayers(2, 2)">2p</button>
          <button type="button" (click)="setPlayers(3, 4)">3–4p</button>
          <button type="button" (click)="setPlayers(5)">5p+</button>
          <button type="button" (click)="clearPlayers()">All</button>
        </div>

        <div class="filters">
          <input
            type="number"
            placeholder="Min players"
            [(ngModel)]="minPlayers"
            (change)="onFiltersChanged()"
          >

          <input
            type="number"
            placeholder="Max players"
            [(ngModel)]="maxPlayers"
            (change)="onFiltersChanged()"
          >

          <select [(ngModel)]="sort" (change)="onSortChanged()">
            <option value="name">Name</option>
            <option value="lastPlayed">Last played</option>
            <option value="ratingBgg">BGG rating</option>
            <option value="ratingPersonal">Personal rating</option>
            <option value="weight">Weight</option>
          </select>

          <select [(ngModel)]="dir" (change)="onFiltersChanged()">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>

      <div class="list">
        <game-card
          *ngFor="let game of games"
          [game]="game"
          [filterMinPlayers]="minPlayers"
          [filterMaxPlayers]="maxPlayers"
        ></game-card>
      </div>
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

    .sticky-header h1 {
      margin-top: 0;
      margin-bottom: 12px;
    }

    .quick-filters {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
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
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 14px;
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
  `]
})
export class GamesListComponent implements OnInit {
  games: GameDetail[] = [];

  minPlayers?: number;
  maxPlayers?: number;
  sort = 'name';
  dir = 'asc';

  selectedPlayDate: Date | null = new Date();

  private readonly storageKey = 'games-list.state.v1';

  constructor(private readonly api: BoardgamesService) {
  }

  ngOnInit(): void {
    this.restoreState();
    this.load();
  }

  load(): void {
    this.api.getGames(
      this.minPlayers,
      this.maxPlayers,
      this.sort,
      this.dir
    ).subscribe(g => this.games = g);
  }

  onFiltersChanged(): void {
    this.saveState();
    this.load();
  }

  onSortChanged(): void {
    if (this.sort === 'name') {
      this.dir = 'asc';
    } else if (
      this.sort === 'lastPlayed' ||
      this.sort === 'ratingBgg' ||
      this.sort === 'ratingPersonal' ||
      this.sort === 'weight'
    ) {
      this.dir = 'desc';
    }

    this.onFiltersChanged();
  }

  setPlayers(min: number, max?: number): void {
    this.minPlayers = min;
    this.maxPlayers = max;
    this.onFiltersChanged();
  }

  clearPlayers(): void {
    this.minPlayers = undefined;
    this.maxPlayers = undefined;
    this.onFiltersChanged();
  }

  private saveState(): void {
    const state = {
      minPlayers: this.minPlayers ?? null,
      maxPlayers: this.maxPlayers ?? null,
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
        minPlayers: number | null;
        maxPlayers: number | null;
        sort: string;
        dir: string;
        selectedPlayDate: string | null;
      };

      this.minPlayers = state.minPlayers ?? undefined;
      this.maxPlayers = state.maxPlayers ?? undefined;
      this.sort = state.sort || 'name';
      this.dir = state.dir || 'asc';
      this.selectedPlayDate = state.selectedPlayDate ? new Date(state.selectedPlayDate) : new Date();

      if (this.sort === 'name') {
        this.dir = 'asc';
      } else if (
        this.sort === 'lastPlayed' ||
        this.sort === 'ratingBgg' ||
        this.sort === 'ratingPersonal' ||
        this.sort === 'weight'
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
