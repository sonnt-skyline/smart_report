import { useRef, useEffect } from 'react';
import ActionCard from './ActionCard';

export default function ActionCardList({ actions }) {
  const listRef = useRef(null);
  useEffect(() => {
    function handleResize() {
      if (!listRef.current) return;
      const container = listRef.current;
      const cardWidth = 350;
      const gap = 24; // 1.5rem
      let cardsPerRow = 3;
      if (window.innerWidth < 800) cardsPerRow = 1;
      else if (window.innerWidth < 1200) cardsPerRow = 2;
      const neededWidth = cardsPerRow * cardWidth + (cardsPerRow - 1) * gap;
      const scale = Math.min(1, (window.innerWidth - 32) / neededWidth);
      container.style.transform = `scale(${scale})`;
      container.style.transformOrigin = 'top left';
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  if (!actions.length) return <p>No actions in this category.</p>;
  return (
    <div className="actions-card-list" ref={listRef}>
      {actions.map(action => (
        <ActionCard key={action.id} action={action} />
      ))}
    </div>
  );
}
