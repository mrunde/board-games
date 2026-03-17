import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Expansion, GameDetail} from '../../features/games/models/game.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardgamesService {
  private readonly http = inject(HttpClient);

  getGames(
    minPlayers?: number,
    maxPlayers?: number,
    sort: string = 'name',
    dir: string = 'asc'
  ): Observable<GameDetail[]> {
    let params = new HttpParams()
      .set('sort', sort)
      .set('dir', dir);

    if (minPlayers != null) params = params.set('minPlayers', minPlayers);
    if (maxPlayers != null) params = params.set('maxPlayers', maxPlayers);

    return this.http.get<GameDetail[]>(`${environment.apiBase}/games`, {params});
  }

  getGameById(bggId: number): Observable<GameDetail> {
    return this.http.get<GameDetail>(`${environment.apiBase}/games/${bggId}`);
  }

  getExpansionById(bggId: number): Observable<Expansion> {
    return this.http.get<Expansion>(`${environment.apiBase}/expansions/${bggId}`);
  }

  recordPlay(bggId: number, playedOn: string): Observable<void> {
    return this.http.post<void>(`${environment.apiBase}/plays`, {
      bggId,
      playedOn
    });
  }
}
