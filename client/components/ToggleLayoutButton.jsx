import React, { useRef, useState, useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import '../styles/Dashboard.scss';

const BUTTON_MIN_WIDTH = 120;
const BUTTON_MAX_WIDTH = 180;
const WIDTH_DURATION = 200;
const FADE_DURATION = 80;

function getDisplayLetters(isCompact) {
  return isCompact ? 'COMPACT'.split('') : 'W I D E'.split(' ');
}

export default function ToggleLayoutButton({ isCompact, onToggle }) {
  const [letters, setLetters] = useState(getDisplayLetters(isCompact));
  const btnRef = useRef(null);
  const lettersRef = useRef([]);
  const [pendingFadeIn, setPendingFadeIn] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(false);

  // Animate letter transition on mode change, but only if not from click
  useEffect(() => {
    if (!pendingToggle) {
      const targets = lettersRef.current.filter(Boolean);
      anime.remove(targets);
      if (targets.length > 0) {
        anime({
          targets,
          opacity: 0,
          duration: FADE_DURATION,
          easing: 'easeInOutQuad',
          complete: () => {
            setLetters(getDisplayLetters(isCompact));
            setPendingFadeIn(true);
          },
        });
      } else {
        setLetters(getDisplayLetters(isCompact));
        setPendingFadeIn(true);
      }
    }
    // eslint-disable-next-line
  }, [isCompact]);

  // Animate fade-in after letters are rendered
  useEffect(() => {
    if (pendingFadeIn) {
      const targets = lettersRef.current.filter(Boolean);
      anime.remove(targets);
      if (targets.length > 0) {
        anime({
          targets,
          opacity: 1,
          duration: FADE_DURATION,
          easing: 'easeInOutQuad',
        });
      }
      setPendingFadeIn(false);
    }
  }, [letters, pendingFadeIn]);

  // Clear refs on letters change to avoid stale refs
  useEffect(() => {
    lettersRef.current = [];
  }, [letters]);

  // On click: animate width, then animate text
  const handleClick = () => {
    anime.remove(btnRef.current);
    anime.remove(lettersRef.current);
    if (pendingToggle) return;
    setPendingToggle(true);
    anime({
      targets: btnRef.current,
      width: isCompact ? BUTTON_MAX_WIDTH : BUTTON_MIN_WIDTH,
      duration: WIDTH_DURATION,
      easing: 'easeInOutQuad',
      complete: () => {
        // Now animate text out, then toggle, then fade in
        const targets = lettersRef.current.filter(Boolean);
        anime.remove(targets);
        anime({
          targets,
          opacity: 0,
          duration: FADE_DURATION,
          easing: 'easeInOutQuad',
          complete: () => {
            onToggle();
            setLetters(getDisplayLetters(!isCompact));
            setTimeout(() => {
              const newTargets = lettersRef.current.filter(Boolean);
              anime.remove(newTargets);
              anime({
                targets: newTargets,
                opacity: 1,
                duration: FADE_DURATION,
                easing: 'easeInOutQuad',
                complete: () => setPendingToggle(false),
              });
            }, 10);
          },
        });
      },
    });
  };

  // On hover, only animate width
  const handleMouseEnter = () => {
    anime.remove(btnRef.current);
    anime({
      targets: btnRef.current,
      width: isCompact ? BUTTON_MAX_WIDTH : BUTTON_MIN_WIDTH,
      duration: WIDTH_DURATION,
      easing: 'easeInOutQuad',
    });
  };

  const handleMouseLeave = () => {
    anime.remove(btnRef.current);
    anime({
      targets: btnRef.current,
      width: isCompact ? BUTTON_MIN_WIDTH : BUTTON_MAX_WIDTH,
      duration: WIDTH_DURATION,
      easing: 'easeInOutQuad',
    });
  };

  return (
    <button
      ref={btnRef}
      className={`shine-btn toggle-layout-btn${isCompact ? '' : ' wide-mode'}`}
      style={{ width: isCompact ? BUTTON_MIN_WIDTH : BUTTON_MAX_WIDTH, minWidth: BUTTON_MIN_WIDTH }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={isCompact ? 'Switch to Wide layout' : 'Switch to Compact layout'}
      disabled={pendingToggle}
    >
      <span className="toggle-btn-label">
        {letters.map((char, i) => (
          <span
            key={i}
            ref={el => lettersRef.current[i] = el}
            className="toggle-btn-letter"
            style={{ display: 'inline-block', opacity: 1, transition: 'opacity 0.18s' }}
          >
            {char}
          </span>
        ))}
      </span>
    </button>
  );
}
