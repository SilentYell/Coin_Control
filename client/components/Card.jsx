import anime from 'animejs/lib/anime.es.js';
import React, { useEffect, useRef, memo } from 'react';
import '../styles/Card.scss';

function Card({ title, value, valueClassName = '', children, isEditable = false }) {
  const cardRef = useRef(null);

  // Wiggle animation function
  const wiggle = () => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        rotateZ: [0, -4, 4, -4, 4, -4, 4, 0],
        duration: 200,
        easing: 'easeInOutSine',
      });
    }
  };

  // Trigger wiggle when isEditable becomes true
  useEffect(() => {
    if (isEditable) {
      wiggle();
    }
  }, [isEditable]);

  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 800,
        easing: 'easeOutExpo',
      });
    }
  }, []);

  // Handle hover wiggle
  const handleMouseEnter = () => {
    if (isEditable) {
      wiggle();
    }
  };

  return (
    <div
      className={`card${isEditable ? ' card--editable' : ''}`}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      style={isEditable ? { cursor: 'grab' } : {}}
    >
      <div className="card-title">{title}</div>
      <div className={`card-value ${valueClassName}`}>{value}</div>
      <div className="card-children">{children}</div>
    </div>
  );
}

export default memo(Card);