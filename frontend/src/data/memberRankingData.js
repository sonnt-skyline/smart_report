// Mock data generator for member rankings and contributions

// Sample user names for realistic mock data
const FIRST_NAMES = [
  'Alex', 'Taylor', 'Jordan', 'Morgan', 'Sam', 'Casey', 'Jamie',
  'Riley', 'Avery', 'Dakota', 'Quinn', 'Cameron', 'Blake', 'Hayden',
  'Jesse', 'Rowan', 'Charlie', 'Reese', 'Finley', 'Emery'
];
  
const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis',
  'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor',
  'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White'
];

/**
 * Generate a random integer between min and max (inclusive)
 */
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a random name
 */
const randomName = () => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
};

/**
 * Generate a random user avatar URL using DiceBear API
 */
const generateAvatarUrl = (userId) => {
  const styles = ['adventurer', 'avataaars', 'bottts', 'initials', 'micah'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${userId}`;
};

/**
 * Generate random objective impact data
 */
const generateObjectiveImpacts = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    objectiveId: `obj-${randomInt(1, 20)}`,
    title: `Objective ${i + 1}`,
    score: randomInt(5, 20) // Impact score between 5 and 20
  }));
};

/**
 * Generate random completed actions data
 */
const generateCompletedActions = () => {
  const count = randomInt(3, 15);
  return {
    count,
    actions: Array.from({ length: count }, (_, i) => ({
      actionId: `act-${randomInt(1, 50)}`,
      title: `Action ${i + 1}`,
      completedDate: new Date(2025, 5, randomInt(1, 14)).toISOString()
    }))
  };
};

/**
 * Generate a single member's data
 */
export const generateMemberData = (userId, isCurrentUser = false) => {
  return {
    id: userId,
    name: randomName(),
    isCurrentUser,
    avatarUrl: generateAvatarUrl(userId),
    department: ['Engineering', 'Marketing', 'Sales', 'Product', 'Design'][randomInt(0, 4)],
    completedActions: generateCompletedActions(),
    objectiveImpacts: generateObjectiveImpacts(randomInt(2, 8))
  };
};

/**
 * Generate mock data for the specified number of team members
 * @param {Number} count Number of team members to generate
 * @param {String} currentUserId ID of the current user
 * @returns {Array} Array of member data objects
 */
export const generateTeamMembersData = (count = 10, currentUserId = 'user-101') => {
  return Array.from({ length: count }, (_, i) => {
    const userId = i === 0 ? currentUserId : `user-${200 + i}`;
    return generateMemberData(userId, userId === currentUserId);
  });
};
