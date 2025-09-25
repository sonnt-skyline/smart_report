import { useState } from 'react';
import { weeklyReportAPI } from '../utils/api';

export default function ReportCompositionInterface({ 
  reportData, 
  onInputChange, 
  onGenerateAISummary, 
  currentWeek, 
  allActions,
  onReportSubmitted // Add this prop to handle post-submission actions
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const handleAIGenerate = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onGenerateAISummary();
      setIsGenerating(false);
    }, 1500);
  };

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const reportDataToSubmit = {
        week: currentWeek,
        progress_notes: reportData.progress,
        blockers_notes: reportData.blockers,
        next_steps_notes: reportData.nextSteps,
        additional_notes: reportData.additionalNotes || '',
        actions: (allActions || [])
          .filter(action => {
            // Only include actions that have updates for the current week
            const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
            return currentUpdate !== undefined;
          })
          .map(action => {
            // Find the status update for the current week
            const currentUpdate = action.statusUpdates.find(update => update.week === currentWeek);
            
            return {
              action_id: action.id,
              progress: currentUpdate.progress,
              work_status: currentUpdate.workStatus
            };
          })
      };

      console.log('Submitting report with actions:', reportDataToSubmit.actions);
      console.log(`Total actions being submitted: ${reportDataToSubmit.actions.length} out of ${allActions.length} total actions`);

      const result = await weeklyReportAPI.submitWeeklyReport(reportDataToSubmit);
      
      setSubmitStatus('success');
      console.log('Weekly report submitted successfully:', result);
      
      // Notify parent component that report was submitted successfully
      if (onReportSubmitted) {
        onReportSubmitted(result);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
      
    } catch (error) {
      console.error('Failed to submit weekly report:', error);
      setSubmitStatus('error');
      
      // Clear error message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-composition-interface">
      <div className="composition-instructions">
        <p className="instruction-text">
          <strong>Note:</strong> This composer is independent of action selection. 
          You can directly input or edit content here, or use AI to generate a summary.
        </p>
      </div>
      
      <div className="report-section">
        <h3>Progress</h3>
        <p className="hint-text">Describe your progress this week</p>
        <textarea
          value={reportData.progress}
          onChange={(e) => onInputChange('progress', e.target.value)}
          placeholder="Describe what you accomplished this week, key milestones reached, and progress made on your objectives..."
          rows={6}
          className="report-textarea progress-textarea"
        />
      </div>
      
      <div className="report-section">
        <h3>Blockers</h3>
        <textarea
          value={reportData.blockers}
          onChange={(e) => onInputChange('blockers', e.target.value)}
          placeholder="Describe any blockers or issues that affected your work this week..."
          rows={4}
          className="report-textarea blockers-textarea"
        />
      </div>
      
      <div className="report-section">
        <h3>Next Steps</h3>
        <textarea
          value={reportData.nextSteps}
          onChange={(e) => onInputChange('nextSteps', e.target.value)}
          placeholder="Outline your planned next steps for the coming week..."
          rows={4}
          className="report-textarea next-steps-textarea"
        />
      </div>

      <div className="report-section">
        <h3>Additional Notes</h3>
        <p className="hint-text">Any additional comments or notes</p>
        <textarea
          value={reportData.additionalNotes || ''}
          onChange={(e) => onInputChange('additionalNotes', e.target.value)}
          placeholder="Add any additional notes, comments, or context for this week's report..."
          rows={3}
          className="report-textarea additional-notes-textarea"
        />
      </div>
      
      {/* Submit Status Messages */}
      {submitStatus === 'success' && (
        <div className="submit-status success">
          ✅ Weekly report submitted successfully!
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="submit-status error">
          ❌ Failed to submit report. Please try again.
        </div>
      )}
      
      <div className="report-actions">
        <button 
          className="ai-summary-button"
          onClick={handleAIGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : '✨ Generate Summary'}
        </button>
        
        <button 
          className="submit-report-button"
          onClick={handleSubmitReport}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : '📤 Submit Report'}
        </button>
        
        <button className="save-report-button">
          💾 Save Draft
        </button>
        
        <button className="export-report-button">
          📄 Export Report
        </button>
      </div>
    </div>
  );
}
