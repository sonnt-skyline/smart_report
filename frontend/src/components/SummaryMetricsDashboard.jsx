import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import styled from 'styled-components';

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: ${props => props.bgColor || '#fff'};
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  height: 300px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const ChartTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #555;
  font-weight: 500;
`;

// Sample data for metrics
const completedObjectives = 28;
const totalObjectives = 35;
const completionRate = Math.round((completedObjectives / totalObjectives) * 100);

const actionVelocity = 18; // Actions completed per week
const previousVelocity = 15;
const velocityChange = Math.round(((actionVelocity - previousVelocity) / previousVelocity) * 100);

const teamUtilization = 84; // Percentage
const issueResolutionTime = 3.2; // Days

// Sample data for charts
const objectivesCompletion = [
  { name: 'Week 1', completed: 5, total: 8 },
  { name: 'Week 2', completed: 6, total: 8 },
  { name: 'Week 3', completed: 7, total: 9 },
  { name: 'Week 4', completed: 10, total: 10 },
];

const actionVelocityData = [
  { name: 'Week 1', velocity: 12 },
  { name: 'Week 2', velocity: 15 },
  { name: 'Week 3', velocity: 15 },
  { name: 'Week 4', velocity: 18 },
];

const categoryDistribution = [
  { name: 'Feature', value: 45 },
  { name: 'Bug', value: 25 },
  { name: 'Tech Debt', value: 15 },
  { name: 'Documentation', value: 15 },
];

const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];

const performanceRadarData = [
  { subject: 'Velocity', A: 85, fullMark: 100 },
  { subject: 'Quality', A: 92, fullMark: 100 },
  { subject: 'Coverage', A: 78, fullMark: 100 },
  { subject: 'Delivery', A: 88, fullMark: 100 },
  { subject: 'Complexity', A: 65, fullMark: 100 },
];

function SummaryMetricsDashboard() {
  return (
    <>
      <MetricsGrid>
        <MetricCard>
          <MetricValue>{completionRate}%</MetricValue>
          <MetricLabel>Objectives Completion</MetricLabel>
          <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            {completedObjectives} of {totalObjectives} completed
          </div>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{actionVelocity}</MetricValue>
          <MetricLabel>Action Velocity</MetricLabel>
          <div style={{ 
            fontSize: '0.85rem', 
            marginTop: '0.5rem', 
            color: velocityChange >= 0 ? '#34A853' : '#EA4335' 
          }}>
            {velocityChange >= 0 ? '+' : ''}{velocityChange}% from last week
          </div>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{teamUtilization}%</MetricValue>
          <MetricLabel>Team Utilization</MetricLabel>
        </MetricCard>
        
        <MetricCard>
          <MetricValue>{issueResolutionTime}</MetricValue>
          <MetricLabel>Avg. Resolution Time (days)</MetricLabel>
        </MetricCard>
      </MetricsGrid>
      
      <ChartsContainer>
        <ChartContainer>
          <ChartTitle>Objectives Completion Trend</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={objectivesCompletion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" name="Completed" fill="#4285F4" />
              <Bar dataKey="total" name="Total" fill="#E8EAED" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Action Velocity Trend</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={actionVelocityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="velocity" 
                name="Actions/Week" 
                stroke="#34A853" 
                strokeWidth={2} 
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Action Category Distribution</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Team Performance Metrics</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar 
                name="Performance" 
                dataKey="A" 
                stroke="#4285F4" 
                fill="#4285F4" 
                fillOpacity={0.6} 
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartsContainer>
    </>
  );
}

export default SummaryMetricsDashboard;
