export interface Expansion {
  bggId: number;
  name: string;
  imageUrl: string | null;
  ratingBgg: number;
  ratingPersonal: number | null;
  playingTimeMin: number;
  playingTimeMax: number;
  complexity: number;
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
  imageUrl: string | null;
  ratingBgg: number;
  ratingPersonal: number | null;
  playingTimeMin: number;
  playingTimeMax: number;
  complexity: number;
  playersMin: number;
  playersMax: number;
  playersRecMin: number;
  playersRecMax: number;
  lastPlayed: string | null;
  expansions: Expansion[];
}
