import { useState } from 'react';

export default function ReportCompositionInterface({ reportData, onInputChange, onGenerateAISummary }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onGenerateAISummary();
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="report-composition-interface">
      <div className="report-section">
        <h3>Progress</h3>
        <p className="hint-text">Auto-filled from selected actions</p>
        <textarea
          value={reportData.progress}
          onChange={(e) => onInputChange('progress', e.target.value)}
          placeholder="Progress details will be auto-filled based on your selected actions"
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
      
      <div className="report-actions">
        <button 
          className="ai-summary-button"
          onClick={handleAIGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : '✨ Generate AI Summary'}
        </button>
        
        <button className="save-report-button">
          Save Report
        </button>
        
        <button className="export-report-button">
          Export Report
        </button>
      </div>
    </div>
  );
}
