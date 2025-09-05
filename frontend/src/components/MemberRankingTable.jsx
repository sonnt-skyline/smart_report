import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUser, USER_ROLES } from '../context/UserContext';
import styled from 'styled-components';

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  -webkit-overflow-scrolling: touch; /* Smoother scrolling on iOS */
  box-sizing: border-box;

  @media (max-width: 576px) {
    margin-left: -0.75rem;
    margin-right: -0.75rem;
    width: calc(100% + 1.5rem);
    border-radius: 0;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 650px; /* Ensure table doesn't get too squished on mobile */
  border-collapse: collapse;
  font-size: 0.9rem;
  background-color: #ffffff;
  table-layout: auto; /* Better column sizing */

  @media (max-width: 768px) {
    font-size: 0.85rem;
    min-width: 600px;
  }

  @media (max-width: 576px) {
    font-size: 0.8rem;
    min-width: 100%; /* Full width on mobile */
  }
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  background-color: #f8f9fa;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  position: relative;
  cursor: ${props => props.sortable === 'true' ? 'pointer' : 'default'};
  white-space: nowrap;

  /* Align headers based on content type */
  text-align: ${props => {
    if (props.column === 'rank') return 'center';
    if (props.column === 'member') return 'left';
    if (props.column === 'score' || props.column === 'actions' ||
        props.column === 'impact' || props.column === 'percentile') return 'right';
    return 'left';
  }};

  @media (max-width: 768px) {
    padding: 10px 12px;
  }

  @media (max-width: 576px) {
    padding: 8px 10px;
  }

  &:hover {
    background-color: ${props => props.sortable === 'true' ? '#f1f3f5' : '#f8f9fa'};
  }

  &::after {
    content: '${props => props.sorted === 'asc' ? ' ▲' : props.sorted === 'desc' ? ' ▼' : ''}';
    font-size: 0.8em;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #e9ecef;
  }

  ${props => props.highlighted === 'true' && `
    background-color: rgba(130, 202, 157, 0.2) !important;
    font-weight: 600;
  `}

  ${props => props.obscured === 'true' && `
    filter: blur(3px);
    pointer-events: none;
    opacity: 0.7;
  `}
`;

const TableCell = styled.td`
  padding: 10px 15px;
  border-bottom: 1px solid #dee2e6;

  /* Match alignment with headers */
  text-align: ${props => {
    if (props.column === 'rank') return 'center';
    if (props.column === 'member') return 'left';
    if (props.column === 'score' || props.column === 'actions' ||
        props.column === 'impact' || props.column === 'percentile') return 'right';
    return 'left';
  }};

  @media (max-width: 768px) {
    padding: 8px 12px;
  }

  @media (max-width: 576px) {
    padding: 6px 8px;
  }
`;

const MemberAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    margin-right: 8px;
  }

  @media (max-width: 576px) {
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
`;

const RankBadge = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.rank === 1) return '#ffd700'; // gold
    if (props.rank === 2) return '#c0c0c0'; // silver
    if (props.rank === 3) return '#cd7f32'; // bronze
    return '#e0e0e0'; // others
  }};
  color: ${props => props.rank <= 3 ? '#333' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  margin-right: 10px;

  @media (max-width: 768px) {
    width: 22px;
    height: 22px;
    font-size: 0.75rem;
    margin-right: 8px;
  }

  @media (max-width: 576px) {
    width: 20px;
    height: 20px;
    font-size: 0.7rem;
    margin-right: 6px;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;

/**
 * MemberRankingTable component that displays a sortable table of team member rankings
 * with privacy features based on user role
 */
const MemberRankingTable = ({ members }) => {
  const { userRole } = useUser();
  const isManager = userRole === USER_ROLES.MANAGER;

  const [sortConfig, setSortConfig] = useState({
    key: 'rank',
    direction: 'asc'
  });

  // Handle column sort
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Apply sorting to members data
  const sortedMembers = [...members].sort((a, b) => {
    // Handle nested properties like scores.totalScore
    let aValue, bValue;

    if (sortConfig.key.includes('.')) {
      const [parent, child] = sortConfig.key.split('.');
      aValue = a[parent][child];
      bValue = b[parent][child];
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Find the current user in the members list
  const currentUser = members.find(member => member.isCurrentUser);
  const currentUserRank = currentUser?.rank || 0;

  // Determine which rows should be visible to non-managers
  const getRowVisibility = (member, index) => {
    if (isManager) {
      return { visible: true, obscured: false };
    }

    // If current user or top 3, show unobscured
    if (member.isCurrentUser || member.rank <= 3) {
      return { visible: true, obscured: false };
    }

    // Show members close to current user's rank (±2)
    if (Math.abs(member.rank - currentUserRank) <= 2) {
      return { visible: true, obscured: false };
    }

    // Show obscured versions of some other rows
    if (index % 3 === 0) {
      return { visible: true, obscured: true };
    }

    // Hide the rest
    return { visible: false, obscured: false };
  };

  // Track window width for responsive column display
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine which columns to display based on screen width
  const isLargeScreen = windowWidth > 992;
  const isMediumScreen = windowWidth > 768;
  const isSmallScreen = windowWidth > 576;

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader
              column="rank"
              sorted={sortConfig.key === 'rank' ? sortConfig.direction : null}
              sortable="true"
              onClick={() => handleSort('rank')}
            >
              Rank
            </TableHeader>
            <TableHeader column="member">
              Member
            </TableHeader>
            {isMediumScreen && (
              <TableHeader
                column="department"
                sorted={sortConfig.key === 'department' ? sortConfig.direction : null}
                sortable="true"
                onClick={() => handleSort('department')}
              >
                Dept
              </TableHeader>
            )}
            {isSmallScreen && (
              <TableHeader
                column="actions"
                sorted={sortConfig.key === 'scores.actionScore' ? sortConfig.direction : null}
                sortable="true"
                onClick={() => handleSort('scores.actionScore')}
              >
                Actions
              </TableHeader>
            )}
            {isLargeScreen && (
              <TableHeader
                column="impact"
                sorted={sortConfig.key === 'scores.impactScore' ? sortConfig.direction : null}
                sortable="true"
                onClick={() => handleSort('scores.impactScore')}
              >
                Impact
              </TableHeader>
            )}
            <TableHeader
              column="score"
              sorted={sortConfig.key === 'scores.totalScore' ? sortConfig.direction : null}
              sortable="true"
              onClick={() => handleSort('scores.totalScore')}
            >
              Score
            </TableHeader>
            {isSmallScreen && (
              <TableHeader
                column="percentile"
                sorted={sortConfig.key === 'percentile' ? sortConfig.direction : null}
                sortable="true"
                onClick={() => handleSort('percentile')}
              >
                %ile
              </TableHeader>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedMembers.length === 0 ? (
            <tr>
              <TableCell colSpan={isLargeScreen ? 7 : (isMediumScreen ? 6 : (isSmallScreen ? 5 : 3))}>
                <NoDataMessage>No member data available</NoDataMessage>
              </TableCell>
            </tr>
          ) : (
            sortedMembers.map((member, index) => {
              const { visible, obscured } = getRowVisibility(member, index);

              if (!visible) return null;

              return (
                <TableRow
                  key={member.id}
                  highlighted={member.isCurrentUser ? 'true' : 'false'}
                  obscured={obscured ? 'true' : 'false'}
                >
                  <TableCell column="rank">
                    <RankBadge rank={member.rank}>{member.rank}</RankBadge>
                  </TableCell>
                  <TableCell column="member">
                    <MemberInfo>
                      <MemberAvatar src={member.avatarUrl} alt={`${member.name}'s avatar`} />
                      {member.name.split(' ')[0]} {member.isCurrentUser && '(You)'}
                    </MemberInfo>
                  </TableCell>
                  {isMediumScreen && (
                    <TableCell column="department">{member.department}</TableCell>
                  )}
                  {isSmallScreen && (
                    <TableCell column="actions">{member.scores.actionScore}</TableCell>
                  )}
                  {isLargeScreen && (
                    <TableCell column="impact">{member.scores.impactScore}</TableCell>
                  )}
                  <TableCell column="score">{member.scores.totalScore}</TableCell>
                  {isSmallScreen && (
                    <TableCell column="percentile">{member.percentile}%</TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

MemberRankingTable.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isCurrentUser: PropTypes.bool.isRequired,
      avatarUrl: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      rank: PropTypes.number.isRequired,
      percentile: PropTypes.number.isRequired,
      scores: PropTypes.shape({
        actionScore: PropTypes.number.isRequired,
        impactScore: PropTypes.number.isRequired,
        totalScore: PropTypes.number.isRequired
      }).isRequired
    })
  ).isRequired
};

export default MemberRankingTable;
