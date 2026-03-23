export function formatLastPlayed(lastPlayed?: string | null): string {
  if (!lastPlayed) {
    return '—';
  }

  const played = new Date(lastPlayed);
  if (Number.isNaN(played.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(played);
}
