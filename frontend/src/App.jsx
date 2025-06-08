import { useState } from 'react';
import './App.css';
import AppHeader from './components/AppHeader';
import NotesSection from './components/NotesSection';
import ObjectiveProgressTracker from './components/ObjectiveProgressTracker';
import CategoryColorLegend from './components/CategoryColorLegend';
import FilterButtons from './components/FilterButtons';
import GroupButtons from './components/GroupButtons';
import ActionCardList from './components/ActionCardList';
import { ACTION_CATEGORIES, GROUP_OPTIONS } from './constants';
import { sampleActions } from './data';
import StatusTimelinePage from './StatusTimelinePage';
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
  const notes = 'This week: Focus on emergency escalation and team alert features.';

  let groups = [];
  if (groupBy === 'category') {
    groups = ACTION_CATEGORIES.map(cat => ({
      group: cat,
      actions: sampleActions.filter(a => a.category === cat && a.member === member),
    }));
  } else if (groupBy === 'status') {
    const workStatusTypes = ['Not started', 'On-going', 'Blocked', 'On hold', 'Completed'];
    groups = workStatusTypes.map(status => ({
      group: status,
      actions: sampleActions.filter(a => getLatestWorkStatus(a) === status && a.member === member),
    }));
  } else if (groupBy === 'objective') {
    // Group by Parent Objective (from valueAdded field)
    // All unique valueAdded values for actions by this member are considered Objectives (if present)
    const objectiveActions = sampleActions.filter(a => a.member === member && a.valueAdded);
    const objectives = Array.from(new Set(objectiveActions.map(a => a.valueAdded)));
    groups = objectives.map(obj => ({
      group: obj,
      actions: objectiveActions.filter(a => a.valueAdded === obj),
    }));
    // Optionally, add a group for actions without an objective
    const noObjectiveActions = sampleActions.filter(a => a.member === member && !a.valueAdded);
    if (noObjectiveActions.length > 0) {
      groups.push({ group: 'No Objective', actions: noObjectiveActions });
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="actions-status-page">
            <AppHeader />
            <NotesSection notes={notes} />
            <ObjectiveProgressTracker member={member} />
            <CategoryColorLegend />
            <div style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#3a3a7a' }}>Group by:</div>
            <GroupButtons groupBy={groupBy} setGroupBy={setGroupBy} />
            <FilterButtons filter={filter} setFilter={setFilter} />
            {groups.map(group => (
              <div key={group.group} className="category-group">
                <h2>{group.group}</h2>
                <ActionCardList actions={group.actions.filter(a => filter === 'All' || getLatestWorkStatus(a) === filter)} />
              </div>
            ))}
          </div>
        } />
        <Route path="/status-timeline" element={<StatusTimelinePage />} />
      </Routes>
    </Router>
  );
}

export default App;
