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

  // Filter actions for the current user
  useEffect(() => {
    // Filter actions for this member
    const memberActions = sampleActions.filter(action => action.member === member);
    
    // For a real app, you'd want to track which actions were updated this week
    const updatedActions = memberActions.filter(action => {
      return action.statusUpdates.some(update => update.week === currentWeek);
    });
    
    setActionsWithUpdates(updatedActions);
    // Initialize selected actions with all updated actions
    setSelectedActions(updatedActions.map(action => action.id));
  }, [member, currentWeek]);

  // Generate progress text automatically based on selected actions
  useEffect(() => {
    if (selectedActions.length === 0) {
      setReportData(prev => ({ ...prev, progress: '' }));
      return;
    }

    // Generate progress summary based on selected actions
    const progressLines = selectedActions.map(actionId => {
      const action = actionsWithUpdates.find(a => a.id === actionId);
      if (!action) return '';
      
      const update = action.statusUpdates.find(update => update.week === currentWeek);
      if (!update) return '';
      
      return `- ${action.title}: ${update.progress}% complete, status: ${update.workStatus}`;
    }).filter(line => line !== '');

    setReportData(prev => ({ 
      ...prev, 
      progress: progressLines.join('\n') 
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
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      } else {
        return [...prev, actionId];
      }
    });
  };

  const generateAISummary = () => {
    // In a real app, this would call an API with the selected actions
    // For now, we'll simulate a simple AI summary
    const aiSummary = {
      progress: "Made significant progress on delivery milestones and self-development goals. Completed 3 key tasks, with 2 tasks ongoing at 50% completion.",
      blockers: "Delayed response from client regarding project specifications.",
      nextSteps: "Schedule follow-up meeting with client, complete React course modules, and prepare for milestone 2."
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
