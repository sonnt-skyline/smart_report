import { useState, useEffect } from 'react';
import ActionCardOptimized from './ActionCardOptimized';
import './ActionCardOptimized.css';

export default function ActionCardListOptimized({ 
  actions, 
  variant = 'detailed', // 'detailed' | 'compact'
  viewMode = 'auto' // 'auto' | 'grid' | 'list'
}) {
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
        if (viewMode === 'auto') {
          setCurrentViewMode('list');
        }
      } else if (width < 1024) {
        setScreenSize('tablet');
        if (viewMode === 'auto') {
          setCurrentViewMode('grid');
        }
      } else {
        setScreenSize('desktop');
        if (viewMode === 'auto') {
          setCurrentViewMode('grid');
        }
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  if (!actions.length) {
    return (
      <div className="no-actions-message">
        <p>No actions in this category.</p>
      </div>
    );
  }

  // Sort actions by priority (overdue first, then by deadline)
  const sortedActions = [...actions].sort((a, b) => {
    const deadlineA = new Date(a.deadline);
    const deadlineB = new Date(b.deadline);
    const now = new Date();
    
    const isOverdueA = deadlineA < now;
    const isOverdueB = deadlineB < now;
    
    // Overdue items first
    if (isOverdueA && !isOverdueB) return -1;
    if (!isOverdueA && isOverdueB) return 1;
    
    // Then sort by deadline
    return deadlineA - deadlineB;
  });

  const getCardVariant = () => {
    if (variant !== 'auto') return variant;
    return currentViewMode === 'list' || screenSize === 'mobile' ? 'compact' : 'detailed';
  };

  const getContainerClass = () => {
    const cardVariant = getCardVariant();
    if (currentViewMode === 'list' || cardVariant === 'compact') {
      return 'actions-card-list-compact';
    }
    return 'actions-card-list-optimized';
  };

  return (
    <div className="action-list-container">
      {/* Header with View Mode Controls and Summary on one line */}
      {(viewMode === 'auto' && screenSize !== 'mobile') || sortedActions.filter(action => new Date(action.deadline) < new Date()).length > 0 ? (
        <div className="action-list-header">
          {/* Actions Summary - Show only overdue count if any */}
          <div className="actions-summary">
            {(() => {
              const overdueCount = sortedActions.filter(action => new Date(action.deadline) < new Date()).length;
              return overdueCount > 0 ? (
                <span className="overdue-indicator">{overdueCount} overdue</span>
              ) : null;
            })()}
          </div>

          {/* View Mode Controls (optional) */}
          {viewMode === 'auto' && screenSize !== 'mobile' && (
            <div className="view-mode-controls">
              <button 
                className={`view-mode-btn ${currentViewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setCurrentViewMode('grid')}
                aria-label="Grid view"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                </svg>
              </button>
              <button 
                className={`view-mode-btn ${currentViewMode === 'list' ? 'active' : ''}`}
                onClick={() => setCurrentViewMode('list')}
                aria-label="List view"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Actions List */}
      <div className={getContainerClass()}>
        {sortedActions.map(action => (
          <ActionCardOptimized 
            key={action.id} 
            action={action} 
            variant={getCardVariant()}
          />
        ))}
      </div>
    </div>
  );
}
