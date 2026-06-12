import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Expansion, GameDetail} from '../../features/games/models/game.model';
import {Play, PlayCalendarEntry} from "../../features/games/models/play.model";

@Injectable({
  providedIn: 'root'
})
export class BoardgamesService {
  private readonly http = inject(HttpClient);

  getGames(
    players?: number,
    sort: string = 'name',
    dir: string = 'asc'
  ): Observable<GameDetail[]> {
    let params = new HttpParams()
      .set('sort', sort)
      .set('dir', dir);

    if (players != null) params = params.set('players', players);

    return this.http.get<GameDetail[]>(`${environment.apiBase}/games`, {params});
  }

  getGameById(bggId: number): Observable<GameDetail> {
    return this.http.get<GameDetail>(`${environment.apiBase}/games/${bggId}`);
  }

  getExpansionById(bggId: number): Observable<Expansion> {
    return this.http.get<Expansion>(`${environment.apiBase}/expansions/${bggId}`);
  }

  updateGame(game: Partial<GameDetail>): Observable<GameDetail> {
    return this.http.put<GameDetail>(`${environment.apiBase}/games/${game.bggId}`, game);
  }

  getPlaysById(bggId: number): Observable<Play[]> {
    return this.http.get<Play[]>(`${environment.apiBase}/plays/${bggId}`);
  }

  getPlaysByYearAndMonth(year: number, month: number): Observable<PlayCalendarEntry[]> {
    return this.http.get<PlayCalendarEntry[]>(`${environment.apiBase}/plays/${year}/${month}`);
  }

  recordPlay(bggId: number, playedOn: string): Observable<void> {
    return this.http.post<void>(`${environment.apiBase}/plays`, {
      bggId,
      playedOn
    });
  }

  deletePlay(bggId: number, playedOn: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBase}/plays/${bggId}/${playedOn}`);
  }
}
