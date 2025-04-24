import React, { useRef, useState, useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import '../styles/Dashboard.scss';

const BUTTON_MIN_WIDTH = 120;
const BUTTON_MAX_WIDTH = 180;

export default function ToggleLayoutButton({ isCompact, onToggle }) {
  const [displayText, setDisplayText] = useState(isCompact ? 'Compact' : 'Wide');
  const btnRef = useRef(null);

  // Keep displayText in sync with isCompact prop
  useEffect(() => {
    setDisplayText(isCompact ? 'Compact' : 'Wide');
  }, [isCompact]);

  // Animate to wide on click (if compact), then change text
  const handleClick = () => {
    anime.remove(btnRef.current);
    anime({
      targets: btnRef.current,
      width: isCompact ? BUTTON_MAX_WIDTH : BUTTON_MIN_WIDTH,
      duration: 350,
      easing: 'easeInOutQuad',
      complete: () => {
        onToggle();
      },
    });
  };

  // Animate stretch on hover
  const handleMouseEnter = () => {
    anime.remove(btnRef.current);
    anime({
      targets: btnRef.current,
      width: isCompact ? BUTTON_MAX_WIDTH : BUTTON_MIN_WIDTH,
      duration: 250,
      easing: 'easeInOutQuad',
    });
    setDisplayText(isCompact ? 'Wide' : 'Compact');
  };

  // Animate back on mouse leave
  const handleMouseLeave = () => {
    anime.remove(btnRef.current);
    anime({
      targets: btnRef.current,
      width: isCompact ? BUTTON_MIN_WIDTH : BUTTON_MAX_WIDTH,
      duration: 250,
      easing: 'easeInOutQuad',
    });
    setDisplayText(isCompact ? 'Compact' : 'Wide');
  };

  return (
    <button
      ref={btnRef}
      className="shine-btn toggle-layout-btn"
      style={{ width: isCompact ? BUTTON_MIN_WIDTH : BUTTON_MAX_WIDTH, minWidth: BUTTON_MIN_WIDTH }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={isCompact ? 'Switch to Wide layout' : 'Switch to Compact layout'}
    >
      {displayText}
    </button>
  );
}
