import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

// Styled Components
const TrackerContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const TrackerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const TrackerTitle = styled.h3`
  margin: 0;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 1.5rem;
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const MetricCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
`;

const MetricTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

const MetricValues = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
`;

const CurrentValue = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0088cc;
`;

const TargetValue = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const ProgressBarContainer = styled.div`
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.75rem;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: ${props => {
    if (props.percentage >= 100) return '#52c41a';
    if (props.percentage >= 75) return '#1890ff';
    if (props.percentage >= 50) return '#faad14';
    return '#ff4d4f';
  }};
  width: ${props => Math.min(props.percentage, 100)}%;
  transition: width 0.3s ease;
`;

const NoMetricsMessage = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: #888;
`;

const TimelineContainer = styled.div`
  margin-top: 2rem;
`;

const TimelineTitle = styled.h3`
  margin: 0 0 1rem 0;
`;

// Calculate progress percentage for a metric
const calculatePercentage = (current, target) => {
  if (!target) return 0;
  const percentage = (parseFloat(current) / parseFloat(target)) * 100;
  return Math.min(Math.max(percentage, 0), 100);
};

// Generate timeline data points
const generateTimelineData = (objective, metrics = []) => {
  // This would normally come from historical data stored in the backend
  // For now, we'll generate some sample data points
  
  // Get start date (creation date) and end date (deadline)
  const startDate = new Date(objective.createdAt);
  const endDate = new Date(objective.deadline);
  const today = new Date();
  
  // Calculate the number of data points based on date range
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
  
  // Generate milestones (including today)
  const dataPoints = [];
  
  // First point (start)
  dataPoints.push({
    date: startDate.toISOString().split('T')[0],
    progress: 0,
    name: 'Start'
  });
  
  // Generate intermediate points
  const numPoints = Math.min(6, totalDays) - 2; // -2 for start and end points
  if (numPoints > 0) {
    const interval = Math.floor(totalDays / (numPoints + 1));
    
    for (let i = 1; i <= numPoints; i++) {
      const pointDate = new Date(startDate);
      pointDate.setDate(startDate.getDate() + (interval * i));
      
      // If this point is in the future, stop adding actual progress
      const pointProgress = pointDate <= today 
        ? Math.floor((objective.progress / elapsedDays) * interval * i)
        : null;
      
      dataPoints.push({
        date: pointDate.toISOString().split('T')[0],
        progress: Math.min(pointProgress || 0, 100),
        name: `Milestone ${i}`,
        expected: Math.min(Math.floor((100 / totalDays) * interval * i), 100)
      });
    }
  }
  
  // Add today's point if not already included and if between start and end
  if (today > startDate && today < endDate) {
    const todayStr = today.toISOString().split('T')[0];
    if (!dataPoints.find(p => p.date === todayStr)) {
      dataPoints.push({
        date: todayStr,
        progress: objective.progress,
        name: 'Today',
        expected: Math.min(Math.floor((100 / totalDays) * elapsedDays), 100)
      });
    }
  }
  
  // Last point (deadline)
  dataPoints.push({
    date: endDate.toISOString().split('T')[0],
    progress: today >= endDate ? objective.progress : null,
    name: 'Deadline',
    expected: 100
  });
  
  // Sort by date
  dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return dataPoints;
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '10px', 
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}>
        <p style={{ margin: '0 0 5px' }}>{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ 
            color: entry.color,
            margin: '0'
          }}>
            {`${entry.name}: ${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string
};

const ObjectiveTracker = ({ objective }) => {
  const { metrics = [] } = objective;
  
  // Generate timeline data
  const timelineData = generateTimelineData(objective, metrics);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <TrackerContainer>
      <TrackerHeader>
        <TrackerTitle>Progress Tracking</TrackerTitle>
      </TrackerHeader>
      
      <TimelineContainer>
        <TimelineTitle>Timeline Progress</TimelineTitle>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timelineData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                domain={[0, 100]} 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="expected"
                stroke="#8884d8"
                name="Expected Progress"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#0088cc"
                name="Actual Progress"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </TimelineContainer>
      
      {metrics && metrics.length > 0 ? (
        <>
          <TimelineTitle>Key Results & Metrics</TimelineTitle>
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.map(metric => ({
                  name: metric.name,
                  current: parseFloat(metric.currentValue) || 0,
                  target: parseFloat(metric.targetValue) || 0
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#0088cc" name="Current Value" />
                <Bar dataKey="target" fill="#8884d8" name="Target Value" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <MetricsContainer>
            {metrics.map((metric, index) => (
              <MetricCard key={index}>
                <MetricTitle>{metric.name}</MetricTitle>
                <MetricValues>
                  <CurrentValue>{metric.currentValue}</CurrentValue>
                  <TargetValue>Target: {metric.targetValue}</TargetValue>
                </MetricValues>
                <ProgressBarContainer>
                  <ProgressBarFill 
                    percentage={calculatePercentage(metric.currentValue, metric.targetValue)} 
                  />
                </ProgressBarContainer>
              </MetricCard>
            ))}
          </MetricsContainer>
        </>
      ) : (
        <NoMetricsMessage>
          <p>No metrics have been added to this objective yet.</p>
        </NoMetricsMessage>
      )}
    </TrackerContainer>
  );
};

ObjectiveTracker.propTypes = {
  objective: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    progress: PropTypes.number.isRequired,
    deadline: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    metrics: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        targetValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    )
  }).isRequired
};

export default ObjectiveTracker;
