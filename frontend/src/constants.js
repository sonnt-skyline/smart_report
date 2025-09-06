export const ACTION_CATEGORIES = [
  'Delivery',
  'Self development',
  'Solution+',
  'Customer Success',
  'Team management',
];

export const CATEGORY_SUBCATEGORIES = {
  'Delivery': ['Milestone', 'Reporting', 'Product Launch', 'Client Delivery'],
  'Self development': ['Education', 'Certification', 'Skills', 'Training'],
  'Solution+': ['Innovation', 'Review', 'Research', 'Optimization'],
  'Customer Success': ['Support', 'Engagement', 'Feedback', 'Retention'],
  'Team management': ['Mentoring', 'Planning', 'Performance', 'Communication'],
};

export const AVAILABLE_OBJECTIVES = [
  'Client satisfaction and project progress',
  'React skills for future projects',
  'Potential for innovative solutions',
  'Keeps team and stakeholders informed',
  'Ensures solution quality and team alignment',
  'Upskilling for future responsibilities',
  'Restores deployment pipeline and reliability',
  'Improve customer satisfaction by delivering high-quality features on time',
  'Enhance team performance and development',
  'Optimize development workflow and efficiency',
  'Strengthen technical expertise and capabilities',
  'Improve system reliability and performance',
];

export const STATUS_COLORS = {
  'not started': '#222',
  'on track': '#005a00',
  'off track': '#7a0000',
};

export const CATEGORY_COLORS = {
  'Delivery': '#fff',
  'Self development': '#f7f3e8',
  'Solution+': '#f9f9e3',
};

export const WORK_STATUS_COLORS = {
  'Not started': '#222',
  'On-going': '#003366',
  'Blocked': '#7a0000',
  'On hold': '#4d2600',
  'Completed': '#005a00',
};

export const WORK_STATUS_OPTIONS = [
  'Not started',
  'On-going',
  'Blocked',
  'On hold',
  'Completed'
];

export const GROUP_OPTIONS = [
  { label: 'Category', value: 'category' },
  { label: "Member's Status", value: 'status' },
  { label: 'Objective', value: 'objective' },
];
