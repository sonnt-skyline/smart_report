import { useState, useEffect } from 'react';
import WeeklyReportActionList from './components/WeeklyReportActionList';
import ReportCompositionInterface from './components/ReportCompositionInterface';
import PreviousReportsList from './components/PreviousReportsList';
import { weeklyReportAPI } from './utils/api';
import './components/WeeklyReport.css';
import './components/WeeklyReportAdditions.css';
import './components/PreviousReports.css';

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

function WeeklyReportPage() {
  const currentWeek = getCurrentWeek();
  
  const [reportData, setReportData] = useState({
    progress: '',
    blockers: '',
    nextSteps: '',
    additionalNotes: ''
  });
  const [actionsWithUpdates, setActionsWithUpdates] = useState([]);
  const [allActions, setAllActions] = useState([]); // Store all updated actions before filtering
  const [showPreviousReports, setShowPreviousReports] = useState(false);

  // Load initial actions for the current user
  useEffect(() => {
    const loadUserActions = async () => {
      try {
        // Get actions from backend API
        const actions = await weeklyReportAPI.getUserActions();

        // Set all actions - let the completion filter handle the filtering
        setAllActions(actions);
      } catch (error) {
        console.error('Failed to load user actions:', error);
        // Set empty array on error to prevent app crashes
        setAllActions([]);
      }
    };

    loadUserActions();
  }, [currentWeek]);

  // Filter actions based on completion status
  useEffect(() => {
    // Show only incomplete actions (exclude completed actions)
    const incompleteActions = allActions.filter(action => {
      const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
      
      // If no update exists for current week, consider it incomplete (should be shown)
      if (!currentUpdate) {
        return true;
      }
      
      const isCompleted = currentUpdate.workStatus === 'Completed';

      // Only show actions that are not completed
      return !isCompleted;
    });

    setActionsWithUpdates(incompleteActions);
  }, [allActions, currentWeek]);

  const handleInputChange = (field, value) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatusUpdate = (actionId, newStatus, newProgress = null) => {
    // Apply progress constraints based on status
    let finalProgress = newProgress;
    
    if (newStatus === 'Completed') {
      finalProgress = 100;
    } else if (newStatus === 'Not started') {
      finalProgress = 0;
    } else if (newStatus === 'On-going' && finalProgress !== null) {
      finalProgress = Math.max(1, Math.min(99, finalProgress));
    }
    
    // Update the action status in the all actions state
    setAllActions(prev =>
      prev.map(action => {
        if (action.id === actionId) {
          // Update the status for the current week
          const updatedStatusUpdates = action.statusUpdates.map(update =>
            update.week === currentWeek
              ? { 
                  ...update, 
                  workStatus: newStatus,
                  progress: finalProgress !== null ? finalProgress : (newStatus === 'Completed' ? 100 : update.progress)
                }
              : update
          );

          // If no status update exists for current week, add one
          const hasCurrentWeekUpdate = action.statusUpdates.some(update => update.week === currentWeek);
          if (!hasCurrentWeekUpdate) {
            let defaultProgress = 0;
            if (newStatus === 'Completed') {
              defaultProgress = 100;
            } else if (newStatus === 'On-going') {
              defaultProgress = finalProgress !== null ? finalProgress : 1;
            }
            
            updatedStatusUpdates.push({
              week: currentWeek,
              progress: defaultProgress,
              workStatus: newStatus
            });
          }

          return {
            ...action,
            statusUpdates: updatedStatusUpdates
          };
        }
        return action;
      })
    );

    // Note: Actions are automatically filtered to show only incomplete ones
  };

  const handleAddNewAction = (newAction) => {
    setAllActions(prev => [...prev, newAction]);
  };

  const handleReportSubmitted = async () => {
    // Refresh actions data after successful report submission
    try {
      console.log('Report submitted successfully, refreshing actions data...');
      
      // Add a small delay to ensure backend has processed the updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const actions = await weeklyReportAPI.getUserActions();
      console.log('Actions data refreshed:', actions);
      
      // Log current week status updates for debugging
      const currentWeek = getCurrentWeek();
      actions.forEach(action => {
        const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
        if (currentUpdate) {
          console.log(`Action ${action.title}: ${currentUpdate.progress}% - ${currentUpdate.workStatus}`);
        }
      });
      
      setAllActions(actions);
      console.log('Actions state updated after report submission');
    } catch (error) {
      console.error('Failed to refresh actions after report submission:', error);
    }
  };

  const handleRevertAction = (actionId) => {
    // Revert action to previous week's state
    const previousWeek = getPreviousWeek();
    
    setAllActions(prev =>
      prev.map(action => {
        if (action.id === actionId) {
          const previousUpdate = action.statusUpdates.find(update => update.week === previousWeek);
          
          if (previousUpdate) {
            // Remove current week's update and revert to previous week's state
            const updatedStatusUpdates = action.statusUpdates.filter(update => update.week !== currentWeek);
            
            return {
              ...action,
              statusUpdates: updatedStatusUpdates
            };
          } else {
            // If no previous update exists, set to 'Not started' with 0 progress
            const updatedStatusUpdates = action.statusUpdates.map(update =>
              update.week === currentWeek
                ? { ...update, progress: 0, workStatus: 'Not started' }
                : update
            );
            
            return {
              ...action,
              statusUpdates: updatedStatusUpdates
            };
          }
        }
        return action;
      })
    );
  };

  const generateAISummary = () => {
    // Generate AI summary based on all current actions regardless of selection
    const activeActions = actionsWithUpdates.filter(action => {
      const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
      return currentUpdate && currentUpdate.workStatus !== 'Not started';
    });

    if (activeActions.length === 0) {
      const aiSummary = {
        progress: "No active actions this week. Focus on planning and setting up objectives for the coming period.",
        blockers: "No specific blockers identified. Consider reviewing objectives and action items for the upcoming work.",
        nextSteps: "Review and plan new actions and objectives. Set up concrete deliverables for the next week."
      };
      setReportData(aiSummary);
      return;
    }

    // Generate summary based on all active actions
    const completedActions = activeActions.filter(action => {
      const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
      return currentUpdate && currentUpdate.workStatus === 'Completed';
    });

    const ongoingActions = activeActions.filter(action => {
      const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
      return currentUpdate && currentUpdate.workStatus === 'On-going';
    });

    const blockedActions = activeActions.filter(action => {
      const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
      return currentUpdate && (currentUpdate.workStatus === 'On hold' || currentUpdate.workStatus === 'Blocked');
    });

    let progressText = "This week's accomplishments:\n";
    if (completedActions.length > 0) {
      progressText += completedActions.map(action => `• Completed "${action.title}"`).join('\n') + '\n';
    }
    if (ongoingActions.length > 0) {
      progressText += ongoingActions.map(action => {
        const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
        return `• Progressed on "${action.title}" (${currentUpdate?.progress || 0}% complete)`;
      }).join('\n');
    }

    let blockersText = "No major blockers identified this week.";
    if (blockedActions.length > 0) {
      blockersText = "Current blockers:\n" + 
        blockedActions.map(action => `• "${action.title}" is ${action.statusUpdates.find(update => update.week === currentWeek)?.workStatus || 'blocked'}`).join('\n');
    }

    let nextStepsText = "Planned for next week:\n";
    if (ongoingActions.length > 0) {
      nextStepsText += ongoingActions.map(action => `• Continue work on "${action.title}"`).join('\n');
    }
    if (completedActions.length > 0) {
      nextStepsText += "\n• Focus on next priorities and objectives";
    }

    const aiSummary = {
      progress: progressText,
      blockers: blockersText,
      nextSteps: nextStepsText
    };

    setReportData(aiSummary);
  };

  return (
    <div className="weekly-report-page">
      <div className="page-header">
        <div>
          <h1>Weekly Report</h1>
          <p className="week-indicator">Week: {currentWeek}</p>
        </div>
        <button 
          className="view-previous-button"
          onClick={() => setShowPreviousReports(true)}
        >
          📋 View Previous Reports
        </button>
      </div>

      <div className="report-layout">
        <div className="action-list-section">
          <h2>Action List</h2>
          <p className="action-list-description">Showing incomplete and not started actions</p>
          <WeeklyReportActionList
            actions={actionsWithUpdates}
            onStatusUpdate={handleStatusUpdate}
            onAddAction={handleAddNewAction}
            onRevertAction={handleRevertAction}
          />
        </div>

        <div className="report-composer-section">
          <h2>Weekly Report Composer</h2>
          <ReportCompositionInterface
            reportData={reportData}
            onInputChange={handleInputChange}
            onGenerateAISummary={generateAISummary}
            currentWeek={currentWeek}
            allActions={allActions}
            onReportSubmitted={handleReportSubmitted}
          />
        </div>
      </div>

      <PreviousReportsList 
        isVisible={showPreviousReports}
        onClose={() => setShowPreviousReports(false)}
      />
    </div>
  );
}

export default WeeklyReportPage;
