import React, { useState } from 'react';
import { sampleActions, sampleObjectives } from '../data';
import ProgressBar from './ProgressBar';

// Helper to group actions by their parentObjective (Objective)
function getObjectivesWithActions(actions, member) {
  const actionsWithObj = actions.filter(a => a.member === member && a.parentObjective);
  const objectives = Array.from(new Set(actionsWithObj.map(a => a.parentObjective)));
  return objectives.map(obj => ({
    objective: obj,
    actions: actionsWithObj.filter(a => a.parentObjective === obj),
  }));
}

function getLatestProgress(action) {
  if (!action.statusUpdates || !action.statusUpdates.length) return 0;
  let latest = action.statusUpdates[0];
  for (const u of action.statusUpdates) {
    if (u.week > latest.week) latest = u;
  }
  return latest.progress;
}

function getStartDate(action) {
  // Start date = earliest status update with progress > 0
  if (!action.statusUpdates || !action.statusUpdates.length) return '';
  const started = action.statusUpdates.find(u => u.progress > 0);
  return started ? started.week : '';
}

function getOverallStatus(progress) {
  if (progress === 0) return 'Not started';
  if (progress === 100) return 'Completed';
  return 'In-progress';
}

function parseWeekString(weekStr) {
  // '2025-W24' => Date object for Monday of that week
  const [year, week] = weekStr.split('-W').map(Number);
  const d = new Date(year, 0, 1 + (week - 1) * 7);
  // Adjust to Monday
  d.setDate(d.getDate() - d.getDay() + 1);
  d.setHours(0,0,0,0);
  return d;
}

function daysBetween(date1, date2) {
  const ms = date2 - date1;
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function getCurrentVelocity(action, currentDate) {
  const progress = getLatestProgress(action);
  const startWeek = getStartDate(action);
  if (!startWeek) return '';
  const startDate = parseWeekString(startWeek);
  const spentDays = daysBetween(startDate, currentDate);
  if (spentDays === 0) return '';
  return (progress / spentDays).toFixed(2);
}

function getSuggestedVelocity(action, currentDate) {
  const progress = getLatestProgress(action);
  const deadline = new Date(action.deadline);
  deadline.setHours(0,0,0,0);
  const remainingDays = daysBetween(currentDate, deadline);
  if (remainingDays === 0) return '';
  const remainingPercent = 100 - progress;
  return (remainingPercent / remainingDays).toFixed(2);
}

export default function ObjectiveProgressTracker({ member = 'Alice' }) {
  const now = new Date(2025, 5, 8); // June 8, 2025
  function getObjectiveMeta(objectiveName) {
    return sampleObjectives.find(obj => obj.name === objectiveName) || {};
  }
  const objectives = getObjectivesWithActions(sampleActions, member).map(obj => {
    const progresses = obj.actions.map(getLatestProgress);
    const avgProgress = progresses.length ? Math.round(progresses.reduce((a, b) => a + b, 0) / progresses.length) : 0;
    const meta = getObjectiveMeta(obj.objective);
    return {
      ...obj,
      avgProgress,
      overallStatus: getOverallStatus(avgProgress),
      importance: meta.importance,
      urgency: meta.urgency
    };
  });

  // Group objectives by overall status
  const statusGroups = [
    { label: 'In-progress', key: 'In-progress' },
    { label: 'Completed (100%)', key: 'Completed' },
    { label: 'Not started (0%)', key: 'Not started' },
  ];

  // Find all objectives grouped by status
  const groupedObjectives = statusGroups.map(group => ({
    ...group,
    objs: objectives.filter(obj => obj.overallStatus === group.key)
  })).filter(g => g.objs.length);

  // State for open/close per group
  const [open, setOpen] = useState(() => {
    const o = {};
    statusGroups.forEach(g => { o[g.key] = true; });
    return o;
  });

  if (!objectives.length) return <div>No objectives found for {member}.</div>;

  return (
    <div style={{ maxWidth: 1100, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: '2rem' }}>
      <h2 style={{ color: '#3a3a7a', marginBottom: '1.5rem' }}>Objectives Progress Tracker</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', marginBottom: 12, tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '25%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '30%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
        </colgroup>
        <thead>
          <tr style={{ background: '#f7f7fa' }}>
            <th style={{ padding: '0.6em 1em', border: '1px solid #e0e0e0', textAlign: 'center' }}>Objective</th>
            <th style={{ padding: '0.6em 1em', border: '1px solid #e0e0e0', textAlign: 'center' }}>Avg Progress</th>
            <th style={{ padding: '0.6em 1em', border: '1px solid #e0e0e0', textAlign: 'center' }}>Action</th>
            <th style={{ padding: '0.6em 1em', border: '1px solid #e0e0e0', textAlign: 'center' }}>% Progress</th>
            <th style={{ padding: '0.6em 1em', border: '1px solid #e0e0e0', textAlign: 'center' }}>Current Velocity</th>
            <th style={{ padding: '0.6em 1em', border: '1px solid #e0e0e0', textAlign: 'center' }}>Suggested Velocity</th>
          </tr>
        </thead>
        <tbody>
          {groupedObjectives.map(group => (
            <React.Fragment key={group.key}>
              <tr
                style={{ cursor: 'pointer', fontWeight: 700, fontSize: '1.1em', color: '#005a00', background: '#f7f7fa', userSelect: 'none' }}
                onClick={() => setOpen(o => ({ ...o, [group.key]: !o[group.key] }))}
              >
                <td colSpan={6} style={{ padding: '0.7em 1em', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 8 }}>{open[group.key] ? '▼' : '▶'}</span>
                  {group.label} <span style={{ color: '#888', fontWeight: 400, marginLeft: 8 }}>({group.objs.length})</span>
                </td>
              </tr>
              {open[group.key] && group.objs.map(obj => (
                obj.actions.map((action, idx) => (
                  <tr key={obj.objective + '-' + action.id}>
                    {idx === 0 && (
                      <td rowSpan={obj.actions.length} style={{ border: '1px solid #e0e0e0', padding: '0.4em 0.5em', fontWeight: 600, wordBreak: 'break-word', verticalAlign: 'middle', background: '#fafaff' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.2 }}>
                          <span>{obj.objective}</span>
                          {(() => {
                            const meta = sampleObjectives.find(o => o.name === obj.objective) || {};
                            const imp = typeof meta.importance === 'number' ? meta.importance : 0;
                            const urg = typeof meta.urgency === 'number' ? meta.urgency : 0;
                            return (
                              <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                <span title={`Importance: ${imp}`} aria-label={`Importance: ${imp}`} style={{ display: 'flex', flexDirection: 'row' }}>
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      style={{
                                        fontSize: '1em',
                                        padding: 0,
                                        margin: 0,
                                        opacity: i < imp ? 1 : 0.3,
                                        filter: i < imp ? 'none' : 'grayscale(100%)',
                                        transition: 'opacity 0.2s, filter 0.2s'
                                      }}
                                    > ⭐ </span>
                                  ))}
                                </span>
                                <span title={`Urgency: ${urg}`} aria-label={`Urgency: ${urg}`} style={{ display: 'flex', flexDirection: 'row', marginLeft: 6 }}>
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      style={{
                                        fontSize: '1em',
                                        padding: 0,
                                        margin: 0,
                                        opacity: i < urg ? 1 : 0.3,
                                        filter: i < urg ? 'none' : 'grayscale(100%)',
                                        transition: 'opacity 0.2s, filter 0.2s'
                                      }}
                                    > ⚡ </span>
                                  ))}
                                </span>
                              </span>
                            );
                          })()}
                        </div>
                      </td>
                    )}
                    {idx === 0 && (
                      <td rowSpan={obj.actions.length} style={{ border: '1px solid #e0e0e0', padding: '0.6em 1em', textAlign: 'center', minWidth: 120, verticalAlign: 'middle', background: '#fafaff' }}>
                        <ProgressBar value={obj.avgProgress} workStatus={obj.overallStatus} />
                        <span style={{ fontWeight: 700, color: '#005a00', marginLeft: 8 }}>{obj.avgProgress}%</span>
                      </td>
                    )}
                    <td style={{ border: '1px solid #e0e0e0', padding: '0.6em 1em', fontWeight: 600, wordBreak: 'break-word' }}>{action.title}</td>
                    <td style={{ border: '1px solid #e0e0e0', padding: '0.6em 1em', textAlign: 'center' }}>{getLatestProgress(action)}%</td>
                    <td style={{ border: '1px solid #e0e0e0', padding: '0.6em 1em', textAlign: 'center' }}>{getCurrentVelocity(action, now)}</td>
                    <td style={{ border: '1px solid #e0e0e0', padding: '0.6em 1em', textAlign: 'center' }}>{getSuggestedVelocity(action, now)}</td>
                  </tr>
                ))
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
