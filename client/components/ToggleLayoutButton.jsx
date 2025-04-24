import React, { useRef, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';
import '../styles/Dashboard.scss';

const BUTTON_MIN_WIDTH = 120;
const BUTTON_MAX_WIDTH = 180;
const WIDTH_DURATION = 200;

function getDisplayLabel(isCompact, hovered) {
  // Always uppercase, W I D E spaced out, COMPACT normal
  if (hovered) {
    return isCompact ? 'W I D E' : 'COMPACT';
  } else {
    return isCompact ? 'COMPACT' : 'W I D E';
  }
}

export default function ToggleLayoutButton({ isCompact, onToggle }) {
  const btnRef = useRef(null);
  const [fading, setFading] = useState(false);
  const [label, setLabel] = useState(getDisplayLabel(isCompact, false));

  // Animate width only
  const animateWidth = (toWide) => {
    anime.remove(btnRef.current);
    anime({
      targets: btnRef.current,
      width: toWide ? BUTTON_MAX_WIDTH : BUTTON_MIN_WIDTH,
      duration: WIDTH_DURATION,
      easing: 'easeInOutQuad',
    });
  };

  // Fade out, swap label, fade in
  const fadeLabel = (toHovered) => {
    setFading(true);
    setTimeout(() => {
      setLabel(getDisplayLabel(isCompact, toHovered));
      setFading(false);
    }, 120); // match CSS transition duration
  };

  const handleMouseEnter = () => {
    animateWidth(isCompact);
    fadeLabel(true);
  };

  const handleMouseLeave = () => {
    // Animate to BUTTON_MIN_WIDTH before removing width
    anime.remove(btnRef.current);
    anime({
      targets: btnRef.current,
      width: BUTTON_MIN_WIDTH,
      duration: WIDTH_DURATION,
      easing: 'easeInOutQuad',
      complete: () => {
        btnRef.current.style.width = '';
      }
    });
    fadeLabel(false);
  };

  const handleClick = () => {
    animateWidth(isCompact);
    onToggle();
  };

  return (
    <button
      ref={btnRef}
      className={`shine-btn toggle-layout-btn${label === 'W I D E' ? ' wide-mode' : ''}`}
      style={label === 'W I D E' ? { width: BUTTON_MAX_WIDTH, minWidth: BUTTON_MIN_WIDTH } : { minWidth: BUTTON_MIN_WIDTH, width: undefined }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={isCompact ? 'Switch to Wide layout' : 'Switch to Compact layout'}
      type="button"
    >
      <span
        className="toggle-btn-label"
        style={{
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.12s',
          display: 'inline-block',
        }}
      >
        {label.split('').map((char, i) => (
          <span key={i} className="toggle-btn-letter">{char}</span>
        ))}
      </span>
    </button>
  );
}
