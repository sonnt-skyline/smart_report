import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUser } from './context/UserContext';
import RadialComparisonChart from './components/RadialComparisonChart';
import MemberRankingTable from './components/MemberRankingTable';
import { generateTeamMembersData } from './data/memberRankingData';
import { calculateContributionScore, calculateTeamAverages, calculateMemberPercentiles } from './utils/contributionScores';

const PageContainer = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 576px) {
    padding: 0.5rem;
    max-width: none; /* Remove max-width on mobile to use full screen width */
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 576px) {
    margin-bottom: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 576px) {
    font-size: 1.3rem;
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 576px) {
    gap: 1rem;
    margin-left: -0.25rem;
    margin-right: -0.25rem;
    width: calc(100% + 0.5rem); /* Extend slightly beyond parent padding */
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 576px) {
    padding: 0.75rem;
    border-radius: 6px;
    margin-left: -0.25rem;
    margin-right: -0.25rem;
    width: calc(100% + 0.5rem); /* Extend slightly beyond parent padding */
  }
`;

const MetricCard = styled.div`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 1rem;
  text-align: center;
  width: 100%;
  box-sizing: border-box;

  &.rank-bg {
    background-color: #f8f9ff;
  }

  &.score-bg {
    background-color: #f6fff8;
  }

  &.percentile-bg {
    background-color: #fff8f8;
  }

  &.actions-bg {
    background-color: #fffaf0;
  }

  @media (max-width: 576px) {
    padding: 0.75rem 0.5rem;
    border-radius: 6px;
  }
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.color || '#333'};
  margin: 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 576px) {
    font-size: 1.8rem;
  }
`;

const MetricLabel = styled.div`
  font-size: 1rem;
  color: #666;

  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-top: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 576px) {
    font-size: 1.2rem;
    margin-top: 0;
    margin-bottom: 0.75rem;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  @media (max-width: 576px) {
    gap: 0.5rem;
    margin-left: -0.25rem;
    margin-right: -0.25rem;
    width: calc(100% + 0.5rem); /* Extend slightly beyond parent padding */
  }
`;

const MemberRankingPage = () => {
  const { userRole, isManager } = useUser();
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [teamAverage, setTeamAverage] = useState({
    actionScore: 0,
    impactScore: 0,
    totalScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate mock data for team members
    const mockTeamData = generateTeamMembersData(12, 'user-101');

    // Process the data with our utility functions
    const rankedMembers = calculateMemberPercentiles(mockTeamData);
    const teamAvg = calculateTeamAverages(mockTeamData);

    setMembers(rankedMembers);
    setTeamAverage(teamAvg);
    setCurrentUser(rankedMembers.find(member => member.isCurrentUser));
    setLoading(false);
  }, []);

  if (loading || !currentUser) {
    return <div>Loading member rankings...</div>;
  }

  return (
    <PageContainer>
      <Header>
        <Title>Member Ranking & Contributions</Title>
      </Header>

      <MetricsGrid>
        <MetricCard className="rank-bg">
          <MetricLabel>Your Rank</MetricLabel>
          <MetricValue color="#4361ee">#{currentUser.rank}</MetricValue>
        </MetricCard>

        <MetricCard className="score-bg">
          <MetricLabel>Contribution Score</MetricLabel>
          <MetricValue color="#2a9d8f">{currentUser.scores.totalScore}</MetricValue>
        </MetricCard>

        <MetricCard className="percentile-bg">
          <MetricLabel>Team Percentile</MetricLabel>
          <MetricValue color="#e63946">{currentUser.percentile}%</MetricValue>
        </MetricCard>

        <MetricCard className="actions-bg">
          <MetricLabel>Completed Actions</MetricLabel>
          <MetricValue color="#f77f00">{currentUser.completedActions.count}</MetricValue>
        </MetricCard>
      </MetricsGrid>

      <ChartsContainer>
        <Card>
          <RadialComparisonChart
            userData={currentUser}
            teamAverage={teamAverage}
            title="Your Contribution vs. Team Average"
          />
        </Card>
      </ChartsContainer>

      <Card>
        <SectionTitle>Team Rankings</SectionTitle>
        {!isManager && (
          <p style={{
            fontSize: '0.8rem',
            margin: '0 0 0.75rem',
            color: '#666'
          }}>Note: As a team member, you can see the top performers and members with rankings close to yours.</p>
        )}
        <MemberRankingTable members={members} />
      </Card>
    </PageContainer>
  );
};

export default MemberRankingPage;
