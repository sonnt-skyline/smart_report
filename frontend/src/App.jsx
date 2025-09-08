import { useState, useEffect } from 'react';
import './App.css';
import './styles/theme.module.css'; // Import theme variables
import NotesSection from './components/NotesSection';
import CategoryColorLegend from './components/CategoryColorLegend';
import FilterButtons from './components/FilterButtons';
import GroupButtons from './components/GroupButtons';
import ActionCardList from './components/ActionCardList';
import ActionsControlPanel from './components/ActionsControlPanel';
import NavigationBar from './components/NavigationBar';
import LoginPage from './components/LoginPage';
import { ACTION_CATEGORIES, GROUP_OPTIONS } from './constants';
import { weeklyReportAPI, authAPI } from './utils/api';
import WeeklyReportPage from './WeeklyReportPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function getLatestWorkStatus(action) {
  // Find the latest status update for the current week or before
  const now = new Date();
  const year = now.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  const currentWeek = `${year}-W${week}`;
  let lastUpdate = null;
  for (const u of action.statusUpdates) {
    if (u.week <= currentWeek) {
      if (!lastUpdate || u.week > lastUpdate.week) lastUpdate = u;
    }
  }
  return lastUpdate ? lastUpdate.workStatus : 'Not started';
}

function App() {
  const [groupBy, setGroupBy] = useState('category');
  const [filter, setFilter] = useState('All');
  const [isFiltering, setIsFiltering] = useState(false);
  const [memberActions, setMemberActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      if (authAPI.isAuthenticated()) {
        const user = authAPI.getCurrentUser();
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Load user actions from API when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setMemberActions([]);
      return;
    }
    
    const loadActions = async () => {
      try {
        setLoading(true);
        const actions = await weeklyReportAPI.getUserActions();
        setMemberActions(actions);
      } catch (error) {
        console.error('Failed to load actions:', error);
        setMemberActions([]);
        // If auth token is invalid, logout
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadActions();
  }, [isAuthenticated]);

  const handleLoginSuccess = (user) => {
    console.log('🎉 App.jsx: handleLoginSuccess called with user:', user);
    setCurrentUser(user);
    setIsAuthenticated(true);
    console.log('✅ App.jsx: Authentication state updated');
  };

  const handleLogout = () => {
    authAPI.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setMemberActions([]);
  };
  
  // Handle filter changes with loading state
  const handleFilterChange = (newFilter) => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilter(newFilter);
      setIsFiltering(false);
    }, 100); // Reduced delay for snappier feel
  };

  const handleGroupByChange = (newGroupBy) => {
    setIsFiltering(true);
    setTimeout(() => {
      setGroupBy(newGroupBy);
      setIsFiltering(false);
    }, 100);
  };
  
  let groups = [];
  if (groupBy === 'category') {
    groups = ACTION_CATEGORIES.map(cat => ({
      group: cat,
      actions: memberActions.filter(a => a.category === cat),
    }));
  } else if (groupBy === 'status') {
    const workStatusTypes = ['Not started', 'On-going', 'Blocked', 'On hold', 'Completed'];
    groups = workStatusTypes.map(status => ({
      group: status,
      actions: memberActions.filter(a => getLatestWorkStatus(a) === status),
    }));
  } else if (groupBy === 'objective') {
    // Group by Parent Objective (from parentObjective field)
    const objectiveActions = memberActions.filter(a => a.parentObjective);
    const objectives = Array.from(new Set(objectiveActions.map(a => a.parentObjective)));
    groups = objectives.map(obj => ({
      group: obj,
      actions: objectiveActions.filter(a => a.parentObjective === obj),
    }));
    // Optionally, add a group for actions without an objective
    const noObjectiveActions = memberActions.filter(a => !a.parentObjective);
    if (noObjectiveActions.length > 0) {
      groups.push({ group: 'No Objective', actions: noObjectiveActions });
    }
  }

  // Calculate totals for the control panel
  const totalActions = memberActions.length;
  
  // Calculate counts for each filter type
  const getActionCountsByStatus = () => {
    const counts = { 'All': totalActions };
    const statusTypes = ['On-going', 'Blocked', 'On hold', 'Completed', 'Not started'];
    
    statusTypes.forEach(status => {
      counts[status] = memberActions.filter(action => getLatestWorkStatus(action) === status).length;
    });
    
    return counts;
  };
  
  const actionCounts = getActionCountsByStatus();
  const filteredActions = actionCounts[filter] || 0;

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="app-content">
        <div className="loading-container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>⏳</div>
            <h3>Loading...</h3>
            <p>Please wait while we load the application.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <NavigationBar currentUser={currentUser} onLogout={handleLogout} />
      <div className="app-content">
        <Routes>
          {/* Redirect root path to actions page */}
          <Route path="/" element={<Navigate to="/actions" replace />} />
          <Route path="/actions" element={
            <div className="actions-status-page">
              <ActionsControlPanel 
                groupBy={groupBy}
                setGroupBy={handleGroupByChange}
                filter={filter}
                setFilter={handleFilterChange}
                totalActions={totalActions}
                filteredActions={filteredActions}
                actionCounts={actionCounts}
              />
              
              <div className={`actions-groups-container ${isFiltering ? 'filter-transition' : ''}`}>
                {loading ? (
                  <div className="loading-container">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>⏳</div>
                    <h3>Loading actions...</h3>
                    <p>Please wait while we fetch your actions.</p>
                  </div>
                ) : (() => {
                  // First, filter groups to only include those with matching actions
                  const visibleGroups = groups.filter(group => {
                    const groupFilteredActions = group.actions.filter(a => filter === 'All' || getLatestWorkStatus(a) === filter);
                    return groupFilteredActions.length > 0;
                  });

                  // If we have visible groups, render them
                  if (visibleGroups.length > 0) {
                    return visibleGroups.map(group => {
                      const groupFilteredActions = group.actions.filter(a => filter === 'All' || getLatestWorkStatus(a) === filter);
                      
                      return (
                        <div key={group.group} className="category-group">
                          <div className="group-header">
                            <h2 className="group-title">{group.group}</h2>
                            <span className="group-count">
                              {groupFilteredActions.length} action{groupFilteredActions.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <ActionCardList 
                            actions={groupFilteredActions} 
                            useOptimizedLayout={true} 
                          />
                        </div>
                      );
                    });
                  }

                  // If no groups but we have total actions, show filter message
                  if (groups.length > 0 && filteredActions === 0) {
                    return (
                      <div className="no-actions-found">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🔍</div>
                        <h3>No actions found</h3>
                        <p>No actions match the current filter "<strong>{filter}</strong>".</p>
                        <button 
                          className="reset-filter-btn"
                          onClick={() => handleFilterChange('All')}
                        >
                          Show all actions
                        </button>
                      </div>
                    );
                  }

                  // If no groups at all
                  return (
                    <div className="no-actions-found">
                      <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📋</div>
                      <h3>No groups available</h3>
                      <p>There are no actions to group by {groupBy}.</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          } />
          <Route path="/weekly-report" element={<WeeklyReportPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
