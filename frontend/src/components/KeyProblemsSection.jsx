import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FcHighPriority, FcMediumPriority, FcLowPriority } from 'react-icons/fc';
import styled from 'styled-components';
import { fetchKeyProblems } from '../data/dashboardData';
import { useUser } from '../context/UserContext';

const ProblemContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background-color: #fff;
  margin-bottom: 2rem;
`;

const ProblemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  margin: 0;
`;

const RefreshButton = styled.button`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;

  &:hover {
    background-color: #e9ecef;
  }
`;

const ProblemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProblemItem = styled.div`
  border-left: 4px solid ${props => props.color};
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const ProblemTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProblemDescription = styled.p`
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-size: 0.9rem;
`;

const ProblemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6c757d;
`;

// Create a functional component to handle the color props
const StatusBadge = ({ bgColor, textColor, children, ...rest }) => {
  const badgeStyle = {
    backgroundColor: bgColor,
    color: textColor
  };
  
  return (
    <StyledStatusBadge style={badgeStyle} {...rest}>
      {children}
    </StyledStatusBadge>
  );
};

const StyledStatusBadge = styled.span`
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const KeyProblemsSection = () => {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userRole, isManager } = useUser();

  const loadProblems = async () => {
    setIsLoading(true);
    try {
      const data = await fetchKeyProblems();
      setProblems(data);
    } catch (error) {
      console.error('Failed to fetch key problems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
    
    // Set up auto-refresh every 5 minutes
    const intervalId = setInterval(loadProblems, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'high':
        return <FcHighPriority size={18} />;
      case 'medium':
        return <FcMediumPriority size={18} />;
      default:
        return <FcLowPriority size={18} />;
    }
  };

  const getStatusBadgeProps = (status) => {
    switch(status) {
      case 'unresolved':
        return { bgColor: '#ffdeeb', textColor: '#c2255c' };
      case 'in-progress':
        return { bgColor: '#e3fafc', textColor: '#0c8599' };
      case 'resolved':
        return { bgColor: '#ebfbee', textColor: '#2b8a3e' };
      default:
        return { bgColor: '#f8f9fa', textColor: '#495057' };
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high':
        return '#fa5252';
      case 'medium':
        return '#fd7e14';
      default:
        return '#74b816';
    }
  };

  return (
    <ProblemContainer>
      <ProblemHeader>
        <Title>Key Problems</Title>
        <RefreshButton onClick={loadProblems} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </RefreshButton>
      </ProblemHeader>
      
      {problems.length === 0 && !isLoading && (
        <p>No key problems found. Great job!</p>
      )}

      <ProblemList>
        {problems.map(problem => {
          const statusProps = getStatusBadgeProps(problem.status);
          return (
            <ProblemItem key={problem.id} color={getSeverityColor(problem.severity)}>
              <ProblemTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getSeverityIcon(problem.severity)} {problem.title}
                </div>
                <StatusBadge 
                  bgColor={statusProps.bgColor} 
                  textColor={statusProps.textColor}
                >
                  {problem.status}
                </StatusBadge>
              </ProblemTitle>
              <ProblemDescription>{problem.description}</ProblemDescription>
              <ProblemMeta>
                <span>Updated: {new Date(problem.updatedAt).toLocaleDateString()}</span>
                {isManager && (
                  <span>Assigned to: {problem.assignedTo}</span>
                )}
              </ProblemMeta>
            </ProblemItem>
          );
        })}
      </ProblemList>
    </ProblemContainer>
  );
};

export default KeyProblemsSection;
