import React, { useState } from 'react';

const CARD_WIDTH = 260;
const CARD_GAP = 16; // Reduced gap between cards
const ANIMATION_DURATION = 350;

export default function Leaderboard({ memberStats }) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState(0); // -1 for left, 1 for right

  // Calculate how many cards to show (3, 2, or 1)
  const getVisibleCount = () => {
    if (memberStats.length <= 3) return memberStats.length;
    if (index + 3 > memberStats.length) return memberStats.length - index;
    return 3;
  };
  const visibleCount = getVisibleCount();

  // Get indices of visible cards
  const getVisibleIndices = () => {
    let arr = [];
    for (let i = 0; i < visibleCount; i++) {
      arr.push(index + i);
    }
    return arr;
  };
  const visibleIndices = getVisibleIndices();

  // Slide logic
  const handleSlide = dir => {
    if (animating) return;
    setSlideDir(dir);
    setAnimating(true);
    let nextIdx;
    if (dir === -1) {
      // Right arrow: next
      if (index + visibleCount >= memberStats.length) {
        nextIdx = 0;
      } else {
        nextIdx = index + 1;
      }
    } else {
      // Left arrow: prev
      if (index === 0) {
        nextIdx = Math.max(memberStats.length - 3, 0);
      } else {
        nextIdx = index - 1;
      }
    }
    setTimeout(() => {
      setIndex(nextIdx);
      setSlideDir(0);
      setAnimating(false);
    }, ANIMATION_DURATION);
  };

  // Card style
  const getCardStyle = i => ({
    minWidth: CARD_WIDTH,
    maxWidth: CARD_WIDTH,
    boxSizing: 'border-box',
    marginRight: i !== visibleCount - 1 ? CARD_GAP : 0,
    background: '#f7f7fa',
    borderRadius: 16,
    boxShadow: '0 2px 8px #0001',
    padding: '1.5rem 1.2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: memberStats[visibleIndices[i]].rank === 1 ? '3px solid #ffd700' : memberStats[visibleIndices[i]].rank === 2 ? '3px solid #c0c0c0' : memberStats[visibleIndices[i]].rank === 3 ? '3px solid #cd7f32' : '2px solid #e0e0e0',
    position: 'relative',
    transition: 'box-shadow 0.2s, border 0.2s',
    backgroundClip: 'padding-box',
    opacity: 1,
  });

  // Animation style
  const slideOffset = slideDir === 0 ? 0 : (slideDir === -1 ? -1 : 1) * (CARD_WIDTH + CARD_GAP);
  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: CARD_GAP,
    transition: slideDir !== 0 ? `transform ${ANIMATION_DURATION}ms cubic-bezier(.7,0,.3,1)` : 'none',
    transform: `translateX(${slideOffset}px)`
  };

  // Bootstrap-like fade/slide animation: after animation, reset transform and update index
  React.useEffect(() => {
    if (animating && slideDir !== 0) {
      const timer = setTimeout(() => {
        setIndex(prev => {
          if (slideDir === -1) {
            // Next
            if (prev + visibleCount >= memberStats.length) return 0;
            return prev + 1;
          } else {
            // Prev
            if (prev === 0) return Math.max(memberStats.length - 3, 0);
            return prev - 1;
          }
        });
        setSlideDir(0);
        setAnimating(false);
      }, ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [animating, slideDir, visibleCount, memberStats.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
      <div style={{ width: 900, maxWidth: '100%', height: 340, overflow: 'hidden', margin: '0 auto', position: 'relative' }}>
        <div style={containerStyle}>
          {visibleIndices.map((idx, i) => (
            <div key={memberStats[idx].member + '-' + i} style={getCardStyle(i)}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#3a3a7a', marginBottom: 8 }}>
                {memberStats[idx].rank === 1 ? '🥇' : memberStats[idx].rank === 2 ? '🥈' : memberStats[idx].rank === 3 ? '🥉' : `#${memberStats[idx].rank}`}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#005a00', marginBottom: 4 }}>{memberStats[idx].member}</div>
              <div style={{ fontSize: 16, color: '#888', marginBottom: 12 }}>Score: <span style={{ fontWeight: 700, color: '#005a00' }}>{memberStats[idx].singleScore.toFixed(3)}</span></div>
              <div style={{ width: '100%', marginBottom: 8 }}>
                <b>Participant Rate:</b> {(memberStats[idx].participantRate * 100).toFixed(1)}%
              </div>
              <div style={{ width: '100%', marginBottom: 8 }}>
                <b>Weighted Quantity:</b> {memberStats[idx].weightedQuantity.toFixed(2)}
              </div>
              <div style={{ width: '100%' }}>
                <b>Weighted Quality:</b> {memberStats[idx].weightedQuality.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        {/* Carousel controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, marginTop: 24, width: '100%' }}>
          <button
            onClick={() => handleSlide(1)}
            disabled={animating}
            style={{
              fontSize: 28,
              background: 'none',
              border: 'none',
              cursor: animating ? 'not-allowed' : 'pointer',
              color: '#3a3a7a',
              transition: 'color 0.2s',
              outline: 'none',
              padding: 0,
              minWidth: 44,
              minHeight: 44,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Previous"
          >
            &#8592;
          </button>
          <span style={{ color: '#888', fontSize: 15, minWidth: 160, textAlign: 'center', fontWeight: 500 }}>
            Showing {index + 1} - {index + visibleCount} of {memberStats.length}
          </span>
          <button
            onClick={() => handleSlide(-1)}
            disabled={animating}
            style={{
              fontSize: 28,
              background: 'none',
              border: 'none',
              cursor: animating ? 'not-allowed' : 'pointer',
              color: '#3a3a7a',
              transition: 'color 0.2s',
              outline: 'none',
              padding: 0,
              minWidth: 44,
              minHeight: 44,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Next"
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  );
}
