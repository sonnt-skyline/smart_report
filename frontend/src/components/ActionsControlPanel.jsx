import { useState } from 'react';
import { GROUP_OPTIONS } from '../constants';
import './ActionsControlPanel.css';

export default function ActionsControlPanel({ 
  groupBy, 
  setGroupBy, 
  filter, 
  setFilter,
  totalActions,
  filteredActions,
  actionCounts // Add this to receive actual counts from parent
}) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const filters = ['All', 'On-going', 'Blocked', 'On hold', 'Completed', 'Not started'];
  
  // Use the action counts passed from parent, or fallback to simple calculation
  const getDisplayCount = (filterType) => {
    if (actionCounts && actionCounts[filterType] !== undefined) {
      return actionCounts[filterType];
    }
    return filterType === 'All' ? totalActions : '';
  };

  return (
    <div className="actions-control-panel">
      {/* Header with Title and Summary */}
      <div className="control-panel-header">
        <div className="page-title-section">
          <h1 className="page-title">Actions Dashboard</h1>
          <div className="actions-summary-compact">
            <span className="total-count">{totalActions} total actions</span>
            {filter !== 'All' && (
              <span className="filtered-count">• {filteredActions} {filter.toLowerCase()}</span>
            )}
          </div>
        </div>
        
        {/* Category Legend - Compact */}
        <div className="category-legend-compact">
          <span className="legend-label">Categories:</span>
          <div className="legend-items">
            <span className="legend-item delivery">Delivery</span>
            <span className="legend-item selfdev">Self development</span>
            <span className="legend-item solution">Solution+</span>
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="main-controls">
        {/* Group By Controls */}
        <div className="control-section">
          <label className="control-label">View by:</label>
          <div className="group-buttons-compact">
            {GROUP_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`group-btn ${groupBy === opt.value ? 'active' : ''}`}
                onClick={() => setGroupBy(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="control-section">
          <label className="control-label">Status:</label>
          <div className="filter-buttons-compact">
            {filters.map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                title={f === 'All' ? `Show all ${totalActions} actions` : `Filter by ${f}`}
              >
                {f}
                {/* Show count for each filter */}
                {getDisplayCount(f) && (
                  <span className="filter-count">
                    {getDisplayCount(f)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="control-section quick-actions">
          <button 
            className="quick-action-btn"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            title="More filters"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
            </svg>
            Filters
          </button>
          
          <button className="quick-action-btn" title="Sort options">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
            </svg>
            Sort
          </button>
        </div>
      </div>

      {/* Advanced Filters (Collapsible) */}
      {showAdvancedFilters && (
        <div className="advanced-filters">
          <div className="advanced-filter-section">
            <label className="filter-label">Priority:</label>
            <select className="filter-select">
              <option value="all">All priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="advanced-filter-section">
            <label className="filter-label">Due date:</label>
            <select className="filter-select">
              <option value="all">All dates</option>
              <option value="overdue">Overdue</option>
              <option value="today">Due today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>
          
          <div className="advanced-filter-section">
            <label className="filter-label">Tags:</label>
            <input 
              type="text" 
              className="filter-input" 
              placeholder="Search tags..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
