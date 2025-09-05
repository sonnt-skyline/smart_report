import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ReportSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ReportTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #444;
`;

const ReportContent = styled.div`
  line-height: 1.6;
  color: #555;
  white-space: pre-line;
`;

const GeneratedLabel = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #f0f7ff;
  color: #2c7be5;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-left: 10px;
  vertical-align: middle;
`;

const TimeStamp = styled.div`
  color: #999;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
`;

// Sample AI generated report data
const sampleReportData = {
  summary: `The team has made significant progress this week with 8 completed objectives and 12 actions resolved. Key achievements include finalizing the product roadmap for Q3 and completing the user authentication system refactoring.`,
  
  keyAchievements: `
• Successfully deployed v2.4.1 with 0 critical bugs
• Completed user authentication system refactoring (2 days ahead of schedule)
• Finalized Q3 product roadmap with stakeholder approval
• Improved test coverage from 76% to 85%`,

  challenges: `
• API integration delays with third-party payment processor
• Resource constraints in the design team affecting UI deliverables
• Technical debt in legacy code modules requiring more refactoring time than expected`,

  recommendations: `
1. Consider adding temporary design resources for the next 2 weeks
2. Schedule technical debt reduction sprints in Q3
3. Implement parallel testing environment for third-party integrations
4. Review velocity metrics and adjust upcoming sprint commitments accordingly`
};

function AIWeeklyReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to get AI-generated report
    setTimeout(() => {
      setReport(sampleReportData);
      setLoading(false);
    }, 800);
  }, []);
  
  if (loading) {
    return <div>Loading report...</div>;
  }
  
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Weekly Report Summary</h3>
        <GeneratedLabel>AI Generated</GeneratedLabel>
      </div>
      <TimeStamp>Generated on June 15, 2025</TimeStamp>
      
      <ReportSection>
        <ReportTitle>Summary</ReportTitle>
        <ReportContent>{report.summary}</ReportContent>
      </ReportSection>
      
      <ReportSection>
        <ReportTitle>Key Achievements</ReportTitle>
        <ReportContent>{report.keyAchievements}</ReportContent>
      </ReportSection>
      
      <ReportSection>
        <ReportTitle>Challenges</ReportTitle>
        <ReportContent>{report.challenges}</ReportContent>
      </ReportSection>
      
      <ReportSection>
        <ReportTitle>Recommendations</ReportTitle>
        <ReportContent>{report.recommendations}</ReportContent>
      </ReportSection>
    </div>
  );
}

export default AIWeeklyReport;
