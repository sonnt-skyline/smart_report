import React from 'react';
import ObjectiveProgressTracker from './components/ObjectiveProgressTracker';
import { assessMembers } from './utils/assessment';
import Leaderboard from './components/Leaderboard';

export default function OverviewPage() {
  const memberStats = assessMembers();
  return (
    <div className="actions-status-page">
      <div style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: '2rem' }}>
        <h2 style={{ color: '#3a3a7a', marginBottom: '1.5rem' }}>Member Objective Leaderboard</h2>
        <Leaderboard memberStats={memberStats} />
      </div>
      <ObjectiveProgressTracker member="Alice" />
    </div>
  );
}
