/**
 * Utility functions for week calculations
 */

export function getCurrentWeek(): string {
  const now = new Date();
  const year = now.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

export function getPreviousWeek(currentWeek?: string): string {
  const week = currentWeek || getCurrentWeek();
  const [yearStr, weekStr] = week.split('-W');
  const year = parseInt(yearStr);
  const weekNum = parseInt(weekStr);
  
  if (weekNum > 1) {
    return `${year}-W${(weekNum - 1).toString().padStart(2, '0')}`;
  } else {
    // Go to previous year's last week
    const prevYear = year - 1;
    const lastWeekOfPrevYear = getLastWeekOfYear(prevYear);
    return `${prevYear}-W${lastWeekOfPrevYear.toString().padStart(2, '0')}`;
  }
}

export function getNextWeek(currentWeek?: string): string {
  const week = currentWeek || getCurrentWeek();
  const [yearStr, weekStr] = week.split('-W');
  const year = parseInt(yearStr);
  const weekNum = parseInt(weekStr);
  
  const lastWeekOfYear = getLastWeekOfYear(year);
  
  if (weekNum < lastWeekOfYear) {
    return `${year}-W${(weekNum + 1).toString().padStart(2, '0')}`;
  } else {
    // Go to next year's first week
    return `${year + 1}-W01`;
  }
}

export function getLastWeekOfYear(year: number): number {
  const dec31 = new Date(year, 11, 31);
  const week = Math.ceil((((dec31.getTime() - new Date(year, 0, 1).getTime()) / 86400000) + new Date(year, 0, 1).getDay() + 1) / 7);
  return week;
}

export function parseWeek(weekString: string): { year: number; week: number } | null {
  const match = weekString.match(/^(\d{4})-W(\d{1,2})$/);
  if (!match) return null;
  
  return {
    year: parseInt(match[1]),
    week: parseInt(match[2])
  };
}

export function isValidWeek(weekString: string): boolean {
  return parseWeek(weekString) !== null;
}

export function getWeekRange(weekString: string): { start: Date; end: Date } | null {
  const parsed = parseWeek(weekString);
  if (!parsed) return null;
  
  const { year, week } = parsed;
  
  // January 1st of the year
  const jan1 = new Date(year, 0, 1);
  
  // Calculate the date of the first day of the week
  const firstDayOfWeek = new Date(jan1);
  firstDayOfWeek.setDate(jan1.getDate() + (week - 1) * 7 - jan1.getDay() + 1);
  
  // Calculate the last day of the week
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  
  return {
    start: firstDayOfWeek,
    end: lastDayOfWeek
  };
}
