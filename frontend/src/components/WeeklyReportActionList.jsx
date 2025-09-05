import { useState } from 'react';
import StatusBadge from './StatusBadge';
import { WORK_STATUS_COLORS } from '../constants';

function getCurrentWeek() {
  const now = new Date();
  const year = now.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

export default function WeeklyReportActionList({ actions, selectedActions, onActionToggle }) {
  const currentWeek = getCurrentWeek();
  const [actionStatuses, setActionStatuses] = useState({});

  const handleStatusUpdate = (actionId, newStatus) => {
    setActionStatuses(prev => ({
      ...prev,
      [actionId]: newStatus
    }));
    
    // In a real app, this would update the action's status in your data store
    console.log(`Action ${actionId} updated to ${newStatus}`);
  };

  if (!actions.length) return <p>No actions updated this week.</p>;

  return (
    <div className="weekly-report-action-list">
      {actions.map(action => {
        // Find the current week's status
        const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
        const workStatus = currentUpdate ? currentUpdate.workStatus : 'Not started';
        const progress = currentUpdate ? currentUpdate.progress : 0;
        
        // Use the updated status if available, otherwise use the original
        const displayStatus = actionStatuses[action.id] || workStatus;
        
        return (
          <div 
            key={action.id} 
            className={`weekly-report-action-item ${selectedActions.includes(action.id) ? 'selected' : ''}`}
          >
            <div className="action-checkbox">
              <input 
                type="checkbox"
                checked={selectedActions.includes(action.id)}
                onChange={() => onActionToggle(action.id)}
                id={`action-check-${action.id}`}
              />
            </div>
            
            <div className="action-content">
              <div className="action-title">{action.title}</div>
              
              <div className="action-meta">
                <div className="action-objective">
                  {action.parentObjective ? (
                    <>
                      <span className="meta-label">Objective:</span>
                      <span className="meta-value objective-link">{action.parentObjective}</span>
                    </>
                  ) : (
                    <span className="meta-value">No linked objective</span>
                  )}
                </div>
                
                <div className="action-progress">
                  <span className="meta-label">Progress:</span>
                  <span className="meta-value">{progress}%</span>
                </div>
              </div>
              
              <div className="action-status-row">
                <StatusBadge status={displayStatus} />
                
                <div className="action-quick-buttons">
                  <button 
                    className={`quick-btn complete ${displayStatus === 'Completed' ? 'active' : ''}`}
                    onClick={() => handleStatusUpdate(action.id, 'Completed')}
                  >
                    Complete
                  </button>
                  <button 
                    className={`quick-btn hold ${displayStatus === 'On hold' ? 'active' : ''}`}
                    onClick={() => handleStatusUpdate(action.id, 'On hold')}
                  >
                    Hold
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
