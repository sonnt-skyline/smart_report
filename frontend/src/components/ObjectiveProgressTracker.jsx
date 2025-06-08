import React from 'react';
import { sampleActions } from '../data';
import ProgressBar from './ProgressBar';

// Helper to group actions by their valueAdded (Objective)
function getObjectivesWithActions(actions, member) {
  // Only consider actions with valueAdded
  const actionsWithObj = actions.filter(a => a.member === member && a.valueAdded);
  // Get unique objectives
  const objectives = Array.from(new Set(actionsWithObj.map(a => a.valueAdded)));
  // Map each objective to its actions
  return objectives.map(obj => ({
    objective: obj,
    actions: actionsWithObj.filter(a => a.valueAdded === obj),
  }));
}

// Helper to get latest progress for an action
function getLatestProgress(action) {
  if (!action.statusUpdates || !action.statusUpdates.length) return 0;
  // Find the latest update (by week string)
  let latest = action.statusUpdates[0];
  for (const u of action.statusUpdates) {
    if (u.week > latest.week) latest = u;
  }
  return latest.progress;
}

export default function ObjectiveProgressTracker({ member = 'Alice' }) {
  const objectives = getObjectivesWithActions(sampleActions, member);

  if (!objectives.length) return <div>No objectives found for {member}.</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: '2rem' }}>
      <h2 style={{ color: '#3a3a7a', marginBottom: '1.5rem' }}>Objectives Progress Tracker</h2>
      {objectives.map(obj => {
        // Calculate average progress for the objective
        const progresses = obj.actions.map(getLatestProgress);
        const avgProgress = progresses.length ? Math.round(progresses.reduce((a, b) => a + b, 0) / progresses.length) : 0;
        return (
          <div key={obj.objective} style={{ marginBottom: '2.2rem', paddingBottom: '1.2rem', borderBottom: '1px solid #eee' }}>
            <div style={{ fontWeight: 700, fontSize: '1.15em', color: '#005a00', marginBottom: 8 }}>{obj.objective}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <span style={{ fontWeight: 600, color: '#3a3a7a' }}>Average Progress:</span>
              <ProgressBar value={avgProgress} workStatus={avgProgress === 100 ? 'Completed' : 'On-going'} />
              <span style={{ fontWeight: 700, color: '#005a00', marginLeft: 8 }}>{avgProgress}%</span>
            </div>
            <div style={{ marginLeft: 8 }}>
              <b>Related Actions:</b>
              <ul style={{ margin: '0.5em 0 0 1.2em', padding: 0 }}>
                {obj.actions.map(action => (
                  <li key={action.id} style={{ marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{action.title}</span> — Progress: {getLatestProgress(action)}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
