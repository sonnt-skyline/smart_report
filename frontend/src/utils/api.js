// API utilities for weekly report functionality
// Replace these mock functions with actual API calls to your backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Mock delay to simulate network requests
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const weeklyReportAPI = {
  /**
   * Get user's actions for weekly report
   * @param {string} userId - User identifier
   * @returns {Promise<Array>} User's actions
   */
  getUserActions: async (userId) => {
    await simulateDelay(500);
    
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/users/${userId}/actions`);
    // return response.json();
    
    // Mock data for now
    return [
      {
        id: 1,
        title: 'Complete project milestone',
        category: 'Delivery',
        subCategory: 'Milestone',
        target: 'Deliver working prototype',
        definitionOfDone: 'Prototype passes all acceptance tests and is deployed to staging',
        statusUpdates: [
          { week: '2025-W35', progress: 75, workStatus: 'On-going' }
        ],
        deadline: '2025-09-15T17:00',
        member: 'Current User'
      },
      {
        id: 2,
        title: 'React advanced training',
        category: 'Self development',
        subCategory: 'Training',
        target: 'Master advanced React patterns',
        definitionOfDone: 'Complete course and implement learned patterns in a project',
        statusUpdates: [
          { week: '2025-W35', progress: 30, workStatus: 'On-going' }
        ],
        deadline: '2025-09-30T18:00',
        member: 'Current User'
      }
    ];
  },

  /**
   * Submit weekly report to backend
   * @param {Object} reportData - Weekly report data
   * @returns {Promise<Object>} Submission result
   */
  submitWeeklyReport: async (reportData) => {
    await simulateDelay(1000);
    
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/weekly-reports`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify(reportData)
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    // 
    // return response.json();
    
    console.log('Weekly report data to be sent to backend:', reportData);
    
    // Validate required fields
    if (!reportData.week || !reportData.actions || !reportData.member) {
      throw new Error('Missing required fields in report data');
    }
    
    // Mock successful response
    return {
      success: true,
      reportId: `report_${Date.now()}`,
      message: 'Weekly report submitted successfully',
      submittedAt: new Date().toISOString()
    };
  },

  /**
   * Get previous weekly reports for reference
   * @param {string} userId - User identifier
   * @param {number} limit - Number of reports to fetch
   * @returns {Promise<Array>} Previous reports
   */
  getPreviousReports: async (userId, limit = 5) => {
    await simulateDelay(300);
    
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/users/${userId}/reports?limit=${limit}`);
    // return response.json();
    
    // Mock previous reports
    return [
      {
        id: 'report_1',
        week: '2025-W34',
        submittedAt: '2025-08-25T10:30:00Z',
        actionsCount: 3,
        notes: 'Focused on backend optimization this week'
      },
      {
        id: 'report_2',
        week: '2025-W33',
        submittedAt: '2025-08-18T09:15:00Z',
        actionsCount: 2,
        notes: 'Client presentation preparation'
      }
    ];
  },

  /**
   * Update an existing action
   * @param {string} actionId - Action identifier
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated action
   */
  updateAction: async (actionId, updates) => {
    await simulateDelay(300);
    
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/actions/${actionId}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify(updates)
    // });
    // 
    // return response.json();
    
    console.log(`Updating action ${actionId}:`, updates);
    
    return {
      success: true,
      actionId,
      message: 'Action updated successfully'
    };
  },

  /**
   * Create a new action
   * @param {Object} actionData - New action data
   * @returns {Promise<Object>} Created action
   */
  createAction: async (actionData) => {
    await simulateDelay(400);
    
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/actions`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify(actionData)
    // });
    // 
    // return response.json();
    
    console.log('Creating new action:', actionData);
    
    return {
      ...actionData,
      id: `action_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  }
};

// Helper function to get authentication token
// TODO: Implement actual authentication
const getAuthToken = () => {
  // return localStorage.getItem('authToken');
  return 'mock-auth-token';
};

// Export utility functions
export const formatWeekId = (date = new Date()) => {
  const year = date.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week}`;
};

export const parseWeekId = (weekId) => {
  const [year, week] = weekId.split('-W');
  return {
    year: parseInt(year),
    week: parseInt(week)
  };
};

export const getWeekDateRange = (weekId) => {
  const { year, week } = parseWeekId(weekId);
  const startDate = new Date(year, 0, 1 + (week - 1) * 7);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  return {
    start: startDate,
    end: endDate
  };
};
