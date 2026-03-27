export function formatLastPlayed(lastPlayed?: string | null, locale?: string): string {
  if (!lastPlayed) {
    return '—';
  }

  const played = new Date(lastPlayed);
  if (Number.isNaN(played.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(locale ?? undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(played);
}
