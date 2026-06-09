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
  spotifyUrl: string | null;
  notes: string | null;
  lastPlayed: string | null;
  files: AssetFile[];
  mainGameId: number;
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
  spotifyUrl: string | null;
  notes: string | null;
  lastPlayed: string | null;
  files: AssetFile[];
  expansions: Expansion[];
}

export interface Play {
  bggId: number;
  playedOn: string;
}
