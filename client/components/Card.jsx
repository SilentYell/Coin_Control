import anime from 'animejs/lib/anime.es.js';
import React, { useEffect, useRef, memo } from 'react';
import '../styles/Card.scss';

function Card({ title, value, valueClassName = '', children, isEditable = false }) {
  const cardRef = useRef(null);

  // Wiggle animation function (reduced wiggle)
  const wiggle = () => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        rotateZ: [0, -0.5, 0.5, -0.25, 0.25, 0], // further reduced wiggle
        duration: 700,
        easing: 'easeInOutSine',
      });
    }
  };

  // Trigger wiggle when isEditable becomes true (initial wiggle only)
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
        rotateZ: 0, // Ensure no leftover rotation
        duration: 800,
        easing: 'easeOutExpo',
      });
    }
  }, []);

  return (
    <div
      className={`card${isEditable ? ' card--editable' : ''}`}
      ref={cardRef}
      style={isEditable ? { cursor: 'grab' } : {}}
    >
      <div className="card-title">{title}</div>
      <div className={`card-value ${valueClassName}`}>{value}</div>
      <div className="card-children">{children}</div>
    </div>
  );
}

export default memo(Card);