import {DatePipe} from '@angular/common';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetailPageUiService {
  constructor(private readonly datePipe: DatePipe) {
  }

  isRecentlyPlayed(value: string | null): boolean {
    if (!value) return false;

    const played = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - played.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays <= 30;
  }

  toIsoDate(value: Date | null): string | null {
    if (!value) return null;
    return this.datePipe.transform(value, 'yyyy-MM-dd');
  }

  startTimedSuccess(
    message: string,
    setMessage: (value: string | null) => void,
    clearExisting?: () => void,
    durationMs: number = 3000
  ): number {
    clearExisting?.();
    setMessage(message);

    return window.setTimeout(() => {
      setMessage(null);
    }, durationMs);
  }

  clearTimedSuccess(timeoutId: number | null): void {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  }
}
