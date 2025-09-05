import React from 'react';
import PropTypes from 'prop-types';
import { 
  FcApproval, 
  FcHighPriority, 
  FcClock, 
  FcCancel 
} from 'react-icons/fc';
import styled from 'styled-components';

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatusCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const StatusTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const ProgressBarContainer = styled.div`
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  margin: 0.75rem 0;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.value}%;
  background-color: ${props => props.color};
  transition: width 0.3s ease;
`;

const StatusFooter = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: auto;
`;

function getStatusIcon(status) {
  switch(status) {
    case 'completed':
      return <FcApproval size={20} />;
    case 'at risk':
      return <FcHighPriority size={20} />;
    case 'behind':
      return <FcClock size={20} />;
    case 'off track':
      return <FcCancel size={20} />;
    default:
      return <FcApproval size={20} />;
  }
}

function getStatusColor(status) {
  switch(status) {
    case 'completed':
      return '#40c057';
    case 'on track':
      return '#339af0';
    case 'at risk':
      return '#fd7e14';
    case 'behind':
    case 'off track':
      return '#fa5252';
    default:
      return '#adb5bd';
  }
}

const StatusIndicators = ({ statuses }) => {
  return (
    <StatusGrid>
      {statuses.map((status, index) => (
        <StatusCard key={index}>
          <StatusHeader>
            <StatusTitle>
              {getStatusIcon(status.status)} {status.label}
            </StatusTitle>
            <StatusValue>{status.value}{status.unit}</StatusValue>
          </StatusHeader>
          <ProgressBarContainer>
            <Progress 
              value={(status.current / status.total) * 100} 
              color={getStatusColor(status.status)} 
            />
          </ProgressBarContainer>
          <StatusFooter>
            {status.current} of {status.total} {status.description}
          </StatusFooter>
        </StatusCard>
      ))}
    </StatusGrid>
  );
};

StatusIndicators.propTypes = {
  statuses: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      unit: PropTypes.string,
      current: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default StatusIndicators;
