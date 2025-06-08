import React, { useState } from 'react';
import { WORK_STATUS_COLORS } from '../constants';
import { sampleActions } from '../data';

// Helper to get all unique weeks in sorted order from all actions
function getAllWeeks(actions) {
  const weekSet = new Set();
  actions.forEach(action => {
    action.statusUpdates.forEach(update => weekSet.add(update.week));
  });
  return Array.from(weekSet).sort();
}

// Build a map: actionId -> [{week, progress, title}]
function getActionProgressByWeek(actions) {
  const map = {};
  actions.forEach(action => {
    map[action.id] = action.statusUpdates.map(update => ({
      week: update.week,
      progress: update.progress,
      title: action.title
    }));
  });
  return map;
}

const COLORS = [
  '#1976d2', '#c62828', '#2e7d32', '#f9a825', '#6a1b9a', '#00838f', '#ad1457', '#ef6c00', '#283593', '#388e3c'
];

const StatusTimeline = () => {
  const actionMap = getActionProgressByWeek(sampleActions);
  const allWeeks = getAllWeeks(sampleActions);
  const weekIndex = w => allWeeks.indexOf(w);
  const chartWidth = 1000;
  const chartHeight = 400;
  const leftPad = 80;
  const rightPad = 40;
  const topPad = 40;
  const bottomPad = 50;
  const usableWidth = chartWidth - leftPad - rightPad;
  const usableHeight = chartHeight - topPad - bottomPad;

  // State for toggling actions
  const [visible, setVisible] = useState(() => {
    const initial = {};
    Object.keys(actionMap).forEach(id => { initial[id] = true; });
    return initial;
  });

  const toggleAction = id => setVisible(v => ({ ...v, [id]: !v[id] }));

  // Build a table of actions over weeks
  const weekHeaders = allWeeks;
  const getProgressForWeek = (action, week) => {
    const found = action.statusUpdates.find(u => u.week === week);
    return found ? found.progress : '';
  };
  const getStatusForWeek = (action, week, weekIdx) => {
    // Find the latest status update up to and including this week
    let last = null;
    for (const u of action.statusUpdates) {
      if (u.week <= week) last = u;
    }
    // If there is no update at all, return ''
    if (!last) return '';
    // If this week is in statusUpdates, return its workStatus
    const thisUpdate = action.statusUpdates.find(u => u.week === week);
    if (thisUpdate) return thisUpdate.workStatus;
    // If previous status is 'Completed', repeat 'Completed'
    if (last.workStatus === 'Completed') return 'Completed';
    // If previous status is not 'Completed', and this week is after last update, show 'Needs update'
    const lastIdx = weekHeaders.indexOf(last.week);
    if (weekIdx > lastIdx) return 'Needs update';
    // Otherwise, return last known status
    return last.workStatus;
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Status Progress Timeline (Per Action)</h2>
      <svg width={chartWidth} height={chartHeight} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 8px #0002', display: 'block', margin: '0 auto' }}>
        {/* X axis */}
        <line x1={leftPad} y1={chartHeight-bottomPad} x2={chartWidth-rightPad} y2={chartHeight-bottomPad} stroke="#888" />
        {/* Y axis */}
        <line x1={leftPad} y1={topPad} x2={leftPad} y2={chartHeight-bottomPad} stroke="#888" />
        {/* Week labels */}
        {allWeeks.map((w, i) => (
          <text key={w} x={leftPad + (i/(allWeeks.length-1||1))*usableWidth} y={chartHeight-bottomPad+28} fontSize="18" textAnchor="middle">{w}</text>
        ))}
        {/* Y axis labels */}
        {[0, 25, 50, 75, 100].map(val => (
          <g key={val}>
            <text x={leftPad-16} y={chartHeight-bottomPad - (val/100)*usableHeight + 6} fontSize="16" textAnchor="end">{val}%</text>
            <line x1={leftPad-6} y1={chartHeight-bottomPad - (val/100)*usableHeight} x2={chartWidth-rightPad} y2={chartHeight-bottomPad - (val/100)*usableHeight} stroke="#eee" />
          </g>
        ))}
        {/* Status lines per action */}
        {Object.entries(actionMap).map(([id, points], idx) => {
          if (!visible[id]) return null;
          const color = COLORS[idx % COLORS.length];
          const d = points.map((pt, i) => {
            const x = leftPad + (weekIndex(pt.week)/(allWeeks.length-1||1))*usableWidth;
            const y = chartHeight-bottomPad - (pt.progress/100)*usableHeight;
            return `${i===0?'M':'L'}${x},${y}`;
          }).join(' ');
          return (
            <g key={id}>
              <path d={d} fill="none" stroke={color} strokeWidth="4" />
              {points.map((pt, i) => {
                const x = leftPad + (weekIndex(pt.week)/(allWeeks.length-1||1))*usableWidth;
                const y = chartHeight-bottomPad - (pt.progress/100)*usableHeight;
                return <circle key={pt.week} cx={x} cy={y} r="8" fill={color} stroke="#fff" strokeWidth="2" />;
              })}
            </g>
          );
        })}
      </svg>
      {/* Legend for actions with toggles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 24, justifyContent: 'center' }}>
        {Object.entries(actionMap).map(([id, points], idx) => {
          const color = COLORS[idx % COLORS.length];
          return (
            <label key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, opacity: visible[id] ? 1 : 0.4, cursor: 'pointer' }}>
              <input type="checkbox" checked={visible[id]} onChange={() => toggleAction(id)} style={{ width: 18, height: 18 }} />
              <span style={{ width: 24, height: 6, background: color, display: 'inline-block', borderRadius: 3 }}></span>
              <span>{points[0].title}</span>
            </label>
          );
        })}
      </div>
      {/* Table of actions over weeks */}
      <div style={{ marginTop: 40 }}>
        <h3>Actions Progress Table</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%', background: '#fff', margin: '0 auto', fontSize: 16 }}>
          <thead>
            <tr>
              <th rowSpan="2" style={{ border: '1px solid #ccc', padding: 8 }}>Action</th>
              {weekHeaders.map(week => (
                <th key={week} colSpan="2" style={{ border: '1px solid #ccc', padding: 8 }}>{week}</th>
              ))}
            </tr>
            <tr>
              {weekHeaders.map(week => [
                <th key={week+'-progress'} style={{ border: '1px solid #ccc', padding: 8 }}>Progress (%)</th>,
                <th key={week+'-status'} style={{ border: '1px solid #ccc', padding: 8 }}>Status</th>
              ])}
            </tr>
          </thead>
          <tbody>
            {sampleActions.map(action => (
              <tr key={action.id}>
                <td style={{ border: '1px solid #ccc', padding: 8, fontWeight: 600 }}>{action.title}</td>
                {weekHeaders.map((week, weekIdx) => [
                  <td key={week+'-progress'} style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center' }}>{getProgressForWeek(action, week)}</td>,
                  (() => {
                    const status = getStatusForWeek(action, week, weekIdx);
                    return status ? (
                      <td key={week+'-status'} style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center', color: WORK_STATUS_COLORS[status] || (status === 'Needs update' ? '#d32f2f' : '#888'), fontWeight: 600 }}>{status}</td>
                    ) : (
                      <td key={week+'-status'} style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center' }}></td>
                    );
                  })()
                ])}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusTimeline;
