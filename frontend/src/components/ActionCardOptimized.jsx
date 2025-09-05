import ProgressBar from './ProgressBar';
import { CATEGORY_COLORS, STATUS_COLORS, WORK_STATUS_COLORS } from '../constants';

function getCurrentWeek() {
  const now = new Date();
  const year = now.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

function getLatestStatus(action) {
  const currentWeek = getCurrentWeek();
  let lastUpdate = null;
  for (const u of action.statusUpdates) {
    if (u.week <= currentWeek) {
      if (!lastUpdate || u.week > lastUpdate.week) lastUpdate = u;
    }
  }
  return lastUpdate ?
    { workStatus: lastUpdate.workStatus, progress: lastUpdate.progress } :
    { workStatus: 'Not started', progress: 0 };
}

function getUrgencyLevel(deadline) {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) return 'overdue';
  if (daysUntil <= 3) return 'urgent';
  if (daysUntil <= 7) return 'soon';
  return 'normal';
}

export default function ActionCardOptimized({ action, variant = 'detailed' }) {
  const { workStatus, progress } = getLatestStatus(action);
  const urgencyLevel = getUrgencyLevel(action.deadline);
  const isOverdue = urgencyLevel === 'overdue';

  // Compact variant for mobile or list views
  if (variant === 'compact') {
    return (
      <div className={`action-card-compact ${urgencyLevel}`}
           style={{ borderLeftColor: CATEGORY_COLORS[action.category] }}>
        <div className="card-header-compact">
          <h3 className="card-title-compact">{action.title}</h3>
          <div className="card-status-badge"
               style={{ backgroundColor: WORK_STATUS_COLORS[workStatus] }}>
            {workStatus}
          </div>
        </div>

        <div className="card-progress-compact">
          <ProgressBar value={progress} workStatus={workStatus} size="small" />
          <span className="progress-label">{progress}%</span>
        </div>

        <div className="card-footer-compact">
          <span className={`deadline ${isOverdue ? 'overdue' : ''}`}>
            {new Date(action.deadline).toLocaleDateString()}
          </span>
          {action.tags && action.tags.length > 0 && (
            <div className="tags-compact">
              {action.tags.slice(0, 2).map(tag => (
                <span key={tag} className="tag-compact">{tag}</span>
              ))}
              {action.tags.length > 2 && <span className="tag-more">+{action.tags.length - 2}</span>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detailed variant for dashboard views
  return (
    <div className={`action-card-optimized ${urgencyLevel}`}
         style={{ backgroundColor: CATEGORY_COLORS[action.category] }}>

      {/* Priority Header */}
      <div className="card-header-priority">
        <div className="urgency-indicator" data-urgency={urgencyLevel} />
        <h3 className="card-title-optimized">{action.title}</h3>
        <div className="card-category-badge">{action.category}</div>
      </div>

      {/* Status & Progress - Most Important */}
      <div className="card-primary-info">
        <div className="status-section">
          <span className="status-label">Status</span>
          <span className="status-value" style={{ color: WORK_STATUS_COLORS[workStatus] }}>
            {workStatus}
          </span>
        </div>
        <div className="progress-section">
          <ProgressBar value={progress} workStatus={workStatus} />
          <span className="progress-percentage">{progress}%</span>
        </div>
      </div>

      {/* Deadline - Critical Info */}
      <div className="card-deadline-section">
        <span className="deadline-label">Due:</span>
        <span className={`deadline-value ${isOverdue ? 'overdue' : ''}`}>
          {new Date(action.deadline).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: action.deadline.includes(new Date().getFullYear().toString()) ? undefined : 'numeric'
          })}
        </span>
      </div>

      {/* Collapsible Secondary Info */}
      <details className="card-secondary-info">
        <summary className="secondary-info-toggle">More details</summary>
        <div className="secondary-content">
          {/* Assessments */}
          <div className="assessment-row">
            <span className="assessment-label">Self:</span>
            <span style={{ color: STATUS_COLORS[action.selfAssessment.status] }}>
              {action.selfAssessment.text}
            </span>
          </div>
          <div className="assessment-row">
            <span className="assessment-label">AI:</span>
            <span style={{ color: STATUS_COLORS[action.aiAssessment.status] }}>
              {action.aiAssessment.text}
            </span>
          </div>

          {/* Objective Link */}
          {action.parentObjective && (
            <div className="objective-row">
              <span className="objective-label">Objective:</span>
              {action.parentObjectiveLink ? (
                <a href={action.parentObjectiveLink}
                   className="objective-link"
                   target="_blank"
                   rel="noopener noreferrer">
                  {action.parentObjective}
                </a>
              ) : (
                <span className="objective-text">{action.parentObjective}</span>
              )}
            </div>
          )}

          {/* Tags */}
          {action.tags && action.tags.length > 0 && (
            <div className="tags-section">
              {action.tags.map(tag => (
                <span key={tag} className="tag-optimized">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
