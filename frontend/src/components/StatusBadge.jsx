import { WORK_STATUS_COLORS } from '../constants';

export default function StatusBadge({ status }) {
  return (
    <span className="status-badge" style={{ background: WORK_STATUS_COLORS[status] || '#888' }}>
      {status}
    </span>
  );
}
