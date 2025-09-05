import { GROUP_OPTIONS } from '../constants';

export default function GroupButtons({ groupBy, setGroupBy }) {
  return (
    <div className="group-buttons">
      {GROUP_OPTIONS.map(opt => (
        <button
          key={opt.value}
          className={groupBy === opt.value ? 'active' : ''}
          onClick={() => setGroupBy(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
