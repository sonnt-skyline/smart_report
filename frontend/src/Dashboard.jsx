import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { FaChartPie, FaExchangeAlt, FaFilter, FaTasks, FaEye, FaListUl } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PriorityMatrix from './components/PriorityMatrix';
import StatusIndicators from './components/StatusIndicators';
import KeyProblemsSection from './components/KeyProblemsSection';
import AdvancedFilters from './components/AdvancedFilters';
import UserPreferencesPanel from './components/UserPreferencesPanel';
import DashboardCharts from './components/DashboardCharts';
const { ObjectiveProgressChart, StatusDistributionChart, QuadrantDistributionChart } = DashboardCharts;
import {
  objectives,
  actions,
  sortByDeadline,
  sortByPriority,
  sortByProgress,
  QUADRANTS
} from './data/dashboardData';
import { chartData } from './data/chartData';
import { UserProvider, useUser, USER_ROLES } from './context/UserContext';
import { UserPreferencesProvider, useUserPreferences } from './context/UserPreferencesContext';

// Styled Components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const DashboardTitle = styled.h1`
  margin: 0;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const ObjectivesButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #0088cc;
  color: white;
  border-radius: 4px;
  border: none;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0077b3;
  }
`;

// Create a functional component to handle the active prop
const Button = ({ active, children, ...rest }) => {
  const buttonStyle = {
    backgroundColor: active ? '#339af0' : '#f8f9fa',
    color: active ? '#fff' : '#212529',
  };

  return (
    <StyledButton style={buttonStyle} {...rest}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? '#1971c2' : '#e9ecef'};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  overflow: hidden;
`;

// Create a functional component to handle the active prop
const ViewButton = ({ active, children, ...rest }) => {
  // Use CSS custom properties (variables) to handle the active state
  const buttonStyle = {
    '--bg-color': active ? '#339af0' : '#fff',
    '--text-color': active ? '#fff' : '#212529',
    '--hover-bg-color': active ? '#1971c2' : '#f8f9fa'
  };

  return (
    <StyledViewButton style={buttonStyle} {...rest}>
      {children}
    </StyledViewButton>
  );
};

const StyledViewButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  border: none;
  cursor: pointer;

  &:not(:last-child) {
    border-right: 1px solid #dee2e6;
  }

  &:hover {
    background-color: var(--hover-bg-color);
  }
`;

const RoleToggle = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RoleLabel = styled.span`
  font-weight: 500;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Helper function to extract all unique tags from items
function extractAllTags(items) {
  const tagsSet = new Set();

  items.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => tagsSet.add(tag));
    }
  });

  return Array.from(tagsSet);
}

// Helper function to format quadrant names
function formatQuadrantName(quadrantId) {
  switch(quadrantId) {
    case QUADRANTS.URGENT_IMPORTANT:
      return 'Urgent & Important';
    case QUADRANTS.URGENT_NOT_IMPORTANT:
      return 'Urgent, Not Important';
    case QUADRANTS.NOT_URGENT_IMPORTANT:
      return 'Important, Not Urgent';
    case QUADRANTS.NOT_URGENT_NOT_IMPORTANT:
      return 'Not Urgent, Not Important';
    default:
      return quadrantId;
  }
}

// Main Dashboard Component
function DashboardContent() {
  const [matrixItems, setMatrixItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const { userRole, setUserRole, isManager } = useUser();
  const { preferences } = useUserPreferences();

  // Use preferences for initial state values
  const [viewMode, setViewMode] = useState(preferences.defaultView);
  const [sortMode, setSortMode] = useState(preferences.sortBy);

  // Create statuses array from both objectives and actions
  const statusOptions = useMemo(() => {
    const statusSet = new Set();
    [...objectives, ...actions].forEach(item => {
      statusSet.add(item.status);
    });
    return Array.from(statusSet);
  }, []);

  // Get all unique tags
  const allTags = useMemo(() => {
    return extractAllTags([...objectives, ...actions]);
  }, []);

  // Format quadrant names for display
  const quadrantOptions = useMemo(() => {
    const options = {};
    Object.entries(QUADRANTS).forEach(([_, value]) => {
      options[value] = formatQuadrantName(value);
    });
    return options;
  }, []);

  // Status indicators data
  const [statusIndicators, setStatusIndicators] = useState([
    {
      label: 'Objectives',
      value: '65',
      unit: '%',
      current: 13,
      total: 20,
      status: 'on track',
      description: 'objectives on track'
    },
    {
      label: 'Actions',
      value: '48',
      unit: '%',
      current: 24,
      total: 50,
      status: 'at risk',
      description: 'actions completed'
    },
    {
      label: 'Deadlines',
      value: '3',
      unit: '',
      current: 3,
      total: 5,
      status: 'behind',
      description: 'deadlines approaching'
    },
    {
      label: 'Team Members',
      value: '5/6',
      unit: '',
      current: 5,
      total: 6,
      status: 'completed',
      description: 'team members on track'
    }
  ]);

  // Apply filters to items
  const applyFilters = (items) => {
    return items.filter(item => {
      // Filter by search text
      if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase()) &&
         (!item.description || !item.description.toLowerCase().includes(filters.search.toLowerCase()))) {
        return false;
      }

      // Filter by status
      if (filters.status && item.status !== filters.status) {
        return false;
      }

      // Filter by quadrant
      if (filters.quadrant && item.quadrant !== filters.quadrant) {
        return false;
      }

      // Filter by progress range
      if (filters.progressMin && item.progress < parseInt(filters.progressMin)) {
        return false;
      }
      if (filters.progressMax && item.progress > parseInt(filters.progressMax)) {
        return false;
      }

      // Filter by tags
      if (filters.tags && filters.tags.length > 0) {
        // Check if item has at least one of the selected tags
        if (!item.tags || !filters.tags.some(tag => item.tags.includes(tag))) {
          return false;
        }
      }

      // Don't show completed items if user preference is set to hide them
      if (!preferences.showCompletedItems && item.status === 'completed') {
        return false;
      }

      return true;
    });
  };

  // Generate matrix items based on view mode and apply filters
  useEffect(() => {
    let items = viewMode === 'objectives' ? [...objectives] : [...actions];

    // Apply filters
    items = applyFilters(items);

    // Apply sorting
    switch(sortMode) {
      case 'priority':
        items = sortByPriority(items);
        break;
      case 'deadline':
        items = sortByDeadline(items);
        break;
      case 'progress':
        items = sortByProgress(items);
        break;
      default:
        items = sortByPriority(items);
    }

    setMatrixItems(items);
  }, [viewMode, sortMode, filters, preferences.showCompletedItems]);

  // Handle drag end event from priority matrix
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Return if dropped outside a droppable area or in the same position
    if (!destination ||
        (destination.droppableId === source.droppableId &&
         destination.index === source.index)) {
      return;
    }

    // Update the quadrant of the dropped item
    const updatedItems = matrixItems.map(item => {
      if (item.id === draggableId) {
        return { ...item, quadrant: destination.droppableId };
      }
      return item;
    });

    // Update state with the new items array
    setMatrixItems(updatedItems);

    // Here you would typically update the backend with the new quadrant for this item
    console.log(`Item ${draggableId} moved from ${source.droppableId} to ${destination.droppableId}`);
  };

  const resetFilters = () => {
    setFilters({});
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Project Dashboard</DashboardTitle>
        <ControlsContainer>
          <Button onClick={() => setSortMode('priority')} active={sortMode === 'priority'}>
            <FaChartPie /> Sort by Priority
          </Button>
          <Button onClick={() => setSortMode('deadline')} active={sortMode === 'deadline'}>
            <FaExchangeAlt /> Sort by Deadline
          </Button>
          <Button onClick={() => setSortMode('progress')} active={sortMode === 'progress'}>
            <FaTasks /> Sort by Progress
          </Button>
          <Button onClick={() => setShowFilters(!showFilters)} active={showFilters}>
            <FaFilter /> Filters
          </Button>
          <ObjectivesButton to="/objectives">
            <FaListUl /> Manage Objectives
          </ObjectivesButton>
        </ControlsContainer>
      </DashboardHeader>

      <RoleToggle>
        <RoleLabel>View as:</RoleLabel>
        <ViewToggle>
          <ViewButton
            active={userRole === USER_ROLES.MANAGER}
            onClick={() => setUserRole(USER_ROLES.MANAGER)}
          >
            Manager
          </ViewButton>
          <ViewButton
            active={userRole === USER_ROLES.MEMBER}
            onClick={() => setUserRole(USER_ROLES.MEMBER)}
          >
            Team Member
          </ViewButton>
        </ViewToggle>
      </RoleToggle>

      <AdvancedFilters
        visible={showFilters}
        filters={filters}
        availableTags={allTags}
        statuses={statusOptions}
        quadrants={quadrantOptions}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      <StatusIndicators statuses={statusIndicators} />

      <SectionHeader>
        <SectionTitle>Priority Matrix</SectionTitle>
        <ViewToggle>
          <ViewButton
            active={viewMode === 'objectives'}
            onClick={() => setViewMode('objectives')}
          >
            <FaEye /> Objectives
          </ViewButton>
          <ViewButton
            active={viewMode === 'actions'}
            onClick={() => setViewMode('actions')}
          >
            <FaEye /> Actions
          </ViewButton>
        </ViewToggle>
      </SectionHeader>

      <PriorityMatrix items={matrixItems} onDragEnd={handleDragEnd} />

      <ChartsContainer>
        <ObjectiveProgressChart data={chartData.objectiveProgress} />
        <StatusDistributionChart data={chartData.statusDistribution} />
        <QuadrantDistributionChart data={chartData.quadrantDistribution} />

        {isManager && (
          <ObjectiveProgressChart
            data={chartData.teamPerformance}
            title="Team Performance"
          />
        )}
      </ChartsContainer>

      <KeyProblemsSection />

      <UserPreferencesPanel />
    </DashboardContainer>
  );
}

// Wrapper Component with UserProvider and PreferencesProvider
export default function Dashboard() {
  return (
    <UserPreferencesProvider>
      <UserProvider>
        <DashboardContent />
      </UserProvider>
    </UserPreferencesProvider>
  );
}
