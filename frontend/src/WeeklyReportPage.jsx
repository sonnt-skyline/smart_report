import { useState, useEffect } from 'react';
import WeeklyReportActionList from './components/WeeklyReportActionList';
import ReportCompositionInterface from './components/ReportCompositionInterface';
import { sampleActions } from './data';
import './components/WeeklyReport.css';
import './components/WeeklyReportAdditions.css';

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
  const member = 'Alice'; // This could come from user context in a real app
  const currentWeek = getCurrentWeek();
  const [reportData, setReportData] = useState({
    progress: '',
    blockers: '',
    nextSteps: '',
  });
  const [actionsWithUpdates, setActionsWithUpdates] = useState([]);
  const [completedThisSession, setCompletedThisSession] = useState(new Set()); // Track items completed in current session
  const [allActions, setAllActions] = useState([]); // Store all updated actions before filtering

  // Load initial actions for the current user
  useEffect(() => {
    // Filter actions for this member
    const memberActions = sampleActions.filter(action => action.member === member);

    // For a real app, you'd want to track which actions were updated this week
    const updatedActions = memberActions.filter(action => {
      return action.statusUpdates.some(update => update.week === currentWeek);
    });

    setAllActions(updatedActions);
  }, [member, currentWeek]);

  // Filter actions based on completion status
  useEffect(() => {
    // Filter out completed actions that were NOT completed in this session
    // Keep actions that are either not completed OR were completed during this session
    const filteredActions = allActions.filter(action => {
      const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
      const isCompleted = currentUpdate && currentUpdate.workStatus === 'Completed';

      // Keep if not completed OR completed in this session
      return !isCompleted || completedThisSession.has(action.id);
    });

    setActionsWithUpdates(filteredActions);
  }, [allActions, completedThisSession, currentWeek]);

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

    // If the status is updated to 'Completed', track it in this session
    // but don't remove it from the current report
    if (newStatus === 'Completed') {
      setCompletedThisSession(prev => new Set([...prev, actionId]));
    }
  };

  const handleAddNewAction = (newAction) => {
    setAllActions(prev => [...prev, newAction]);
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

    // Remove from completed this session if it was there
    setCompletedThisSession(prev => {
      const newSet = new Set(prev);
      newSet.delete(actionId);
      return newSet;
    });
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
      <h1>Weekly Report</h1>
      <p className="week-indicator">Week: {currentWeek}</p>

      <div className="report-layout">
        <div className="action-list-section">
          <h2>This Week's Actions</h2>
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
          />
        </div>
      </div>
    </div>
  );
}

export default WeeklyReportPage;
