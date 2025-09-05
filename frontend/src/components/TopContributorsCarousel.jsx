import React, { useState } from 'react';
import { useSpring, animated, config } from 'react-spring';
import styled from 'styled-components';

// Sample contributor data
const contributorsData = [
  {
    id: 1,
    name: 'Alice Chen',
    role: 'Frontend Developer',
    avatar: 'https://i.pravatar.cc/100?img=1',
    metrics: {
      completedTasks: 24,
      velocity: 8.5,
      qualityScore: 95
    },
    highlights: [
      'Implemented new authentication flow',
      'Reduced bundle size by 18%',
      'Fixed 12 accessibility issues'
    ]
  },
  {
    id: 2,
    name: 'David Rodriguez',
    role: 'Backend Engineer',
    avatar: 'https://i.pravatar.cc/100?img=3',
    metrics: {
      completedTasks: 19,
      velocity: 7.2,
      qualityScore: 92
    },
    highlights: [
      'Optimized database queries (35% faster)',
      'Implemented caching system',
      'Reduced API response time by 42%'
    ]
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    role: 'UX Designer',
    avatar: 'https://i.pravatar.cc/100?img=5',
    metrics: {
      completedTasks: 17,
      velocity: 6.8,
      qualityScore: 98
    },
    highlights: [
      'Redesigned checkout workflow',
      'Created design system components',
      'Conducted 8 user testing sessions'
    ]
  },
  {
    id: 4,
    name: 'Michael Lee',
    role: 'DevOps Engineer',
    avatar: 'https://i.pravatar.cc/100?img=8',
    metrics: {
      completedTasks: 21,
      velocity: 7.9,
      qualityScore: 91
    },
    highlights: [
      'Improved CI/CD pipeline',
      'Reduced deployment time by 65%',
      'Implemented auto-scaling configuration'
    ]
  },
  {
    id: 5,
    name: 'Emma Wilson',
    role: 'QA Engineer',
    avatar: 'https://i.pravatar.cc/100?img=9',
    metrics: {
      completedTasks: 22,
      velocity: 7.4,
      qualityScore: 97
    },
    highlights: [
      'Created 85 automated test cases',
      'Reduced regression testing time by 40%',
      'Implemented performance testing suite'
    ]
  }
];

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  height: 320px;
`;

const CarouselTrack = styled.div`
  display: flex;
  height: 100%;
`;

const CarouselCard = styled(animated.div)`
  flex-shrink: 0;
  width: 100%;
  border-radius: 10px;
  padding: 0 15px;
  transition: opacity 0.3s ease;
  
  @media (min-width: 768px) {
    width: 33.333%;
  }
`;

const ContributorCard = styled.div`
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 1.5rem;
  height: 100%;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
`;

const ContributorInfo = styled.div`
  flex: 1;
`;

const ContributorName = styled.h4`
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: #333;
`;

const ContributorRole = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const MetricsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  padding: 0.75rem 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
`;

const Metric = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  color: #333;
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  color: #777;
`;

const HighlightsList = styled.ul`
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
  flex: 1;
`;

const Highlight = styled.li`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #555;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

const NavButton = styled.button`
  background-color: ${props => props.$active ? '#4285F4' : '#f0f0f0'};
  border: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#4285F4' : '#d0d0d0'};
  }
  
  &:focus {
    outline: none;
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f8f8;
  }
  
  &:focus {
    outline: none;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.prev {
    left: 10px;
  }
  
  &.next {
    right: 10px;
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const ArrowIcon = ({ direction }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {direction === 'prev' ? (
      <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    ) : (
      <path d="M9 18L15 12L9 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    )}
  </svg>
);

function TopContributorsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  
  // Calculate how many cards to show at a time
  const getVisibleCount = () => {
    if (window.innerWidth >= 768) return 3;
    return 1;
  };
  const visibleCount = getVisibleCount();
  const maxIndex = Math.max(0, contributorsData.length - visibleCount);
  
  // Animation springs
  const springs = useSpring({
    to: { transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` },
    config: config.gentle,
    onStart: () => setAnimating(true),
    onRest: () => setAnimating(false)
  });
  
  const handleNext = () => {
    if (animating) return;
    setCurrentIndex(Math.min(currentIndex + 1, maxIndex));
  };
  
  const handlePrev = () => {
    if (animating) return;
    setCurrentIndex(Math.max(currentIndex - 1, 0));
  };
  
  const goToIndex = (index) => {
    if (animating) return;
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
  };
  
  return (
    <>
      <CarouselContainer>
        <ArrowButton 
          className="prev" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
        >
          <ArrowIcon direction="prev" />
        </ArrowButton>
        
        <ArrowButton 
          className="next" 
          onClick={handleNext} 
          disabled={currentIndex === maxIndex}
        >
          <ArrowIcon direction="next" />
        </ArrowButton>
        
        <animated.div 
          style={{ 
            display: 'flex', 
            width: `${contributorsData.length * 100 / visibleCount}%`,
            ...springs 
          }}
        >
          {contributorsData.map((contributor) => (
            <CarouselCard 
              key={contributor.id}
              style={{ width: `${100 / visibleCount}%` }}
            >
              <ContributorCard>
                <CardHeader>
                  <Avatar src={contributor.avatar} alt={contributor.name} />
                  <ContributorInfo>
                    <ContributorName>{contributor.name}</ContributorName>
                    <ContributorRole>{contributor.role}</ContributorRole>
                  </ContributorInfo>
                </CardHeader>
                
                <MetricsContainer>
                  <Metric>
                    <MetricValue>{contributor.metrics.completedTasks}</MetricValue>
                    <MetricLabel>Tasks</MetricLabel>
                  </Metric>
                  <Metric>
                    <MetricValue>{contributor.metrics.velocity}</MetricValue>
                    <MetricLabel>Velocity</MetricLabel>
                  </Metric>
                  <Metric>
                    <MetricValue>{contributor.metrics.qualityScore}</MetricValue>
                    <MetricLabel>Quality</MetricLabel>
                  </Metric>
                </MetricsContainer>
                
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem' }}>
                    Key Contributions:
                  </div>
                  <HighlightsList>
                    {contributor.highlights.map((highlight, index) => (
                      <Highlight key={index}>{highlight}</Highlight>
                    ))}
                  </HighlightsList>
                </div>
              </ContributorCard>
            </CarouselCard>
          ))}
        </animated.div>
      </CarouselContainer>
      
      <NavigationButtons>
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <NavButton 
            key={index}
            $active={index === currentIndex}
            onClick={() => goToIndex(index)}
          />
        ))}
      </NavigationButtons>
    </>
  );
}

export default TopContributorsCarousel;
