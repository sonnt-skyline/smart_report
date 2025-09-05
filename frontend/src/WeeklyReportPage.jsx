import { useState, useEffect } from 'react';
import WeeklyReportActionList from './components/WeeklyReportActionList';
import ReportCompositionInterface from './components/ReportCompositionInterface';
import { sampleActions } from './data';

function getCurrentWeek() {
  const now = new Date();
  const year = now.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

function WeeklyReportPage() {
  const member = 'Alice'; // This could come from user context in a real app
  const currentWeek = getCurrentWeek();
  const [reportData, setReportData] = useState({
    progress: '', // Auto-filled from actions
    blockers: '',
    nextSteps: '',
  });
  const [selectedActions, setSelectedActions] = useState([]);
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
    // Initialize with no selected actions (single selection only)
    if (selectedActions.length > 0) {
      // Check if selected action is still in the filtered list
      const selectedStillAvailable = filteredActions.some(action => action.id === selectedActions[0]);
      if (!selectedStillAvailable) {
        setSelectedActions([]);
      }
    }
  }, [allActions, completedThisSession, currentWeek]);

  // Generate progress text automatically based on selected actions
  useEffect(() => {
    if (selectedActions.length === 0) {
      setReportData(prev => ({ ...prev, progress: '' }));
      return;
    }

    // Generate progress summary for the single selected action
    const actionId = selectedActions[0]; // Only one action can be selected
    const action = actionsWithUpdates.find(a => a.id === actionId);
    if (!action) return;

    const update = action.statusUpdates.find(update => update.week === currentWeek);
    if (!update) return;

    const progressText = `- ${action.title}: ${update.progress}% complete, status: ${update.workStatus}`;

    setReportData(prev => ({
      ...prev,
      progress: progressText
    }));
  }, [selectedActions, actionsWithUpdates, currentWeek]);

  const handleInputChange = (field, value) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleActionToggle = (actionId) => {
    setSelectedActions(prev => {
      // Single selection only - if the same action is clicked, deselect it
      if (prev.includes(actionId)) {
        return [];
      } else {
        // Replace current selection with the new one
        return [actionId];
      }
    });
  };

  const handleStatusUpdate = (actionId, newStatus) => {
    // Update the action status in the all actions state
    setAllActions(prev =>
      prev.map(action => {
        if (action.id === actionId) {
          // Update the status for the current week
          const updatedStatusUpdates = action.statusUpdates.map(update =>
            update.week === currentWeek
              ? { ...update, workStatus: newStatus }
              : update
          );

          // If no status update exists for current week, add one
          const hasCurrentWeekUpdate = action.statusUpdates.some(update => update.week === currentWeek);
          if (!hasCurrentWeekUpdate) {
            updatedStatusUpdates.push({
              week: currentWeek,
              progress: newStatus === 'Completed' ? 100 : 0,
              workStatus: newStatus
            });
          } else {
            // Update progress to 100% if completed
            updatedStatusUpdates.forEach(update => {
              if (update.week === currentWeek && newStatus === 'Completed') {
                update.progress = 100;
              }
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

  const generateAISummary = () => {
    // In a real app, this would call an API with the selected action
    // For now, we'll simulate a simple AI summary
    if (selectedActions.length === 0) {
      const aiSummary = {
        progress: "No actions selected for this week's report.",
        blockers: "Please select an action to generate AI summary.",
        nextSteps: "Select an ongoing action from the list to include in your weekly report."
      };
      setReportData(aiSummary);
      return;
    }

    const selectedAction = actionsWithUpdates.find(a => a.id === selectedActions[0]);
    if (!selectedAction) return;

    const currentUpdate = selectedAction.statusUpdates.find(update => update.week === currentWeek);
    const isCompletedThisSession = completedThisSession.has(selectedAction.id);

    const aiSummary = {
      progress: `Worked on "${selectedAction.title}" this week. Current progress: ${currentUpdate?.progress || 0}% complete with status: ${currentUpdate?.workStatus || 'Not started'}. ${isCompletedThisSession ? 'Successfully completed during this reporting period! ' : ''}This contributes to the objective: ${selectedAction.parentObjective}.`,
      blockers: currentUpdate?.workStatus === 'On hold' ? "Task is currently on hold. Need to identify and resolve blocking issues." : isCompletedThisSession ? "No blockers - task successfully completed this week!" : "No major blockers identified this week.",
      nextSteps: isCompletedThisSession ? `Task "${selectedAction.title}" is complete. Focus on next priorities and objectives.` : currentUpdate?.workStatus === 'On-going' ? `Continue working on "${selectedAction.title}" to reach completion. Focus on addressing any remaining requirements.` : `Resume work on "${selectedAction.title}" and identify next actionable steps.`
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
            selectedActions={selectedActions}
            onActionToggle={handleActionToggle}
            onStatusUpdate={handleStatusUpdate}
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
