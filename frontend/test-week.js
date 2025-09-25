const date = new Date('2025-09-13');
console.log('Date:', date.toISOString());

// ISO week calculation
const thursday = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 24 * 60 * 60 * 1000);
const year = thursday.getFullYear();
const jan4 = new Date(year, 0, 4);
const weekNumber = 1 + Math.round(((thursday.getTime() - jan4.getTime()) / 86400000 - 3 + (jan4.getDay() + 6) % 7) / 7);

console.log('Current week should be:', `${year}-W${weekNumber.toString().padStart(2, '0')}`);

// Check day of week
console.log('Day of week (0=Sunday):', date.getDay());
console.log('Sep 13, 2025 is a:', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]);
