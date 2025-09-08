// API configuration for Smart Report frontend
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Updated API utilities to work with the new backend
export const weeklyReportAPI = {
  // Updated getUserActions to use new backend
  getUserActions: async (userId) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/actions`, {
      headers: {
        ...API_CONFIG.HEADERS,
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  },

  // Updated submitWeeklyReport to use new backend
  submitWeeklyReport: async (reportData) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/reports/weekly`, {
      method: 'POST',
      headers: {
        ...API_CONFIG.HEADERS,
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        week: reportData.week,
        progress_notes: reportData.progress,
        blockers_notes: reportData.blockers, 
        next_steps_notes: reportData.nextSteps,
        additional_notes: reportData.notes,
        actions: reportData.actions.map(action => ({
          action_id: action.id,
          progress: action.statusUpdates?.[0]?.progress || 0,
          work_status: action.statusUpdates?.[0]?.workStatus || 'Not started'
        }))
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to submit report');
    }
    
    return {
      success: true,
      reportId: data.data.id,
      message: data.message,
      submittedAt: data.data.submitted_at
    };
  }
};

// Auth utilities
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
