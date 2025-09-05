import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';

/**
 * RadialComparisonChart component that displays a comparison of user metrics vs team average
 * @param {Object} props Component props
 * @param {Object} props.userData User's contribution scores
 * @param {Object} props.teamAverage Team average contribution scores
 * @param {String} props.title Chart title
 */
const RadialComparisonChart = ({ userData, teamAverage, title }) => {
  // Format data for radar chart
  const radarData = [
    { 
      subject: 'Actions Completed', 
      'Your Score': userData.scores.actionScore, 
      'Team Average': teamAverage.actionScore,
      fullMark: Math.max(userData.scores.actionScore, teamAverage.actionScore) * 1.2
    },
    { 
      subject: 'Objective Impact', 
      'Your Score': userData.scores.impactScore, 
      'Team Average': teamAverage.impactScore,
      fullMark: Math.max(userData.scores.impactScore, teamAverage.impactScore) * 1.2
    },
    { 
      subject: 'Total Contribution', 
      'Your Score': userData.scores.totalScore, 
      'Team Average': teamAverage.totalScore,
      fullMark: Math.max(userData.scores.totalScore, teamAverage.totalScore) * 1.2
    }
  ];

  const customLegendFormatter = (value) => {
    if (value === 'Your Score') return `Your Score (${userData.name || 'You'})`;
    return value;
  };

  // Custom hook for responsive height
  const [chartHeight, setChartHeight] = React.useState('400px');
  
  React.useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth <= 576) {
        setChartHeight('300px');
      } else if (window.innerWidth <= 768) {
        setChartHeight('350px');
      } else {
        setChartHeight('400px');
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      height: chartHeight,
      boxSizing: 'border-box'
    }}>
      <h3 style={{ 
        textAlign: 'center', 
        marginBottom: window.innerWidth <= 576 ? '0.5rem' : '0.75rem',
        fontSize: window.innerWidth <= 576 ? '1.1rem' : '1.3rem',
        paddingLeft: window.innerWidth <= 576 ? '0' : null,
        paddingRight: window.innerWidth <= 576 ? '0' : null
      }}>{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart 
          cx="50%" 
          cy="50%" 
          outerRadius={window.innerWidth <= 576 ? "65%" : "75%"} 
          data={radarData}
          margin={{ 
            top: window.innerWidth <= 576 ? 10 : 15, 
            right: window.innerWidth <= 576 ? 5 : 30, 
            bottom: window.innerWidth <= 576 ? 5 : 10, 
            left: window.innerWidth <= 576 ? 5 : 30 
          }}
        >
          <PolarGrid gridType="circle" stroke="#e0e0e0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ 
              fill: '#666', 
              fontSize: window.innerWidth <= 576 ? 12 : 14, 
              fontWeight: 500,
              dy: window.innerWidth <= 576 ? 1 : 0
            }}
            stroke="#888"
            tickLine={false}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 'auto']} 
            tick={{ 
              fontSize: window.innerWidth <= 576 ? 10 : 12, 
              fill: '#777',
              dy: window.innerWidth <= 576 ? 1 : 0
            }}
            axisLine={false}
            tickCount={window.innerWidth <= 576 ? 4 : 5}
          />
          <Radar 
            name="Team Average" 
            dataKey="Team Average" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.2} 
            dot={true}
            strokeWidth={2}
          />
          <Radar 
            name="Your Score" 
            dataKey="Your Score" 
            stroke="#82ca9d" 
            fill="#82ca9d" 
            fillOpacity={0.3} 
            dot={{ r: 4, fill: "#82ca9d", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#82ca9d", stroke: "#fff", strokeWidth: 2 }}
            strokeWidth={3}
          />
          <Legend 
            iconSize={window.innerWidth <= 576 ? 10 : 12}
            iconType="circle" 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ 
              paddingTop: window.innerWidth <= 576 ? '15px' : '25px', 
              fontSize: window.innerWidth <= 576 ? '12px' : '14px',
              lineHeight: window.innerWidth <= 576 ? '1.2' : '1.4'
            }}
            formatter={(value, entry) => {
              // For small screens, use shorter names
              if (window.innerWidth <= 576) {
                if (value === 'Your Score') return 'You';
                if (value === 'Team Average') return 'Team';
              }
              return customLegendFormatter(value);
            }}
          />
          <Tooltip 
            formatter={(value, name) => {
              // Shorten tooltip text on small screens
              const displayName = window.innerWidth <= 576 ? 
                (name === 'Your Score' ? 'You' : 'Team') : name;
              return [`${value}`, displayName];
            }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: window.innerWidth <= 576 ? '6px 8px' : '8px 12px',
              fontSize: window.innerWidth <= 576 ? '12px' : '14px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

RadialComparisonChart.propTypes = {
  userData: PropTypes.shape({
    scores: PropTypes.shape({
      actionScore: PropTypes.number.isRequired,
      impactScore: PropTypes.number.isRequired,
      totalScore: PropTypes.number.isRequired
    }).isRequired
  }).isRequired,
  teamAverage: PropTypes.shape({
    actionScore: PropTypes.number.isRequired,
    impactScore: PropTypes.number.isRequired,
    totalScore: PropTypes.number.isRequired
  }).isRequired,
  title: PropTypes.string
};

RadialComparisonChart.defaultProps = {
  title: 'Contribution Comparison'
};

export default RadialComparisonChart;
