export default function FilterButtons({ filter, setFilter }) {
  const filters = ['All', 'On-going', 'Blocked', 'On hold', 'Completed', 'Not started'];
  return (
    <div className="filter-buttons">
      {filters.map(f => (
        <button
          key={f}
          className={filter === f ? 'active' : ''}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
