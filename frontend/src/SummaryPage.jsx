import React from 'react';
import { SummaryMetricsDashboard, AIWeeklyReport, TopContributorsCarousel, StatusIndicator } from './components';
import styled from 'styled-components';

const SummaryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionTitle = styled.h2`
  font-weight: 600;
  color: #333;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

function SummaryPage() {
  return (
    <SummaryContainer>
      <SectionTitle>
        Weekly Overview 
        <span style={{ marginLeft: '12px' }}>
          <StatusIndicator 
            status="on track" 
            lastUpdated="2025-06-14T12:00:00Z" 
            updatedBy="Alice Smith" 
          />
        </span>
      </SectionTitle>
      <Section>
        <AIWeeklyReport />
      </Section>

      <SectionTitle>
        Performance Metrics
        <span style={{ marginLeft: '12px' }}>
          <StatusIndicator 
            status="at risk" 
            lastUpdated="2025-06-13T15:30:00Z" 
            updatedBy="John Doe" 
          />
        </span>
      </SectionTitle>
      <Section>
        <SummaryMetricsDashboard />
      </Section>

      <SectionTitle>Top Contributors</SectionTitle>
      <Section>
        <TopContributorsCarousel />
      </Section>
    </SummaryContainer>
  );
}

export default SummaryPage;
