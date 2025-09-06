import { useState, useEffect } from 'react';
import { ACTION_CATEGORIES, CATEGORY_SUBCATEGORIES, WORK_STATUS_COLORS } from '../constants';

const WORK_STATUS_OPTIONS = ['Not started', 'On-going', 'Blocked', 'On hold', 'Completed'];

function getCurrentWeek() {
  const now = new Date();
  const year = now.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

function ActionItem({ action, onUpdate }) {
  const [localAction, setLocalAction] = useState(action);
  const [currentStatus, setCurrentStatus] = useState('Not started');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [definitionOfDone, setDefinitionOfDone] = useState(action.definitionOfDone || '');

  useEffect(() => {
    // Find the latest status for current week
    const currentWeek = getCurrentWeek();
    const latestUpdate = action.statusUpdates?.find(u => u.week === currentWeek) ||
                        action.statusUpdates?.[action.statusUpdates.length - 1];
    
    if (latestUpdate) {
      setCurrentStatus(latestUpdate.workStatus);
      setCurrentProgress(latestUpdate.progress);
    }
  }, [action]);

  const handleStatusChange = (field, value) => {
    const updatedAction = { ...localAction };
    
    if (field === 'status') {
      setCurrentStatus(value);
    } else if (field === 'progress') {
      setCurrentProgress(parseInt(value));
    } else if (field === 'definitionOfDone') {
      setDefinitionOfDone(value);
      updatedAction.definitionOfDone = value;
    }

    // Update the action with new status for current week
    const currentWeek = getCurrentWeek();
    const statusUpdate = {
      week: currentWeek,
      progress: field === 'progress' ? parseInt(value) : currentProgress,
      workStatus: field === 'status' ? value : currentStatus
    };

    // Replace or add current week's status
    if (!updatedAction.statusUpdates) {
      updatedAction.statusUpdates = [];
    }
    
    const existingIndex = updatedAction.statusUpdates.findIndex(u => u.week === currentWeek);
    if (existingIndex >= 0) {
      updatedAction.statusUpdates[existingIndex] = statusUpdate;
    } else {
      updatedAction.statusUpdates.push(statusUpdate);
    }

    setLocalAction(updatedAction);
    onUpdate(updatedAction);
  };

  return (
    <div className="action-item-form">
      <div className="action-item-header">
        <h4>{action.title}</h4>
        <div className="action-meta">
          <span className="category-badge" style={{ background: WORK_STATUS_COLORS[action.category] }}>
            {action.category}
          </span>
          {action.subCategory && (
            <span className="subcategory-badge">{action.subCategory}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Work Status:</label>
          <select 
            value={currentStatus} 
            onChange={(e) => handleStatusChange('status', e.target.value)}
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
            type="range"
            min="0"
            max="100"
            value={currentProgress}
            onChange={(e) => handleStatusChange('progress', e.target.value)}
            className="progress-slider"
          />
          <span className="progress-value">{currentProgress}%</span>
        </div>
      </div>

      <div className="form-group">
        <label>Definition of Done:</label>
        <textarea
          value={definitionOfDone}
          onChange={(e) => handleStatusChange('definitionOfDone', e.target.value)}
          placeholder="Define what 'done' means for this action..."
          className="form-textarea"
          rows="3"
        />
      </div>
    </div>
  );
}

function NewActionForm({ onAdd, onCancel }) {
  const [newAction, setNewAction] = useState({
    title: '',
    category: ACTION_CATEGORIES[0],
    subCategory: '',
    target: '',
    definitionOfDone: '',
    deadline: ''
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
  }, [newAction.category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAction.title.trim()) return;

    const actionToAdd = {
      ...newAction,
      id: Date.now(), // Simple ID generation
      statusUpdates: [{
        week: getCurrentWeek(),
        progress: 0,
        workStatus: 'Not started'
      }],
      tags: [],
      member: 'Current User', // This should come from auth context
      valueAdded: newAction.target || 'To be defined'
    };

    onAdd(actionToAdd);
    setNewAction({
      title: '',
      category: ACTION_CATEGORIES[0],
      subCategory: '',
      target: '',
      definitionOfDone: '',
      deadline: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="new-action-form">
      <h4>Add New Action</h4>
      
      <div className="form-row">
        <div className="form-group">
          <label>Action Title: *</label>
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
        <label>Target:</label>
        <input
          type="text"
          value={newAction.target}
          onChange={(e) => setNewAction({...newAction, target: e.target.value})}
          placeholder="What is the target/goal of this action?"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Definition of Done:</label>
        <textarea
          value={newAction.definitionOfDone}
          onChange={(e) => setNewAction({...newAction, definitionOfDone: e.target.value})}
          placeholder="Define what 'done' means for this action..."
          className="form-textarea"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Deadline:</label>
        <input
          type="datetime-local"
          value={newAction.deadline}
          onChange={(e) => setNewAction({...newAction, deadline: e.target.value})}
          className="form-input"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Add Action</button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

export default function WeeklyReportForm({ initialActions = [], onSubmit }) {
  const [actions, setActions] = useState(initialActions);
  const [showNewActionForm, setShowNewActionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  const handleActionUpdate = (updatedAction) => {
    setActions(prev => prev.map(action => 
      action.id === updatedAction.id ? updatedAction : action
    ));
  };

  const handleAddNewAction = (newAction) => {
    setActions(prev => [...prev, newAction]);
    setShowNewActionForm(false);
  };

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    try {
      const reportData = {
        week: getCurrentWeek(),
        actions: actions,
        notes: notes,
        submittedAt: new Date().toISOString(),
        member: 'Current User' // This should come from auth context
      };

      // Call the onSubmit prop with the report data
      if (onSubmit) {
        await onSubmit(reportData);
      } else {
        // Default behavior - you can replace this with actual API call
        console.log('Submitting weekly report:', reportData);
        alert('Weekly report submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentWeek = getCurrentWeek();

  return (
    <div className="weekly-report-form">
      <div className="report-header">
        <h2>Weekly Report Submission</h2>
        <p className="week-info">Week: {currentWeek}</p>
      </div>

      <div className="actions-section">
        <h3>Current Actions Status</h3>
        {actions.length === 0 ? (
          <p className="no-actions">No actions found. Add some actions to get started.</p>
        ) : (
          <div className="actions-list">
            {actions.map(action => (
              <ActionItem
                key={action.id}
                action={action}
                onUpdate={handleActionUpdate}
              />
            ))}
          </div>
        )}
      </div>

      <div className="new-action-section">
        {!showNewActionForm ? (
          <button 
            onClick={() => setShowNewActionForm(true)}
            className="btn btn-outline"
          >
            + Add New Action
          </button>
        ) : (
          <NewActionForm
            onAdd={handleAddNewAction}
            onCancel={() => setShowNewActionForm(false)}
          />
        )}
      </div>

      <div className="notes-section">
        <h3>Weekly Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes for this week..."
          className="form-textarea notes-textarea"
          rows="4"
        />
      </div>

      <div className="submit-section">
        <button
          onClick={handleSubmitReport}
          disabled={isSubmitting}
          className="btn btn-primary btn-large"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Weekly Report'}
        </button>
      </div>
    </div>
  );
}
