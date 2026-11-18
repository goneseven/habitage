import { format, parseISO, isValid, differenceInDays } from 'date-fns';

export function formatDate(dateString?: string | null, formatStr: string = 'MMM d, yyyy'): string {
  if (!dateString) return '—';
  try {
    const parsed = parseISO(dateString);
    if (!isValid(parsed)) return '—';
    return format(parsed, formatStr);
  } catch {
    return '—';
  }
}

export function formatRelativeDays(dateString?: string | null): { text: string; isPast: boolean; days: number } {
  if (!dateString) return { text: '—', isPast: false, days: 0 };
  try {
    const target = parseISO(dateString);
    if (!isValid(target)) return { text: '—', isPast: false, days: 0 };
    const today = new Date();
    const days = differenceInDays(target, today);
    if (days < 0) {
      return { text: `${Math.abs(days)} days ago`, isPast: true, days };
    } else if (days === 0) {
      return { text: 'Expires today', isPast: false, days: 0 };
    } else if (days <= 30) {
      return { text: `Expires in ${days} days`, isPast: false, days };
    } else {
      return { text: `${Math.round(days / 30)} months left`, isPast: false, days };
    }
  } catch {
    return { text: '—', isPast: false, days: 0 };
  }
}
