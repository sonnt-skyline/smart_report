import React from 'react';
import { FcHighPriority, FcMediumPriority, FcLowPriority } from 'react-icons/fc';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DragAndDropWrappers from './DragAndDropWrappers';
const { DragDropContextWrapper, DroppableWrapper, DraggableWrapper } = DragAndDropWrappers;

const MatrixContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  height: 500px;
  margin-bottom: 2rem;
`;

// Create a functional component to handle the bgColor prop
const QuadrantContainer = ({ bgColor, children, ...rest }) => {
  const containerStyle = {
    backgroundColor: bgColor || '#fff'
  };
  
  return (
    <StyledQuadrantContainer style={containerStyle} {...rest}>
      {children}
    </StyledQuadrantContainer>
  );
};

const StyledQuadrantContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const QuadrantTitle = styled.h3`
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Create a functional component to handle the borderColor prop
const ItemCard = React.forwardRef(({ borderColor, children, ...rest }, ref) => {
  const cardStyle = {
    borderLeftColor: borderColor || '#ccc'
  };
  
  return (
    <StyledItemCard ref={ref} style={cardStyle} {...rest}>
      {children}
    </StyledItemCard>
  );
});

const StyledItemCard = styled.div`
  background-color: white;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: grab;
  border-left: 5px solid;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ItemTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
`;

const ItemDetails = styled.div`
  font-size: 0.8rem;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressIndicator = styled.div`
  height: 5px;
  width: 100%;
  background-color: #eee;
  margin-top: 8px;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: ${props => {
    if (props.status === 'off track') return '#c92a2a';
    if (props.progress === 100) return '#2b8a3e';
    return '#1971c2';
  }};
`;

const ItemTag = styled.span`
  background-color: #e9ecef;
  color: #495057;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 3px;
  margin-right: 4px;
`;

const TagContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

// Prioritization Matrix Component
function PriorityMatrix({ items, onDragEnd }) {
  const getQuadrantItems = (quadrant) => {
    return items.filter(item => item.quadrant === quadrant);
  };

  const getQuadrantIcon = (quadrant) => {
    switch(quadrant) {
      case 'urgent-important':
        return <FcHighPriority size={20} />;
      case 'urgent-not-important':
      case 'not-urgent-important':
        return <FcMediumPriority size={20} />;
      default:
        return <FcLowPriority size={20} />;
    }
  };

  const getQuadrantStyle = (quadrant) => {
    switch(quadrant) {
      case 'urgent-important':
        return { bgColor: 'rgba(255, 236, 236, 0.6)' };
      case 'urgent-not-important':
        return { bgColor: 'rgba(255, 248, 230, 0.6)' };
      case 'not-urgent-important':
        return { bgColor: 'rgba(236, 253, 245, 0.6)' };
      default:
        return { bgColor: 'rgba(248, 249, 250, 0.6)' };
    }
  };

  const getItemStatusColor = (status) => {
    switch(status) {
      case 'off track':
        return '#c92a2a';
      case 'completed':
        return '#2b8a3e';
      default:
        return '#1971c2';
    }
  };

  const renderQuadrant = (quadrantId, title) => {
    const quadrantItems = getQuadrantItems(quadrantId);
    const { bgColor } = getQuadrantStyle(quadrantId);
    
    return (
      <QuadrantContainer bgColor={bgColor}>
        <QuadrantTitle>
          {getQuadrantIcon(quadrantId)} {title}
        </QuadrantTitle>
        <DroppableWrapper 
          droppableId={quadrantId}
          direction="vertical"
          type="ITEM">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ flexGrow: 1 }}
            >
              {quadrantItems.map((item, index) => (
                <DraggableWrapper
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                  type="ITEM"
                >
                  {(provided) => (
                    <ItemCard
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      borderColor={getItemStatusColor(item.status)}
                    >
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemDetails>
                        <span>Due: {new Date(item.deadline).toLocaleDateString()}</span>
                        <span>{item.progress}%</span>
                      </ItemDetails>
                      <ProgressIndicator>
                        <ProgressBar progress={item.progress} status={item.status} />
                      </ProgressIndicator>
                      <TagContainer>
                        {item.tags && item.tags.map(tag => (
                          <ItemTag key={tag}>{tag}</ItemTag>
                        ))}
                      </TagContainer>
                    </ItemCard>
                  )}
                </DraggableWrapper>
              ))}
              {provided.placeholder}
            </div>
          )}
        </DroppableWrapper>
      </QuadrantContainer>
    );
  };

  return (
    <DragDropContextWrapper 
      onDragEnd={onDragEnd}
      onDragStart={() => {}}
      onDragUpdate={() => {}}>
      <MatrixContainer>
        {renderQuadrant('urgent-important', 'Urgent & Important')}
        {renderQuadrant('urgent-not-important', 'Urgent, Not Important')}
        {renderQuadrant('not-urgent-important', 'Important, Not Urgent')}
        {renderQuadrant('not-urgent-not-important', 'Not Urgent, Not Important')}
      </MatrixContainer>
    </DragDropContextWrapper>
  );
}

PriorityMatrix.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      quadrant: PropTypes.string.isRequired,
      progress: PropTypes.number.isRequired,
      deadline: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  onDragEnd: PropTypes.func.isRequired,
};

export default PriorityMatrix;
