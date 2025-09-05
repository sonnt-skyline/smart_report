import { createContext, useState, useContext, useEffect } from 'react';

// Define default preferences
const defaultPreferences = {
  theme: 'light',
  dashboardLayout: 'default',
  defaultView: 'objectives',
  sortBy: 'priority',
  showCompletedItems: true,
  favoriteQuadrant: 'urgent-important',
  chartType: 'bar',
  refreshInterval: 5 // minutes
};

// User preferences context
const UserPreferencesContext = createContext();

export function UserPreferencesProvider({ children }) {
  // Initialize state from localStorage or use defaults
  const [preferences, setPreferences] = useState(() => {
    const savedPrefs = localStorage.getItem('dashboard_preferences');
    return savedPrefs ? JSON.parse(savedPrefs) : defaultPreferences;
  });
  
  // Update localStorage when preferences change
  useEffect(() => {
    localStorage.setItem('dashboard_preferences', JSON.stringify(preferences));
  }, [preferences]);
  
  // Update a single preference
  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Reset preferences to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };
  
  const value = {
    preferences,
    updatePreference,
    resetPreferences
  };
  
  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

// Hook to use preferences
export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}
