import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrashAlt, FaPlus, FaSortAmountDown, FaSortAmountUpAlt, FaSearch, FaEye, FaExclamationCircle, FaStar } from 'react-icons/fa';
import StatusBadge from './StatusBadge';
import { useObjectives } from '../context/ObjectiveContext';
import PropTypes from 'prop-types';

const TableContainer = styled.div`
  margin-bottom: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const TableTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
`;

const TableControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f9f9f9;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 0.9rem;
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 0.5rem;
  margin-left: auto;
  
  input {
    padding: 0.4rem;
    border: none;
    outline: none;
    font-size: 0.9rem;
    min-width: 200px;
  }
  
  svg {
    color: #888;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  thead th {
    background-color: #f9f9f9;
    font-weight: 500;
    position: relative;
    cursor: pointer;
    
    &:hover {
      background-color: #f1f1f1;
    }
  }
  
  tbody tr:hover {
    background-color: #f9f9f9;
  }
`;

const SortIcon = styled.span`
  margin-left: 5px;
  display: inline-flex;
  align-items: center;
`;

const ActionColumn = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled(({ primary, ...rest }) => <button {...rest} />)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.primary ? '#0088cc' : '#ddd'};
  background-color: ${props => props.primary ? '#0088cc' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#333'};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.primary ? '#0077b3' : '#f1f1f1'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const IconButton = styled(({ danger, ...rest }) => <button {...rest} />)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid ${props => props.danger ? '#ff4d4f' : '#ddd'};
  background-color: ${props => props.danger ? '#fff1f0' : '#fff'};
  color: ${props => props.danger ? '#ff4d4f' : '#666'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.danger ? '#ffa39e' : '#f1f1f1'};
    border-color: ${props => props.danger ? '#ff7875' : '#bbb'};
  }
`;

const Owner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OwnerInitials = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e1e1e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 500;
`;

const ProgressCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  
  div {
    height: 100%;
    background-color: ${props => {
      if (props.value >= 75) return '#52c41a';
      if (props.value >= 50) return '#1890ff';
      if (props.value >= 25) return '#faad14';
      return '#ff4d4f';
    }};
    width: ${props => props.value}%;
    transition: width 0.3s ease;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #888;
  
  h3 {
    margin: 0.5rem 0;
  }
  
  p {
    margin: 0 0 1rem;
  }
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-top: 1px solid #eee;
`;

const PageInfo = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const PriorityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PriorityLabels = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const PriorityIndicator = styled(({ isUrgent, isImportant, ...rest }) => <div {...rest} />)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: ${props => props.isUrgent ? '#fff2e8' : props.isImportant ? '#f6ffed' : '#f9f0ff'};
  color: ${props => props.isUrgent ? '#fa541c' : props.isImportant ? '#52c41a' : '#722ed1'};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const PriorityMatrix = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 80px;
  height: 40px;
  border: 1px solid #d9d9d9;
  overflow: hidden;
  border-radius: 2px;
  margin-top: 0.25rem;
`;

const MatrixQuadrant = styled(({ isActive, quadrant, ...rest }) => <div {...rest} />)`
  background-color: ${props => {
    if (props.isActive) {
      if (props.quadrant === 'urgent-important') return '#ff4d4f';
      if (props.quadrant === 'urgent-not-important') return '#faad14';
      if (props.quadrant === 'not-urgent-important') return '#52c41a';
      if (props.quadrant === 'not-urgent-not-important') return '#d9d9d9';
    }
    return '#f5f5f5';
  }};
  border: 1px solid ${props => props.isActive ? 'transparent' : '#eee'};
  opacity: ${props => props.isActive ? 1 : 0.5};
`;

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

const ObjectivesTable = ({ onEditObjective, onCreateObjective, onViewObjective }) => {
  const { objectives, deleteObjective } = useObjectives();
  const [sortField, setSortField] = useState('deadline');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    owner: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Get unique status options
  const statusOptions = useMemo(() => {
    const statuses = new Set();
    objectives.forEach(obj => statuses.add(obj.status));
    return Array.from(statuses);
  }, [objectives]);
  
  // Get unique owners/assignees
  const ownerOptions = useMemo(() => {
    const owners = new Set();
    objectives.forEach(obj => owners.add(obj.assignedTo));
    return Array.from(owners);
  }, [objectives]);
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Apply filters and sorting
  const filteredAndSortedObjectives = useMemo(() => {
    return objectives
      .filter(objective => {
        // Apply text search
        if (searchQuery && 
            !objective.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !objective.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Apply select filters
        if (filters.status && objective.status !== filters.status) {
          return false;
        }
        
        if (filters.priority && objective.quadrant !== filters.priority) {
          return false;
        }
        
        if (filters.owner && objective.assignedTo !== filters.owner) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Handle sorting
        let comparison = 0;
        switch (sortField) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
          case 'priority':
            comparison = a.quadrant.localeCompare(b.quadrant);
            break;
          case 'progress':
            comparison = a.progress - b.progress;
            break;
          case 'deadline':
            comparison = new Date(a.deadline) - new Date(b.deadline);
            break;
          case 'owner':
            comparison = a.assignedTo?.localeCompare(b.assignedTo || '');
            break;
          default:
            comparison = 0;
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [objectives, filters, sortField, sortDirection, searchQuery]);
  
  // Pagination
  const totalPages = Math.ceil(filteredAndSortedObjectives.length / itemsPerPage);
  const paginatedObjectives = filteredAndSortedObjectives.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>Objectives</TableTitle>
        <TableControls>
          <Button primary onClick={onCreateObjective}>
            <FaPlus /> New Objective
          </Button>
        </TableControls>
      </TableHeader>
      
      <FilterContainer>
        <FilterLabel>Status:</FilterLabel>
        <Select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </Select>
        
        <FilterLabel>Priority:</FilterLabel>
        <Select name="priority" value={filters.priority} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="urgent-important">Urgent & Important</option>
          <option value="urgent-not-important">Urgent, Not Important</option>
          <option value="not-urgent-important">Important, Not Urgent</option>
          <option value="not-urgent-not-important">Not Urgent, Not Important</option>
        </Select>
        
        <FilterLabel>Owner:</FilterLabel>
        <Select name="owner" value={filters.owner} onChange={handleFilterChange}>
          <option value="">All</option>
          {ownerOptions.map(owner => (
            <option key={owner} value={owner}>{owner}</option>
          ))}
        </Select>
        
        <SearchInput>
          <FaSearch />
          <input 
            type="text"
            placeholder="Search objectives..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchInput>
      </FilterContainer>
      
      {filteredAndSortedObjectives.length > 0 ? (
        <>
          <StyledTable>
            <thead>
              <tr>
                <th onClick={() => handleSort('title')}>
                  Title
                  {sortField === 'title' && (
                    <SortIcon>
                      {sortDirection === 'asc' ? <FaSortAmountDown size={12} /> : <FaSortAmountUpAlt size={12} />}
                    </SortIcon>
                  )}
                </th>
                <th onClick={() => handleSort('status')}>
                  Status
                  {sortField === 'status' && (
                    <SortIcon>
                      {sortDirection === 'asc' ? <FaSortAmountDown size={12} /> : <FaSortAmountUpAlt size={12} />}
                    </SortIcon>
                  )}
                </th>
                <th onClick={() => handleSort('priority')}>
                  Priority
                  {sortField === 'priority' && (
                    <SortIcon>
                      {sortDirection === 'asc' ? <FaSortAmountDown size={12} /> : <FaSortAmountUpAlt size={12} />}
                    </SortIcon>
                  )}
                </th>
                <th onClick={() => handleSort('progress')}>
                  Progress
                  {sortField === 'progress' && (
                    <SortIcon>
                      {sortDirection === 'asc' ? <FaSortAmountDown size={12} /> : <FaSortAmountUpAlt size={12} />}
                    </SortIcon>
                  )}
                </th>
                <th onClick={() => handleSort('deadline')}>
                  Deadline
                  {sortField === 'deadline' && (
                    <SortIcon>
                      {sortDirection === 'asc' ? <FaSortAmountDown size={12} /> : <FaSortAmountUpAlt size={12} />}
                    </SortIcon>
                  )}
                </th>
                <th onClick={() => handleSort('owner')}>
                  Owner
                  {sortField === 'owner' && (
                    <SortIcon>
                      {sortDirection === 'asc' ? <FaSortAmountDown size={12} /> : <FaSortAmountUpAlt size={12} />}
                    </SortIcon>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedObjectives.map(objective => (
                <tr key={objective.id}>
                  <td>{objective.title}</td>
                  <td>
                    <StatusBadge status={objective.status} />
                  </td>
                  <td>
                    <PriorityContainer>
                      <PriorityLabels>
                        {objective.quadrant.includes('urgent') && (
                          <PriorityIndicator isUrgent>
                            <FaExclamationCircle /> Urgent
                          </PriorityIndicator>
                        )}
                        {objective.quadrant.includes('important') && !objective.quadrant.includes('not-important') && (
                          <PriorityIndicator isImportant>
                            <FaStar /> Important
                          </PriorityIndicator>
                        )}
                      </PriorityLabels>
                      <PriorityMatrix>
                        <MatrixQuadrant 
                          quadrant="urgent-important"
                          isActive={objective.quadrant === 'urgent-important'} 
                        />
                        <MatrixQuadrant 
                          quadrant="not-urgent-important"
                          isActive={objective.quadrant === 'not-urgent-important'} 
                        />
                        <MatrixQuadrant 
                          quadrant="urgent-not-important"
                          isActive={objective.quadrant === 'urgent-not-important'} 
                        />
                        <MatrixQuadrant 
                          quadrant="not-urgent-not-important"
                          isActive={objective.quadrant === 'not-urgent-not-important'} 
                        />
                      </PriorityMatrix>
                    </PriorityContainer>
                  </td>
                  <td>
                    <ProgressCell>
                      <span>{objective.progress}%</span>
                      <ProgressBar value={objective.progress}>
                        <div />
                      </ProgressBar>
                    </ProgressCell>
                  </td>
                  <td>{formatDate(objective.deadline)}</td>
                  <td>
                    <Owner>
                      <OwnerInitials>{getInitials(objective.assignedTo)}</OwnerInitials>
                      <span>{objective.assignedTo}</span>
                    </Owner>
                  </td>
                  <td>
                    <ActionColumn>
                      <IconButton onClick={() => onViewObjective(objective)} title="View details">
                        <FaEye />
                      </IconButton>
                      <IconButton onClick={() => onEditObjective(objective)} title="Edit">
                        <FaEdit />
                      </IconButton>
                      <IconButton danger onClick={() => deleteObjective(objective.id)} title="Delete">
                        <FaTrashAlt />
                      </IconButton>
                    </ActionColumn>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
          
          <Pagination>
            <PageInfo>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedObjectives.length)} of {filteredAndSortedObjectives.length} objectives
            </PageInfo>
            <PaginationButtons>
              <Button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </PaginationButtons>
          </Pagination>
        </>
      ) : (
        <EmptyState>
          <h3>No objectives found</h3>
          <p>Try adjusting your filters or create a new objective</p>
          <Button primary onClick={onCreateObjective}>
            <FaPlus /> New Objective
          </Button>
        </EmptyState>
      )}
    </TableContainer>
  );
};

ObjectivesTable.propTypes = {
  onEditObjective: PropTypes.func.isRequired,
  onCreateObjective: PropTypes.func.isRequired,
  onViewObjective: PropTypes.func.isRequired
};

export default ObjectivesTable;
