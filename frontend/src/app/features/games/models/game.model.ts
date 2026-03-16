export interface Expansion {
  bggId: number;
  name: string;
  ratingBgg: number;
  ratingPersonal: number | null;
  playingTimeMin: number;
  playingTimeMax: number;
  weight: number;
  playersMin: number;
  playersMax: number;
  playersRecMin: number;
  playersRecMax: number;
  mainGameId: number;
  lastPlayed: string | null;
}

export interface GameDetail {
  bggId: number;
  name: string;
  ratingBgg: number;
  ratingPersonal: number | null;
  playingTimeMin: number;
  playingTimeMax: number;
  weight: number;
  playersMin: number;
  playersMax: number;
  playersRecMin: number;
  playersRecMax: number;
  lastPlayed: string | null;
  expansions: Expansion[];
}
