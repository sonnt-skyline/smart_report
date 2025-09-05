import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';
import { CATEGORY_COLORS, STATUS_COLORS, WORK_STATUS_COLORS } from '../constants';

function weeksRemaining(targetDate) {
  const now = new Date();
  now.setHours(0,0,0,0);
  const target = new Date(targetDate);
  target.setHours(0,0,0,0);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const diff = target - now;
  return diff > 0 ? Math.ceil(diff / msPerWeek) : 0;
}

function getCurrentWeek() {
  const now = new Date();
  const year = now.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

export function ActionCardWithTags({ action }) {
  // Find the latest status update for the current week or before
  const currentWeek = getCurrentWeek();
  let lastUpdate = null;
  for (const u of action.statusUpdates) {
    if (u.week <= currentWeek) {
      if (!lastUpdate || u.week > lastUpdate.week) lastUpdate = u;
    }
  }
  let workStatus, progress;
  if (!lastUpdate) {
    // If no update at all, show 'Not started' instead of 'Need update'
    workStatus = 'Not started';
    progress = 0;
  } else {
    workStatus = lastUpdate.workStatus;
    progress = lastUpdate.progress;
  }

  // Filter tags to show maximum 3
  const displayTags = action.tags && action.tags.length > 0 
    ? action.tags.slice(0, 3) 
    : [];

  return (
    <div className="action-card-mobile-with-tags" style={{ background: CATEGORY_COLORS[action.category] }}>
      {/* Tags at the top right */}
      {displayTags.length > 0 && (
        <div className="card-tags-container">
          {displayTags.map(tag => (
            <span className="card-tag" key={tag}>{tag}</span>
          ))}
        </div>
      )}
      
      <div className="card-content-with-tags">
        <div className="action-card-title">{action.title}</div>
        
        <div className="card-info-row">
          <div className="card-info-label">Category:</div>
          <div className="card-info-value">{action.category}/{action.subCategory || '-'}</div>
        </div>
        
        <div className="card-info-row">
          <div className="card-info-label">Deadline:</div>
          <div className="card-info-value">
            <span className={new Date(action.deadline) < new Date() ? 'overdue' : ''}>
              {action.deadline}
            </span>
          </div>
        </div>
        
        <div className="card-info-row status-progress-row">
          <span className="status-text" style={{ color: WORK_STATUS_COLORS[workStatus] || '#888', fontWeight: 700, fontSize: '1.1em' }}>
            {workStatus}
          </span>
          <ProgressBar value={progress} workStatus={workStatus} />
          <span className="progress-bar-label-outside">{progress}%</span>
        </div>
        
        <div className="card-info-row assessments-row">
          <div className="card-info-label">Self:</div>
          <div className="card-info-value">
            <span style={{ color: STATUS_COLORS[action.selfAssessment.status] }}>
              {action.selfAssessment.text}
            </span>
          </div>
        </div>
        
        <div className="card-info-row assessments-row">
          <div className="card-info-label">AI:</div>
          <div className="card-info-value">
            <span style={{ color: STATUS_COLORS[action.aiAssessment.status] }}>
              {action.aiAssessment.text}
            </span>
          </div>
        </div>
        
        <div className="card-info-row value-added-row">
          <div className="card-info-label">Objective:</div>
          <div className="card-info-value">
            {action.parentObjectiveLink ? (
              <a
                href={action.parentObjectiveLink}
                className="value-added-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {action.parentObjective}
              </a>
            ) : (
              action.parentObjective ? 
                <span className="value-added-link">{action.parentObjective}</span> : 
                <span style={{color:'#aaa'}}>-</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActionCard({ action }) {
  // Find the latest status update for the current week or before
  const currentWeek = getCurrentWeek();
  let lastUpdate = null;
  for (const u of action.statusUpdates) {
    if (u.week <= currentWeek) {
      if (!lastUpdate || u.week > lastUpdate.week) lastUpdate = u;
    }
  }
  let workStatus, progress;
  if (!lastUpdate) {
    // If no update at all, show 'Not started' instead of 'Need update'
    workStatus = 'Not started';
    progress = 0;
  } else {
    workStatus = lastUpdate.workStatus;
    progress = lastUpdate.progress;
  }

  return (
    <div className="action-card-mobile" style={{ background: CATEGORY_COLORS[action.category] }}>
      <div className="action-card-title">{action.title}</div>
      <div className="action-card-row"><b>Category:</b> {action.category}/{action.subCategory || '-'}</div>
      {/* <div className="action-card-row"><b>Sub-category:</b> </div> */}
      <div className="action-card-row"><b>Tags:</b> {action.tags ? action.tags.map(tag => <span className="tag" key={tag}>{tag}</span>) : '-'}</div>
      {/* <div className="action-card-row"><b>Weeks Remaining:</b> {weeksRemaining(action.deadline)}</div> */}
      <div className="action-card-row"><b>Deadline:</b> <span className={new Date(action.deadline) < new Date() ? 'overdue' : ''}>{action.deadline}</span></div>
      <div className="action-card-row status-progress-row">
        <span className="status-text" style={{ color: WORK_STATUS_COLORS[workStatus] || '#888', fontWeight: 700, fontSize: '1.1em' }}>{workStatus}</span>
        <ProgressBar value={progress} workStatus={workStatus} />
        <span className="progress-bar-label-outside">{progress}%</span>
      </div>
      <div className="action-card-row assessments-row">
        <b>Self-assessment:</b> <span style={{ color: STATUS_COLORS[action.selfAssessment.status] }}>{action.selfAssessment.text}</span>
      </div>
      <div className="action-card-row assessments-row">
        <b>AI assessment:</b> <span style={{ color: STATUS_COLORS[action.aiAssessment.status] }}>{action.aiAssessment.text}</span>
      </div>
      <div className="action-card-row value-added-row">
        <b>Parent Objective:</b>{' '}
        {action.parentObjectiveLink ? (
          <a
            href={action.parentObjectiveLink}
            className="tag value-added-link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 4 }}
          >
            {action.parentObjective}
          </a>
        ) : (
          action.parentObjective ? <span className="tag value-added-link">{action.parentObjective}</span> : <span style={{color:'#aaa'}}>-</span>
        )}
      </div>
    </div>
  );
}
