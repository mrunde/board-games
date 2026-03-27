export interface AssetFile {
  fileName: string;
  url: string;
  language: string;
  label: string;
}

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
  files: AssetFile[];
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
  files: AssetFile[];
  expansions: Expansion[];
}
