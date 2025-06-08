import { WORK_STATUS_COLORS } from '../constants';

export default function ProgressBar({ value, workStatus }) {
  return (
    <div className="progress-bar-outer">
      <div className="progress-bar-inner" style={{ width: `${value}%`, background: WORK_STATUS_COLORS[workStatus] || '#007bff' }} />
    </div>
  );
}
