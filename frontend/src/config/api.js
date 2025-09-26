// API configuration for Smart Report frontend
const isDevelopment = import.meta.env.MODE === 'development' ||
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    console.log(`import.meta.env.VITE_API_URL: ${import.meta.env.VITE_API_URL}`);
    return import.meta.env.VITE_API_URL;
  }

  if (isDevelopment) {
    return 'http://localhost:5173/api';
  }

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  console.log(`Protocol: ${protocol}, Hostname: ${hostname}, Port: ${port}`);
  return `${protocol}//${hostname}${port}/api`;
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 15000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
  IS_DEVELOPMENT: isDevelopment,
  ENVIRONMENT: isDevelopment ? 'development' : 'production'
};

const apiRequest = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }

    throw error;
  }
};

export const weeklyReportAPI = {
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/`);
      return { success: true, status: response.status };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getUserActions: async (userId) => {
    const response = await apiRequest(`${API_CONFIG.BASE_URL}/actions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    const data = await response.json();
    return data.success ? data.data : [];
  },

  submitWeeklyReport: async (reportData) => {
    const response = await apiRequest(`${API_CONFIG.BASE_URL}/reports/weekly`, {
      method: 'POST',
      headers: {
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

export const authAPI = {
  login: async (email, password) => {
    const response = await apiRequest(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data;
    }

    throw new Error(data.error || 'Login failed');
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
