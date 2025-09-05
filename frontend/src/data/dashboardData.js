// Priority matrix quadrant types
export const QUADRANTS = {
  URGENT_IMPORTANT: 'urgent-important',
  URGENT_NOT_IMPORTANT: 'urgent-not-important',
  NOT_URGENT_IMPORTANT: 'not-urgent-important',
  NOT_URGENT_NOT_IMPORTANT: 'not-urgent-not-important'
};

// Sample objectives data
export const objectives = [
  {
    id: 'obj-1',
    title: 'Complete Project Milestone 1',
    description: 'Finalize all deliverables for the first project milestone',
    quadrant: QUADRANTS.URGENT_IMPORTANT,
    progress: 65,
    deadline: '2025-06-20T00:00:00Z',
    status: 'on track',
    assignedTo: 'user-101',
    tags: ['milestone', 'client-facing'],
    createdAt: '2025-05-15T00:00:00Z'
  },
  {
    id: 'obj-2',
    title: 'Improve Team Documentation',
    description: 'Update and standardize all team documentation',
    quadrant: QUADRANTS.NOT_URGENT_IMPORTANT,
    progress: 40,
    deadline: '2025-07-15T00:00:00Z',
    status: 'on track',
    assignedTo: 'user-102',
    tags: ['documentation', 'team-quality'],
    createdAt: '2025-05-20T00:00:00Z'
  },
  {
    id: 'obj-3',
    title: 'Respond to Client Emails',
    description: 'Answer all pending client questions',
    quadrant: QUADRANTS.URGENT_NOT_IMPORTANT,
    progress: 30,
    deadline: '2025-06-15T00:00:00Z',
    status: 'off track',
    assignedTo: 'user-101',
    tags: ['client-communication'],
    createdAt: '2025-06-01T00:00:00Z'
  },
  {
    id: 'obj-4',
    title: 'Team Training on New Technology',
    description: 'Complete training sessions on new framework',
    quadrant: QUADRANTS.NOT_URGENT_NOT_IMPORTANT,
    progress: 10,
    deadline: '2025-08-30T00:00:00Z',
    status: 'on track',
    assignedTo: 'user-103',
    tags: ['training', 'professional-development'],
    createdAt: '2025-06-05T00:00:00Z'
  }
];

// Sample actions data
export const actions = [
  {
    id: 'act-1',
    title: 'Create API Documentation',
    description: 'Document all API endpoints with examples',
    objectiveId: 'obj-2',
    quadrant: QUADRANTS.NOT_URGENT_IMPORTANT,
    progress: 50,
    deadline: '2025-07-10T00:00:00Z',
    status: 'on track',
    assignedTo: 'user-104',
    tags: ['documentation', 'technical'],
    createdAt: '2025-05-25T00:00:00Z'
  },
  {
    id: 'act-2',
    title: 'Implement Authentication Feature',
    description: 'Add OAuth2 authentication to the system',
    objectiveId: 'obj-1',
    quadrant: QUADRANTS.URGENT_IMPORTANT,
    progress: 75,
    deadline: '2025-06-18T00:00:00Z',
    status: 'on track',
    assignedTo: 'user-105',
    tags: ['security', 'development'],
    createdAt: '2025-05-18T00:00:00Z'
  },
  {
    id: 'act-3',
    title: 'Schedule Client Update Meeting',
    description: 'Coordinate with client for weekly progress meeting',
    objectiveId: 'obj-3',
    quadrant: QUADRANTS.URGENT_NOT_IMPORTANT,
    progress: 25,
    deadline: '2025-06-14T00:00:00Z',
    status: 'off track',
    assignedTo: 'user-101',
    tags: ['client-communication', 'meeting'],
    createdAt: '2025-06-02T00:00:00Z'
  },
  {
    id: 'act-4',
    title: 'Research New Testing Framework',
    description: 'Evaluate potential testing frameworks for future projects',
    objectiveId: 'obj-4',
    quadrant: QUADRANTS.NOT_URGENT_NOT_IMPORTANT,
    progress: 15,
    deadline: '2025-08-15T00:00:00Z',
    status: 'on track',
    assignedTo: 'user-106',
    tags: ['research', 'testing'],
    createdAt: '2025-06-08T00:00:00Z'
  }
];

// Sample key problems data
export const keyProblems = [
  {
    id: 'prob-1',
    title: 'Recurring Integration Issues',
    description: 'Team is facing weekly integration problems that slow delivery',
    severity: 'high',
    status: 'unresolved',
    assignedTo: 'user-105',
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2025-06-10T00:00:00Z'
  },
  {
    id: 'prob-2',
    title: 'Test Coverage Declining',
    description: 'Test coverage has dropped below 70% threshold',
    severity: 'medium',
    status: 'in-progress',
    assignedTo: 'user-106',
    createdAt: '2025-05-25T00:00:00Z',
    updatedAt: '2025-06-05T00:00:00Z'
  },
  {
    id: 'prob-3',
    title: 'Client Feedback Delays',
    description: 'Client is taking too long to provide critical feedback',
    severity: 'medium',
    status: 'unresolved',
    assignedTo: 'user-101',
    createdAt: '2025-06-08T00:00:00Z',
    updatedAt: '2025-06-08T00:00:00Z'
  }
];

// Helper function to fetch problems from an API endpoint
export async function fetchKeyProblems() {
  // In a real application, this would make an API call
  // For now, we'll just return our mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(keyProblems);
    }, 500);
  });
}

// Sorting utilities
export function sortByPriority(items) {
  const priorityOrder = {
    [QUADRANTS.URGENT_IMPORTANT]: 1,
    [QUADRANTS.URGENT_NOT_IMPORTANT]: 2,
    [QUADRANTS.NOT_URGENT_IMPORTANT]: 3,
    [QUADRANTS.NOT_URGENT_NOT_IMPORTANT]: 4
  };
  
  return [...items].sort((a, b) => priorityOrder[a.quadrant] - priorityOrder[b.quadrant]);
}

export function sortByStatus(items) {
  const statusOrder = {
    'off track': 1,
    'on track': 2,
    'completed': 3
  };
  
  return [...items].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
}

export function sortByDeadline(items) {
  return [...items].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
}

export function sortByProgress(items) {
  return [...items].sort((a, b) => a.progress - b.progress);
}
