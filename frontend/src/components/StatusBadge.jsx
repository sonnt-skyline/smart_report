import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Status colors mapping
const STATUS_COLORS = {
  'not started': '#d9d9d9',
  'on track': '#52c41a',
  'at risk': '#faad14',
  'off track': '#ff4d4f',
  'completed': '#1890ff',
  // Legacy status mappings for compatibility
  'On-going': '#52c41a',
  'Blocked': '#ff4d4f',
  'On hold': '#faad14',
  'Completed': '#1890ff',
  'Not started': '#d9d9d9'
};

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${props => STATUS_COLORS[props.status.toLowerCase()] || '#888'};
  color: ${props =>
    ['not started', 'Not started'].includes(props.status) ? '#666' : '#fff'
  };
`;

const StatusBadge = ({ status }) => {
  return (
    <Badge status={status}>
      {status}
    </Badge>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};

export default StatusBadge;
