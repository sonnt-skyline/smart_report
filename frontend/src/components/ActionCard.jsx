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
      <div className="action-card-row"><b>Category:</b> {action.category}</div>
      <div className="action-card-row"><b>Sub-category:</b> {action.subCategory || '-'}</div>
      <div className="action-card-row"><b>Tags:</b> {action.tags ? action.tags.map(tag => <span className="tag" key={tag}>{tag}</span>) : '-'}</div>
      <div className="action-card-row"><b>Weeks Remaining:</b> {weeksRemaining(action.deadline)}</div>
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
        {action.valueAddedLink ? (
          <a
            href={action.valueAddedLink}
            className="tag value-added-link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 4 }}
          >
            {action.valueAdded}
          </a>
        ) : (
          action.valueAdded ? <span className="tag value-added-link">{action.valueAdded}</span> : <span style={{color:'#aaa'}}>-</span>
        )}
      </div>
    </div>
  );
}
