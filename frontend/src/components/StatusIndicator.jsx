import React from 'react';
import PropTypes from 'prop-types';
import styles from './StatusIndicator.module.css';

const StatusIndicator = ({ status, lastUpdated, updatedBy }) => {
  // Status normalization
  const normalizedStatus = status.toLowerCase();
  
  // Determine the CSS class based on status
  const getStatusClass = () => {
    switch (normalizedStatus) {
      case 'on track':
      case 'on-going':
        return styles.onTrack;
      case 'at risk':
      case 'on hold':
        return styles.atRisk;
      case 'blocked':
      case 'off track':
        return styles.blocked;
      case 'completed':
        return styles.completed;
      case 'not started':
      default:
        return styles.notStarted;
    }
  };
  
  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <span className={`${styles.statusIndicator} ${getStatusClass()}`}>
      {status}
      {lastUpdated && (
        <span className={styles.tooltip}>
          Last updated: {formatDate(lastUpdated)}
          {updatedBy && <> by {updatedBy}</>}
        </span>
      )}
    </span>
  );
};

StatusIndicator.propTypes = {
  status: PropTypes.string.isRequired,
  lastUpdated: PropTypes.string,
  updatedBy: PropTypes.string
};

StatusIndicator.defaultProps = {
  lastUpdated: null,
  updatedBy: null
};

export default StatusIndicator;
