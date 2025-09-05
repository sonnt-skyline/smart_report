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
    parentObjective: 'Client satisfaction and project progress',
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
    parentObjective: 'React skills for future projects',
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
    parentObjective: 'Potential for innovative solutions',
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
    parentObjective: 'Keeps team and stakeholders informed',
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
    parentObjective: 'Ensures solution quality and team alignment',
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
    parentObjective: 'Upskilling for future responsibilities',
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
    parentObjective: 'Restores deployment pipeline and reliability',
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
    parentObjective: 'Objective: Improve customer satisfaction by delivering high-quality features on time',
    parentObjectiveLink: '',
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
    parentObjective: 'Objective: Improve customer satisfaction by delivering high-quality features on time',
    parentObjectiveLink: '',
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
    parentObjective: 'Objective: Improve customer satisfaction by delivering high-quality features on time',
    parentObjectiveLink: '',
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
    parentObjective: 'Objective: Enhance team performance and development',
    parentObjectiveLink: '',
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
    parentObjective: 'Objective: Enhance team performance and development',
    parentObjectiveLink: '',
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
    parentObjective: 'Objective: Enhance team performance and development',
    parentObjectiveLink: '',
  },
  {
    id: 14,
    title: 'Launch marketing campaign',
    category: 'Customer Success',
    subCategory: 'Marketing',
    statusUpdates: [
      { week: '2025-W24', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['marketing', 'campaign'],
    deadline: '2025-06-20T12:00',
    selfAssessment: {
      status: 'on track',
      text: 'Campaign launched successfully.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Excellent execution.'
    },
    member: 'Bob',
    parentObjective: 'Expand market reach',
    parentObjectiveLink: '',
  },
  {
    id: 15,
    title: 'Improve documentation',
    category: 'Self development',
    subCategory: 'Documentation',
    statusUpdates: [
      { week: '2025-W25', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['documentation'],
    deadline: '2025-07-15T12:00',
    selfAssessment: {
      status: 'on track',
      text: 'Documentation improved.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Meets all standards.'
    },
    member: 'Bob',
    parentObjective: 'Improve internal documentation',
    parentObjectiveLink: '',
  },
  {
    id: 16,
    title: 'Team building event',
    category: 'Team management',
    subCategory: 'Engagement',
    statusUpdates: [
      { week: '2025-W25', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['team', 'event'],
    deadline: '2025-07-15T12:00',
    selfAssessment: {
      status: 'on track',
      text: 'Event held successfully.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Great participation.'
    },
    member: 'Carol',
    parentObjective: 'Objective: Enhance team performance and development',
    parentObjectiveLink: '',
  },
  {
    id: 17,
    title: 'Performance review for team',
    category: 'Team management',
    subCategory: 'Review',
    statusUpdates: [
      { week: '2025-W25', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['review', 'performance'],
    deadline: '2025-07-10T12:00',
    selfAssessment: {
      status: 'on track',
      text: 'All reviews completed.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Excellent management.'
    },
    member: 'Carol',
    parentObjective: 'Objective: Enhance team performance and development',
    parentObjectiveLink: '',
  },
  {
    id: 18,
    title: 'Critical bug fix',
    category: 'Delivery',
    subCategory: 'Bug Fix',
    statusUpdates: [
      { week: '2025-W24', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['bug', 'critical'],
    deadline: '2025-06-28T18:00',
    selfAssessment: {
      status: 'on track',
      text: 'Bug fixed before deadline.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Resolved efficiently.'
    },
    member: 'Bob',
    parentObjective: 'Objective: Improve customer satisfaction by delivering high-quality features on time',
    parentObjectiveLink: '',
  },
  {
    id: 19,
    title: 'Customer onboarding',
    category: 'Customer Success',
    subCategory: 'Onboarding',
    statusUpdates: [
      { week: '2025-W24', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['onboarding'],
    deadline: '2025-06-22T12:00',
    selfAssessment: {
      status: 'on track',
      text: 'Onboarding completed.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Smooth onboarding.'
    },
    member: 'David',
    parentObjective: 'Expand market reach',
    parentObjectiveLink: '',
  },
  {
    id: 20,
    title: 'Internal process audit',
    category: 'Solution+',
    subCategory: 'Audit',
    statusUpdates: [
      { week: '2025-W24', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['audit'],
    deadline: '2025-06-18T12:00',
    selfAssessment: {
      status: 'on track',
      text: 'Audit finished.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'No major issues.'
    },
    member: 'Eve',
    parentObjective: 'Improve internal documentation',
    parentObjectiveLink: '',
  },
  {
    id: 21,
    title: 'Release v2.1 beta',
    category: 'Delivery',
    subCategory: 'Release',
    statusUpdates: [
      { week: '2025-W25', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['release', 'beta'],
    deadline: '2025-07-01T12:00',
    selfAssessment: {
      status: 'on track',
      text: 'Beta released.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Release successful.'
    },
    member: 'Frank',
    parentObjective: 'Objective: Improve customer satisfaction by delivering high-quality features on time',
    parentObjectiveLink: '',
  },
  {
    id: 22,
    title: 'Security training',
    category: 'Self development',
    subCategory: 'Training',
    statusUpdates: [
      { week: '2025-W24', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['training', 'security'],
    deadline: '2025-06-20T12:00',
    selfAssessment: {
      status: 'on track',
      text: 'Training completed.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Well done.'
    },
    member: 'Grace',
    parentObjective: 'Upskilling for future responsibilities',
    parentObjectiveLink: '',
  },
  {
    id: 23,
    title: 'Customer feedback analysis',
    category: 'Customer Success',
    subCategory: 'Feedback',
    statusUpdates: [
      { week: '2025-W25', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['feedback', 'analysis'],
    deadline: '2025-07-05T12:00',
    selfAssessment: {
      status: 'on track',
      text: 'Analysis complete.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Valuable insights.'
    },
    member: 'Helen',
    parentObjective: 'Objective: Improve customer satisfaction by delivering high-quality features on time',
    parentObjectiveLink: '',
  },
  {
    id: 24,
    title: 'Team knowledge sharing',
    category: 'Team management',
    subCategory: 'Engagement',
    statusUpdates: [
      { week: '2025-W25', progress: 100, workStatus: 'Completed' },
    ],
    tags: ['team', 'knowledge'],
    deadline: '2025-07-15T12:00',
    selfAssessment: {
      status: 'on track',
      text: 'Session held.'
    },
    aiAssessment: {
      status: 'on track',
      text: 'Great engagement.'
    },
    member: 'Ivy',
    parentObjective: 'Objective: Enhance team performance and development',
    parentObjectiveLink: '',
  }
];

export const sampleObjectives = [
  {
    name: 'Client satisfaction and project progress',
    valueDescription: 'Delivering milestones and maintaining client trust through timely project progress.',
    deadline: '2025-06-30',
    parentObjective: 'Objective: Improve customer satisfaction by delivering high-quality features on time',
    keyResult: [
      'Milestone 1 delivered',
      'Positive client feedback'
    ],
    importance: 4,
    urgency: 4
  },
  {
    name: 'React skills for future projects',
    valueDescription: 'Upskill team members in React to enable future project success.',
    deadline: '2025-06-20',
    parentObjective: 'Objective: Enhance team performance and development',
    keyResult: [
      'React course completed',
      'Demo project built'
    ],
    importance: 3,
    urgency: 3
  },
  {
    name: 'Potential for innovative solutions',
    valueDescription: 'Encourage and implement innovative solutions to improve processes.',
    deadline: '2025-07-10',
    parentObjective: 'Objective: Enhance team performance and development',
    keyResult: [
      'New solution proposal accepted by team'
    ],
    importance: 3,
    urgency: 2
  },
  {
    name: 'Keeps team and stakeholders informed',
    valueDescription: 'Ensure all stakeholders are updated on progress and issues.',
    deadline: '2025-06-10',
    parentObjective: 'Objective: Enhance team performance and development',
    keyResult: [
      'Weekly reports submitted on time'
    ],
    importance: 2,
    urgency: 4
  },
  {
    name: 'Ensures solution quality and team alignment',
    valueDescription: 'Maintain high quality standards and team consensus on solutions.',
    deadline: '2025-06-15',
    parentObjective: 'Objective: Enhance team performance and development',
    keyResult: [
      'All solutions reviewed',
      'All solutions approved'
    ],
    importance: 4,
    urgency: 3
  },
  {
    name: 'Upskilling for future responsibilities',
    valueDescription: 'Prepare team members for upcoming roles and challenges.',
    deadline: '2025-07-01',
    parentObjective: 'Objective: Enhance team performance and development',
    keyResult: [
      'Training completed',
      'New skills demonstrated'
    ],
    importance: 3,
    urgency: 2
  },
  {
    name: 'Restores deployment pipeline and reliability',
    valueDescription: 'Fix deployment issues to ensure reliable releases.',
    deadline: '2025-06-05',
    parentObjective: 'Objective: Improve customer satisfaction by delivering high-quality features on time',
    keyResult: [
      'Deployment bug fixed',
      'Pipeline stable'
    ],
    importance: 5,
    urgency: 5
  },
  {
    name: 'Objective: Improve customer satisfaction by delivering high-quality features on time',
    valueDescription: 'Deliver features that meet customer needs and timelines.',
    deadline: '2025-07-10',
    parentObjective: '',
    keyResult: [
      'v2.0 released',
      'User feedback positive'
    ],
    importance: 5,
    urgency: 4
  },
  {
    name: 'Objective: Enhance team performance and development',
    valueDescription: 'Foster a high-performing and continuously developing team.',
    deadline: '2025-07-31',
    parentObjective: '',
    keyResult: [
      'Performance reviews completed',
      'Team building activity held'
    ],
    importance: 4,
    urgency: 3
  },
  // Additional objectives not referenced in sampleActions
  {
    name: 'Expand market reach',
    valueDescription: 'Grow the user base by targeting new market segments.',
    deadline: '2025-08-31',
    parentObjective: '',
    keyResult: [
      '10% increase in new users'
    ],
    importance: 3,
    urgency: 2
  },
  {
    name: 'Improve internal documentation',
    valueDescription: 'Ensure all processes and code are well documented for future maintainability.',
    deadline: '2025-07-15',
    parentObjective: 'Objective: Enhance team performance and development',
    keyResult: [
      'Documentation coverage reaches 95%'
    ],
    importance: 2,
    urgency: 2
  }
];
