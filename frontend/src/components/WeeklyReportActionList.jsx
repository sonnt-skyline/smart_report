import { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import { WORK_STATUS_COLORS, ACTION_CATEGORIES, CATEGORY_SUBCATEGORIES, AVAILABLE_OBJECTIVES, WORK_STATUS_OPTIONS } from '../constants';
import './ProgressInput.css';

function getCurrentWeek() {
  const now = new Date();
  const year = now.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

function getPreviousWeek() {
  const now = new Date();
  const prevWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const year = prevWeek.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((prevWeek - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

function NewActionForm({ onAdd, onCancel }) {
  const [newAction, setNewAction] = useState({
    title: '',
    category: ACTION_CATEGORIES[0],
    subCategory: '',
    objective: '',
    status: 'Not started',
    progress: 0,
    dueDate: ''
  });

  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  useEffect(() => {
    // Update subcategories when category changes
    if (newAction.category && CATEGORY_SUBCATEGORIES[newAction.category]) {
      setAvailableSubCategories(CATEGORY_SUBCATEGORIES[newAction.category]);
      // Reset subcategory if it's not in the new list
      if (!CATEGORY_SUBCATEGORIES[newAction.category].includes(newAction.subCategory)) {
        setNewAction(prev => ({ ...prev, subCategory: '' }));
      }
    } else {
      setAvailableSubCategories([]);
    }
  }, [newAction.category, newAction.subCategory]);

  useEffect(() => {
    // Auto-update progress based on status
    setNewAction(prev => {
      let newProgress = prev.progress;
      
      if (prev.status === 'Completed') {
        newProgress = 100;
      } else if (prev.status === 'Not started') {
        newProgress = 0;
      } else if (prev.status === 'On-going' && prev.progress === 0) {
        newProgress = 1; // Set minimum for on-going
      } else if (prev.status === 'On-going' && prev.progress === 100) {
        newProgress = 99; // Set maximum for on-going
      }
      
      return { ...prev, progress: newProgress };
    });
  }, [newAction.status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAction.title.trim()) return;

    const actionToAdd = {
      ...newAction,
      id: Date.now(), // Simple ID generation
      statusUpdates: [{
        week: getCurrentWeek(),
        progress: newAction.progress,
        workStatus: newAction.status
      }],
      tags: [],
      member: 'Alice', // This should come from auth context
      parentObjective: newAction.objective || 'To be defined',
      deadline: newAction.dueDate
    };

    onAdd(actionToAdd);
    setNewAction({
      title: '',
      category: ACTION_CATEGORIES[0],
      subCategory: '',
      objective: '',
      status: 'Not started',
      progress: 0,
      dueDate: ''
    });
  };

  return (
    <div className="new-action-form">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>New Action Title: </label>
            <input
              type="text"
              value={newAction.title}
              onChange={(e) => setNewAction({...newAction, title: e.target.value})}
              placeholder="Enter action title..."
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category:</label>
            <select
              value={newAction.category}
              onChange={(e) => setNewAction({...newAction, category: e.target.value})}
              className="form-select"
            >
              {ACTION_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sub-category:</label>
            {availableSubCategories.length > 0 ? (
              <select
                value={newAction.subCategory}
                onChange={(e) => setNewAction({...newAction, subCategory: e.target.value})}
                className="form-select"
              >
                <option value="">Select sub-category...</option>
                {availableSubCategories.map(subCat => (
                  <option key={subCat} value={subCat}>{subCat}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={newAction.subCategory}
                onChange={(e) => setNewAction({...newAction, subCategory: e.target.value})}
                placeholder="Enter sub-category..."
                className="form-input"
              />
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Target/Objective:</label>
          <select
            value={newAction.objective}
            onChange={(e) => setNewAction({...newAction, objective: e.target.value})}
            className="form-select"
          >
            <option value="">Select objective...</option>
            {AVAILABLE_OBJECTIVES.map(objective => (
              <option key={objective} value={objective}>{objective}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Initial Status:</label>
          <select
            value={newAction.status}
            onChange={(e) => setNewAction({...newAction, status: e.target.value})}
            className="form-select"
          >
            {WORK_STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Progress (%):</label>
          <input
            type="number"
            min={newAction.status === 'On-going' ? "1" : "0"}
            max={newAction.status === 'On-going' ? "99" : "100"}
            value={newAction.progress}
            onChange={(e) => {
              let progress = parseInt(e.target.value) || 0;
              
              // Apply status-based constraints
              if (newAction.status === 'Completed') {
                progress = 100;
              } else if (newAction.status === 'On-going') {
                progress = Math.max(1, Math.min(99, progress));
              } else if (newAction.status === 'Not started') {
                progress = 0;
              }
              // For 'Blocked' and 'On hold', keep current value but don't allow manual editing
              
              setNewAction({...newAction, progress});
            }}
            className="form-input"
            placeholder="0"
            disabled={newAction.status === 'Blocked' || newAction.status === 'On hold'}
            readOnly={newAction.status === 'Completed' || newAction.status === 'Not started'}
          />
        </div>

        <div className="form-group">
          <label>Due Date:</label>
          <input
            type="datetime-local"
            value={newAction.dueDate}
            onChange={(e) => setNewAction({...newAction, dueDate: e.target.value})}
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Add Action</button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function WeeklyReportActionList({ actions, onStatusUpdate, onAddAction, onRevertAction }) {
  const currentWeek = getCurrentWeek();
  const previousWeek = getPreviousWeek();
  const [showNewActionForm, setShowNewActionForm] = useState(false);

  const handleStatusUpdate = (actionId, newStatus, newProgress) => {
    // Call the parent component's status update handler
    onStatusUpdate(actionId, newStatus, newProgress);
  };

  const handleAddNewAction = (newAction) => {
    onAddAction(newAction);
    setShowNewActionForm(false);
  };

  const handleRevertChanges = (actionId) => {
    if (onRevertAction) {
      onRevertAction(actionId);
    }
  };

  // Check if action has changes compared to previous week
  const hasChanges = (action) => {
    const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
    const previousUpdate = action.statusUpdates.find(update => update.week === previousWeek);
    
    // If no current week update, there are no changes this week
    if (!currentUpdate) return false;
    // If no previous update, this is a new action this week
    if (!previousUpdate) return true; 
    
    return currentUpdate.progress !== previousUpdate.progress || 
           currentUpdate.workStatus !== previousUpdate.workStatus;
  };

  if (!actions.length && !showNewActionForm) {
    return (
      <div className="weekly-report-action-list">
        <div className="no-actions-message">
          <p>No actions updated this week.</p>
          <button 
            onClick={() => setShowNewActionForm(true)}
            className="btn btn-primary add-action-btn"
          >
            + Add New Action
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="weekly-report-action-list">
      <div className="action-list-header">
        <button 
          onClick={() => setShowNewActionForm(true)}
          className="btn btn-primary add-action-btn"
          disabled={showNewActionForm}
        >
          + Add New Action
        </button>
      </div>

      {showNewActionForm && (
        <NewActionForm
          onAdd={handleAddNewAction}
          onCancel={() => setShowNewActionForm(false)}
        />
      )}

      {actions.map(action => {
        // Find the current week's status
        const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
        const previousUpdate = action.statusUpdates.find(update => update.week === previousWeek);
        
        // If no current week update, fall back to previous week, then default to 'Not started'
        let workStatus, progress;
        if (currentUpdate) {
          workStatus = currentUpdate.workStatus;
          progress = currentUpdate.progress;
        } else if (previousUpdate) {
          workStatus = previousUpdate.workStatus;
          progress = previousUpdate.progress;
        } else {
          workStatus = 'Not started';
          progress = 0;
        }
        const actionHasChanges = hasChanges(action);
        
        return (
          <div 
            key={action.id} 
            className={`weekly-report-action-item ${workStatus === 'Completed' ? 'completed' : ''} ${actionHasChanges ? 'has-changes' : ''}`}
          >            
            <div className="action-content">
              <div className="action-header">
                <div className="action-title">
                  {action.title}
                  {workStatus === 'Completed' && (
                    <span className="completion-badge">✓ Completed</span>
                  )}
                  {actionHasChanges && (
                    <span className="changes-badge">⬆ Updated</span>
                  )}
                </div>
                {actionHasChanges && (
                  <button 
                    className="revert-btn"
                    onClick={() => handleRevertChanges(action.id)}
                    title="Revert all changes"
                  >
                    ⟲
                  </button>
                )}
              </div>
              
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
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={progress}
                    onChange={(e) => {
                      const newProgress = parseInt(e.target.value) || 0;
                      // Only allow progress editing for On-going status
                      if (workStatus === 'On-going') {
                        const clampedProgress = Math.max(1, Math.min(99, newProgress));
                        handleStatusUpdate(action.id, workStatus, clampedProgress);
                      }
                    }}
                    className="progress-input"
                    disabled={workStatus !== 'On-going'}
                    readOnly={workStatus === 'Blocked' || workStatus === 'On hold'}
                  />
                  <span className="progress-unit">%</span>
                </div>
              </div>
              
              <div className="action-status-row">
                <StatusBadge status={workStatus} />
                
                <div className="action-quick-buttons">
                  <button 
                    className={`quick-btn complete ${workStatus === 'Completed' ? 'active' : ''}`}
                    onClick={() => handleStatusUpdate(action.id, 'Completed', 100)}
                  >
                    Complete
                  </button>
                  <button 
                    className={`quick-btn hold ${workStatus === 'On hold' ? 'active' : ''}`}
                    onClick={() => handleStatusUpdate(action.id, 'On hold', progress)}
                  >
                    Hold
                  </button>
                  <button 
                    className={`quick-btn blocked ${workStatus === 'Blocked' ? 'active' : ''}`}
                    onClick={() => handleStatusUpdate(action.id, 'Blocked', progress)}
                  >
                    Block
                  </button>
                  <button 
                    className={`quick-btn ongoing ${workStatus === 'On-going' ? 'active' : ''}`}
                    onClick={() => handleStatusUpdate(action.id, 'On-going', Math.max(1, Math.min(99, progress || 1)))}
                  >
                    Resume
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
