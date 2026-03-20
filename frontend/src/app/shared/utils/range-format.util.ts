export function formatRange(
  min?: number | null,
  max?: number | null,
  suffix = ''
): string {
  if (min == null && max == null) {
    return '—';
  }

  if (min != null && max != null) {
    return min === max ? `${min}${suffix}` : `${min}–${max}${suffix}`;
  }

  return `${min ?? max}${suffix}`;
}
