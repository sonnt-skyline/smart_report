import { useState } from 'react';
import './App.css';
import './styles/theme.module.css'; // Import theme variables
import NotesSection from './components/NotesSection';
import CategoryColorLegend from './components/CategoryColorLegend';
import FilterButtons from './components/FilterButtons';
import GroupButtons from './components/GroupButtons';
import ActionCardList from './components/ActionCardList';
import ActionsControlPanel from './components/ActionsControlPanel';
import NavigationBar from './components/NavigationBar';
import { ACTION_CATEGORIES, GROUP_OPTIONS } from './constants';
import { sampleActions } from './data';
import StatusTimelinePage from './StatusTimelinePage';
import OverviewPage from './OverviewPage';
import Dashboard from './Dashboard';
import ObjectivesPage from './ObjectivesPage';
import WeeklyReportPage from './WeeklyReportPage';
import MemberRankingPage from './MemberRankingPage';
import SummaryPage from './SummaryPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
  const member = 'Alice';
  const [groupBy, setGroupBy] = useState('category');
  const [filter, setFilter] = useState('All');
  const [isFiltering, setIsFiltering] = useState(false);
  const notes = 'This week: Focus on emergency escalation and team alert features.';

  // Filter actions by member first
  const memberActions = sampleActions.filter(a => a.member === member);
  
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

  return (
    <Router>
      <NavigationBar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
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
                {(() => {
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
          <Route path="/status-timeline" element={<StatusTimelinePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/objectives" element={<ObjectivesPage />} />
          <Route path="/weekly-report" element={<WeeklyReportPage />} />
          <Route path="/member-ranking" element={<MemberRankingPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
