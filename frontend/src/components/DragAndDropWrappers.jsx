import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';

// Create a wrapper for Droppable that ensures all boolean props are explicitly defined
export const DroppableWrapper = ({ droppableId, type, direction, children }) => {
  return (
    <Droppable 
      droppableId={droppableId} 
      type={type || 'DEFAULT'}
      direction={direction || 'vertical'}
      isDropDisabled={false}
      isCombineEnabled={false}
      ignoreContainerClipping={false}
    >
      {children}
    </Droppable>
  );
};

DroppableWrapper.propTypes = {
  droppableId: PropTypes.string.isRequired,
  type: PropTypes.string,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  children: PropTypes.func.isRequired
};

// Create a wrapper for Draggable that ensures all boolean props are explicitly defined
export const DraggableWrapper = ({ draggableId, index, type, children }) => {
  return (
    <Draggable 
      draggableId={draggableId} 
      index={index}
      type={type || 'DEFAULT'}
      isDragDisabled={false}
      shouldRespectForcePress={false}
      disableInteractiveElementBlocking={false}
      isDropAnimating={false}
      isCombineEnabled={false}
    >
      {children}
    </Draggable>
  );
};

DraggableWrapper.propTypes = {
  draggableId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.string,
  children: PropTypes.func.isRequired
};

// Re-export DragDropContext for consistency
export const DragDropContextWrapper = ({ onDragEnd, onDragStart, onDragUpdate, children }) => {
  return (
    <DragDropContext 
      onDragEnd={onDragEnd}
      onDragStart={onDragStart || (() => {})}
      onDragUpdate={onDragUpdate || (() => {})}
      enableDefaultSensors={true}
    >
      {children}
    </DragDropContext>
  );
};

DragDropContextWrapper.propTypes = {
  onDragEnd: PropTypes.func.isRequired,
  onDragStart: PropTypes.func,
  onDragUpdate: PropTypes.func,
  children: PropTypes.node.isRequired
};

// Export all wrappers as a default object
export default {
  DroppableWrapper,
  DraggableWrapper,
  DragDropContextWrapper
};
