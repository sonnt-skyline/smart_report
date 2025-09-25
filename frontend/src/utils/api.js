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
   * GET /api/reports/weekly - List Weekly Reports
   * @param {number} page - Page number (default 1)
   * @param {number} limit - Number of reports per page (max 50, default 10)
   * @param {string} week - Filter by specific week in ISO format (optional)
   * @returns {Promise<Array>} Weekly reports
   */
  getWeeklyReports: async (page = 1, limit = 10, week = null) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(week && { week })
      });
      
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/reports/weekly?${params}`);
      
      return data.data.map(report => ({
        id: report.id,
        member_id: report.member_id,
        week: report.week,
        progress_notes: report.progress_notes,
        blockers_notes: report.blockers_notes,
        next_steps_notes: report.next_steps_notes,
        additional_notes: report.additional_notes,
        submitted_at: report.submitted_at,
        created_at: report.created_at,
        updated_at: report.updated_at,
        member: report.member,
        actions: report.actions || []
      }));
    } catch (error) {
      console.error('Failed to fetch weekly reports:', error);
      return [];
    }
  },

  /**
   * GET /api/reports/weekly/:week - Get Specific Weekly Report
   * @param {string} week - Week identifier in ISO format (YYYY-W##)
   * @returns {Promise<Object>} Weekly report details
   */
  getWeeklyReport: async (week) => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/reports/weekly/${week}`);
      
      return {
        id: data.data.id,
        member_id: data.data.member_id,
        week: data.data.week,
        progress_notes: data.data.progress_notes,
        blockers_notes: data.data.blockers_notes,
        next_steps_notes: data.data.next_steps_notes,
        additional_notes: data.data.additional_notes,
        submitted_at: data.data.submitted_at,
        created_at: data.data.created_at,
        updated_at: data.data.updated_at,
        member: data.data.member,
        actions: data.data.actions?.map(action => ({
          id: action.id,
          title: action.title,
          category: action.category,
          sub_category: action.sub_category,
          target: action.target,
          definition_of_done: action.definition_of_done,
          deadline: action.deadline,
          progress: action.progress,
          work_status: action.work_status
        })) || []
      };
    } catch (error) {
      console.error('Failed to fetch weekly report:', error);
      throw new Error(error.message || 'Failed to fetch weekly report');
    }
  },

  /**
   * POST /api/reports/weekly - Submit Weekly Report
   * @param {Object} reportData - Weekly report data
   * @param {string} reportData.week - Week identifier in ISO format (YYYY-W##)
   * @param {Array} reportData.actions - Array of action items with progress updates
   * @param {string} reportData.progress_notes - Progress notes (optional)
   * @param {string} reportData.blockers_notes - Blockers notes (optional)
   * @param {string} reportData.next_steps_notes - Next steps notes (optional)
   * @param {string} reportData.additional_notes - Additional notes (optional)
   * @returns {Promise<Object>} Submission response
   */
  submitWeeklyReport: async (reportData) => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/reports/weekly`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          week: reportData.week,
          actions: reportData.actions.map(action => ({
            action_id: action.action_id,
            progress: action.progress,
            work_status: action.work_status
          })),
          progress_notes: reportData.progress_notes || '',
          blockers_notes: reportData.blockers_notes || '',
          next_steps_notes: reportData.next_steps_notes || '',
          additional_notes: reportData.additional_notes || ''
        })
      });
      
      return {
        id: response.data.id,
        week: response.data.week,
        submitted_at: response.data.submitted_at,
        message: response.message || 'Weekly report submitted successfully'
      };
    } catch (error) {
      console.error('Failed to submit weekly report:', error);
      throw new Error(error.message || 'Failed to submit weekly report');
    }
  },

  /**
   * PUT /api/reports/weekly/:week - Update Weekly Report
   * @param {string} week - Week identifier in ISO format (YYYY-W##)
   * @param {Object} reportData - Updated weekly report data
   * @returns {Promise<Object>} Update response
   */
  updateWeeklyReport: async (week, reportData) => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/reports/weekly/${week}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actions: reportData.actions?.map(action => ({
            action_id: action.action_id,
            progress: action.progress,
            work_status: action.work_status
          })),
          progress_notes: reportData.progress_notes,
          blockers_notes: reportData.blockers_notes,
          next_steps_notes: reportData.next_steps_notes,
          additional_notes: reportData.additional_notes
        })
      });
      
      return {
        id: response.data.id,
        week: response.data.week,
        updated_at: response.data.updated_at,
        message: response.message || 'Weekly report updated successfully'
      };
    } catch (error) {
      console.error('Failed to update weekly report:', error);
      throw new Error(error.message || 'Failed to update weekly report');
    }
  },

  /**
   * DELETE /api/reports/weekly/:week - Delete Weekly Report
   * @param {string} week - Week identifier in ISO format (YYYY-W##)
   * @returns {Promise<Object>} Deletion response
   */
  deleteWeeklyReport: async (week) => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/reports/weekly/${week}`, {
        method: 'DELETE'
      });
      
      return {
        message: response.message || 'Weekly report deleted successfully'
      };
    } catch (error) {
      console.error('Failed to delete weekly report:', error);
      throw new Error(error.message || 'Failed to delete weekly report');
    }
  },

  /**
   * GET /api/reports/weekly/navigation/:week - Get Week Navigation
   * @param {string} week - Current week identifier in ISO format (YYYY-W##)
   * @returns {Promise<Object>} Navigation information
   */
  getWeekNavigation: async (week) => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/reports/weekly/navigation/${week}`);
      
      return {
        current_week: data.data.current_week,
        previous_week: data.data.previous_week,
        next_week: data.data.next_week,
        can_navigate_previous: data.data.can_navigate_previous,
        can_navigate_next: data.data.can_navigate_next,
        has_previous_report: data.data.has_previous_report,
        has_next_report: data.data.has_next_report
      };
    } catch (error) {
      console.error('Failed to fetch week navigation:', error);
      throw new Error(error.message || 'Failed to fetch week navigation');
    }
  },

    // Legacy method aliases for backward compatibility
  getPreviousReports: async (page = 1, limit = 10) => {
    const reports = await weeklyReportAPI.getWeeklyReports(page, limit);
    
    // Transform to match legacy frontend expectations
    return reports.map(report => ({
      id: report.id,
      week: report.week,
      submittedAt: report.submitted_at,
      actionsCount: report.actions?.length || 0,
      notes: report.additional_notes || ''
    }));
  },

  getReportDetails: async (week) => {
    return weeklyReportAPI.getWeeklyReport(week);
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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      if (data.success) {
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login failed:', error);
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

// Week Format Utilities (Updated to match API documentation)

// Get current week in YYYY-W## format (ISO week format)
export const getCurrentWeek = () => {
  const date = new Date();
  
  // ISO week calculation
  const thursday = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 24 * 60 * 60 * 1000);
  const year = thursday.getFullYear();
  const jan4 = new Date(year, 0, 4);
  const weekNumber = 1 + Math.round(((thursday.getTime() - jan4.getTime()) / 86400000 - 3 + (jan4.getDay() + 6) % 7) / 7);
  
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
};

// Parse week string to get year and week number
export const parseWeek = (weekStr) => {
  const [yearStr, weekStr2] = weekStr.split('-W');
  return {
    year: parseInt(yearStr),
    week: parseInt(weekStr2)
  };
};

// Get week date range
export const getWeekDateRange = (weekStr) => {
  const { year, week } = parseWeek(weekStr);
  const jan4 = new Date(year, 0, 4);
  const startOfWeek = new Date(jan4.getTime() - (jan4.getDay() - 1) * 24 * 60 * 60 * 1000);
  startOfWeek.setDate(startOfWeek.getDate() + (week - 1) * 7);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  
  return { start: startOfWeek, end: endOfWeek };
};

// Get previous week
export const getPreviousWeek = (currentWeek) => {
  const week = currentWeek || getCurrentWeek();
  const [yearStr, weekStr] = week.split('-W');
  const year = parseInt(yearStr);
  const weekNum = parseInt(weekStr);
  
  if (weekNum > 1) {
    return `${year}-W${(weekNum - 1).toString().padStart(2, '0')}`;
  } else {
    const prevYear = year - 1;
    return `${prevYear}-W52`; // Simplified - actual calculation may vary
  }
};

// Get next week
export const getNextWeek = (currentWeek) => {
  const week = currentWeek || getCurrentWeek();
  const [yearStr, weekStr] = week.split('-W');
  const year = parseInt(yearStr);
  const weekNum = parseInt(weekStr);
  
  if (weekNum < 52) { // Simplified - actual calculation may vary
    return `${year}-W${(weekNum + 1).toString().padStart(2, '0')}`;
  } else {
    return `${year + 1}-W01`;
  }
};

// Format week for display
export const formatWeekDisplay = (weekStr) => {
  const { year, week } = parseWeek(weekStr);
  const { start, end } = getWeekDateRange(weekStr);
  
  return `Week ${week}, ${year} (${start.toLocaleDateString()} - ${end.toLocaleDateString()})`;
};

// Check if week is current week
export const isCurrentWeek = (weekStr) => {
  return weekStr === getCurrentWeek();
};

// Check if week is in the future
export const isFutureWeek = (weekStr) => {
  const current = getCurrentWeek();
  return weekStr > current;
};

// Legacy exports for backward compatibility
export const formatWeekId = getCurrentWeek;
export const parseWeekId = parseWeek;
