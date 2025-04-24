import React, { useRef, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';
import '../styles/Dashboard.scss';

const BUTTON_MIN_WIDTH = 120;
const BUTTON_MAX_WIDTH = 180;

export default function ToggleLayoutButton({ isCompact, onToggle }) {
  const [displayText, setDisplayText] = useState(isCompact ? 'Compact' : 'Wide');
  const [animating, setAnimating] = useState(false);
  const btnRef = useRef(null);

  // Animate to wide on click (if compact), then change text
  const handleClick = () => {
    if (animating) return;
    setAnimating(true);
    anime({
      targets: btnRef.current,
      width: isCompact ? BUTTON_MAX_WIDTH : BUTTON_MIN_WIDTH,
      duration: 350,
      easing: 'easeInOutQuad',
      complete: () => {
        setDisplayText(isCompact ? 'Wide' : 'Compact');
        setAnimating(false);
        onToggle();
      },
    });
  };

  // Animate stretch on hover (if compact), then change text after animation
  const handleMouseEnter = () => {
    if (isCompact && !animating) {
      setAnimating(true);
      anime({
        targets: btnRef.current,
        width: BUTTON_MAX_WIDTH,
        duration: 250,
        easing: 'easeInOutQuad',
        complete: () => {
          setDisplayText('Wide');
          setAnimating(false);
        },
      });
    } else if (!isCompact && !animating) {
      setAnimating(true);
      anime({
        targets: btnRef.current,
        width: BUTTON_MIN_WIDTH,
        duration: 250,
        easing: 'easeInOutQuad',
        complete: () => {
          setDisplayText('Compact');
          setAnimating(false);
        },
      });
    }
  };

  // Animate back to compact on mouse leave (if compact)
  const handleMouseLeave = () => {
    if (isCompact && !animating) {
      setAnimating(true);
      anime({
        targets: btnRef.current,
        width: BUTTON_MIN_WIDTH,
        duration: 250,
        easing: 'easeInOutQuad',
        complete: () => {
          setDisplayText('Compact');
          setAnimating(false);
        },
      });
    } else if (!isCompact && !animating) {
      setAnimating(true);
      anime({
        targets: btnRef.current,
        width: BUTTON_MAX_WIDTH,
        duration: 250,
        easing: 'easeInOutQuad',
        complete: () => {
          setDisplayText('Wide');
          setAnimating(false);
        },
      });
    }
  };

  return (
    <button
      ref={btnRef}
      className="shine-btn toggle-layout-btn"
      style={{ width: isCompact ? BUTTON_MIN_WIDTH : BUTTON_MAX_WIDTH, minWidth: BUTTON_MIN_WIDTH }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={animating}
      aria-label={isCompact ? 'Switch to Wide layout' : 'Switch to Compact layout'}
    >
      {displayText}
    </button>
  );
}
