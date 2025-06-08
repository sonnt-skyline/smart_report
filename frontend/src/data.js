export const sampleActions = [
  {
    id: 1,
    title: 'Deliver project milestone 1',
    category: 'Delivery',
    subCategory: 'Milestone',
    statusUpdates: [
      { week: '2025-W22', progress: 10, workStatus: 'Not started' },
      { week: '2025-W23', progress: 40, workStatus: 'On-going' },
      { week: '2025-W24', progress: 80, workStatus: 'On-going' },
    ],
    tags: ['urgent', 'client'],
    deadline: '2025-06-08T12:00',
    selfAssessment: {
      status: 'on track',
      text: 'On track, minor risks.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Progress aligns with plan.'
    },
    member: 'Alice',
    valueAdded: 'Client satisfaction and project progress',
  },
  {
    id: 2,
    title: 'Complete React course',
    category: 'Self development',
    subCategory: 'Education',
    statusUpdates: [
      { week: '2025-W23', progress: 0, workStatus: 'Not started' },
      { week: '2025-W24', progress: 30, workStatus: 'On-going' },
      { week: '2025-W25', progress: 50, workStatus: 'On-going' },
    ],
    tags: ['learning', 'react'],
    deadline: '2025-06-12T18:00',
    selfAssessment: {
      status: 'on track',
      text: 'Halfway done.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Good progress, keep pace.'
    },
    member: 'Alice',
    valueAdded: 'React skills for future projects',
  },
  {
    id: 3,
    title: 'Propose new solution',
    category: 'Solution+',
    subCategory: 'Innovation',
    statusUpdates: [
      { week: '2025-W24', progress: 0, workStatus: 'Not started' },
      { week: '2025-W25', progress: 20, workStatus: 'On hold' },
    ],
    tags: ['proposal', 'solution'],
    deadline: '2025-06-16T10:00',
    selfAssessment: {
      status: 'not started',
      text: 'Initial research started.'
    },
    aiAssessment: {
      status: 'off track',
      text: 'Needs more detail.'
    },
    member: 'Alice',
    valueAdded: 'Potential for innovative solutions',
  },
  {
    id: 4,
    title: 'Write weekly report',
    category: 'Delivery',
    subCategory: 'Reporting',
    statusUpdates: [
      { week: '2025-W23', progress: 0, workStatus: 'Not started' },
      { week: '2025-W24', progress: 0, workStatus: 'Not started' },
      { week: '2025-W25', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['report', 'weekly'],
    deadline: '2025-06-06T12:00',
    selfAssessment: {
      status: 'not started',
      text: 'Will start soon.'
    },
    aiAssessment: {
      status: 'not started',
      text: 'No progress yet.'
    },
    member: 'Alice',
    valueAdded: 'Keeps team and stakeholders informed',
  },
  {
    id: 5,
    title: 'Review team solution',
    category: 'Solution+',
    subCategory: 'Review',
    statusUpdates: [
      { week: '2025-W23', progress: 0, workStatus: 'Not started' },
      { week: '2025-W24', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['review', 'solution'],
    deadline: '2025-06-13T10:00',
    selfAssessment: {
      status: 'on track',
      text: 'Completed successfully.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Meets all requirements.'
    },
    member: 'Alice',
    valueAdded: 'Ensures solution quality and team alignment',
  },
  {
    id: 6,
    title: 'Start new training',
    category: 'Self development',
    subCategory: 'Training',
    statusUpdates: [
      { week: '2025-W24', progress: 0, workStatus: 'Not started' },
      { week: '2025-W25', progress: 0, workStatus: 'Not started' },
    ],
    tags: ['training', 'development'],
    deadline: '2025-06-25T10:00',
    selfAssessment: {
      status: 'not started',
      text: 'Not started yet.'
    },
    aiAssessment: {
      status: 'not started',
      text: 'No progress yet.'
    },
    member: 'Alice',
    valueAdded: 'Upskilling for future responsibilities',
  },
  {
    id: 7,
    title: 'Fix deployment bug',
    category: 'Delivery',
    subCategory: 'Bug Fix',
    statusUpdates: [
      { week: '2025-W23', progress: 0, workStatus: 'Blocked' },
      { week: '2025-W24', progress: 30, workStatus: 'Blocked' },
      { week: '2025-W25', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['bug', 'urgent'],
    deadline: '2025-06-04T12:00',
    selfAssessment: {
      status: 'off track',
      text: 'Blocked by missing info.'
    },
    aiAssessment: {
      status: 'off track',
      text: 'Behind schedule.'
    },
    member: 'Alice',
    valueAdded: 'Restores deployment pipeline and reliability',
  },
  {
    id: 8,
    title: 'Release v2.0 to production',
    category: 'Delivery',
    subCategory: 'Release',
    statusUpdates: [
      { week: '2025-W24', progress: 0, workStatus: 'Not started' },
      { week: '2025-W25', progress: 50, workStatus: 'On-going' },
    ],
    tags: ['release', 'production'],
    deadline: '2025-06-30T17:00',
    selfAssessment: {
      status: 'on track',
      text: 'Release preparation in progress.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'On schedule for release.'
    },
    member: 'Alice',
    valueAdded: 'Objective: Improve customer satisfaction by delivering high-quality features on time',
    valueAddedLink: '',
  },
  {
    id: 9,
    title: 'Gather user feedback for v2.0',
    category: 'Customer Success',
    subCategory: 'Feedback',
    statusUpdates: [
      { week: '2025-W25', progress: 0, workStatus: 'Not started' },
    ],
    tags: ['feedback', 'user'],
    deadline: '2025-07-05T12:00',
    selfAssessment: {
      status: 'not started',
      text: 'Feedback survey drafted.'
    },
    aiAssessment: {
      status: 'not started',
      text: 'Awaiting user responses.'
    },
    member: 'Alice',
    valueAdded: 'Objective: Improve customer satisfaction by delivering high-quality features on time',
    valueAddedLink: '',
  },
  {
    id: 10,
    title: 'Resolve all critical bugs before release',
    category: 'Delivery',
    subCategory: 'Bug Fix',
    statusUpdates: [
      { week: '2025-W24', progress: 20, workStatus: 'On-going' },
      { week: '2025-W25', progress: 80, workStatus: 'On-going' },
    ],
    tags: ['bug', 'critical'],
    deadline: '2025-06-28T18:00',
    selfAssessment: {
      status: 'on track',
      text: 'Most critical bugs fixed.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Bug resolution progressing well.'
    },
    member: 'Alice',
    valueAdded: 'Objective: Improve customer satisfaction by delivering high-quality features on time',
    valueAddedLink: '',
  },
  {
    id: 11,
    title: 'Conduct performance review',
    category: 'Team management',
    subCategory: 'Review',
    statusUpdates: [
      { week: '2025-W25', progress: 0, workStatus: 'Not started' },
    ],
    tags: ['review', 'performance'],
    deadline: '2025-07-10T12:00',
    selfAssessment: {
      status: 'not started',
      text: 'Review criteria defined.'
    },
    aiAssessment: {
      status: 'not started',
      text: 'Awaiting manager input.'
    },
    member: 'Alice',
    valueAdded: 'Objective: Enhance team performance and development',
    valueAddedLink: '',
  },
  {
    id: 12,
    title: 'Plan team building activity',
    category: 'Team management',
    subCategory: 'Engagement',
    statusUpdates: [
      { week: '2025-W25', progress: 0, workStatus: 'Not started' },
    ],
    tags: ['team', 'activity'],
    deadline: '2025-07-15T12:00',
    selfAssessment: {
      status: 'not started',
      text: 'Activity ideas brainstormed.'
    },
    aiAssessment: {
      status: 'not started',
      text: 'Pending team input.'
    },
    member: 'Alice',
    valueAdded: 'Objective: Enhance team performance and development',
    valueAddedLink: '',
  },
  {
    id: 13,
    title: 'Set up one-on-one meetings',
    category: 'Team management',
    subCategory: 'Communication',
    statusUpdates: [
      { week: '2025-W25', progress: 0, workStatus: 'Not started' },
    ],
    tags: ['one-on-one', 'meetings'],
    deadline: '2025-07-20T12:00',
    selfAssessment: {
      status: 'not started',
      text: 'Meeting agenda templates created.'
    },
    aiAssessment: {
      status: 'not started',
      text: 'Awaiting team availability.'
    },
    member: 'Alice',
    valueAdded: 'Objective: Enhance team performance and development',
    valueAddedLink: '',
  }
];
