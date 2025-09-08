// API utilities for weekly report functionality
// Updated to use real backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make authenticated API requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

export const weeklyReportAPI = {
  /**
   * Get user's actions for weekly report
   * @returns {Promise<Array>} User's actions
   */
  getUserActions: async () => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/actions`);
      
      // Transform backend data to match frontend expectations
      return data.data.map(action => ({
        id: action.id,
        title: action.title,
        category: action.category,
        subCategory: action.sub_category,
        target: action.target,
        definitionOfDone: action.definition_of_done,
        statusUpdates: action.status_updates ? action.status_updates.map(update => ({
          week: update.week,
          progress: update.progress,
          workStatus: update.work_status
        })) : [],
        deadline: action.deadline,
        member: action.member?.name || 'Current User',
        parentObjective: action.parent_objective
      }));
    } catch (error) {
      console.error('Failed to fetch user actions:', error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  },

  /**
   * Submit weekly report to backend
   * @param {Object} reportData - Weekly report data
   * @returns {Promise<Object>} Submission result
   */
  submitWeeklyReport: async (reportData) => {
    try {
      const requestData = {
        week: reportData.week,
        progress_notes: reportData.progress,
        blockers_notes: reportData.blockers,
        next_steps_notes: reportData.nextSteps,
        additional_notes: reportData.notes,
        actions: reportData.actions.map(action => {
          const currentUpdate = action.statusUpdates?.find(u => u.week === reportData.week);
          return {
            action_id: action.id,
            progress: currentUpdate?.progress || 0,
            work_status: currentUpdate?.workStatus || 'Not started'
          };
        })
      };

      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/reports/weekly`, {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      
      return {
        success: true,
        reportId: data.data.id,
        message: data.message || 'Weekly report submitted successfully',
        submittedAt: data.data.submitted_at
      };
    } catch (error) {
      console.error('Failed to submit weekly report:', error);
      throw new Error(error.message || 'Failed to submit weekly report');
    }
  },

  /**
   * Get previous weekly reports for reference
   * @param {string} userId - User identifier
   * @param {number} limit - Number of reports to fetch
   * @returns {Promise<Array>} Previous reports
   */
  getPreviousReports: async (userId, limit = 5) => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/reports/weekly?limit=${limit}`);
      
      return data.data.map(report => ({
        id: report.id,
        week: report.week,
        submittedAt: report.submitted_at,
        actionsCount: report.actions?.length || 0,
        notes: report.additional_notes || ''
      }));
    } catch (error) {
      console.error('Failed to fetch previous reports:', error);
      return [];
    }
  },

  /**
   * Update an existing action
   * @param {string} actionId - Action identifier
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated action
   */
  updateAction: async (actionId, updates) => {
    try {
      const updateData = {
        title: updates.title,
        category: updates.category,
        sub_category: updates.subCategory,
        target: updates.target,
        definition_of_done: updates.definitionOfDone,
        deadline: updates.deadline,
        parent_objective: updates.parentObjective
      };

      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/actions/${actionId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      return {
        success: true,
        actionId,
        message: data.message || 'Action updated successfully'
      };
    } catch (error) {
      console.error('Failed to update action:', error);
      throw new Error(error.message || 'Failed to update action');
    }
  },

  /**
   * Create a new action
   * @param {Object} actionData - New action data
   * @returns {Promise<Object>} Created action
   */
  createAction: async (actionData) => {
    try {
      const requestData = {
        title: actionData.title,
        category: actionData.category,
        sub_category: actionData.subCategory,
        target: actionData.target,
        definition_of_done: actionData.definitionOfDone,
        deadline: actionData.deadline,
        parent_objective: actionData.parentObjective
      };

      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/actions`, {
        method: 'POST',
        body: JSON.stringify(requestData)
      });
      
      return {
        ...actionData,
        id: data.data.id,
        createdAt: data.data.created_at
      };
    } catch (error) {
      console.error('Failed to create action:', error);
      throw new Error(error.message || 'Failed to create action');
    }
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      console.log('📡 API Base URL:', API_BASE_URL);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      if (data.success) {
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        console.log('✅ Login successful, token stored');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  },

  register: async (email, password, name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
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
