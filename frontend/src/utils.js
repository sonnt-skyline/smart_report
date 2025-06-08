export function weeksRemaining(targetDate) {
  const now = new Date();
  now.setHours(0,0,0,0);
  const target = new Date(targetDate);
  target.setHours(0,0,0,0);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const diff = target - now;
  return diff > 0 ? Math.ceil(diff / msPerWeek) : 0;
}

export function formatDate(dt) {
  return new Date(dt).toLocaleString();
}
