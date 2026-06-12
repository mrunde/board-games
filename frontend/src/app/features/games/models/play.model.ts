export interface Play {
  bggId: number;
  playedOn: string;
}

export interface PlayCalendarEntry {
  bggId: number;
  name: string;
  isExpansion: boolean;
  imageUrl: string;
  playedOn: string;
}
