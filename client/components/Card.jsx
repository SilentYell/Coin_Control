import React, { useEffect, useRef, memo, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';
import '../styles/Card.scss';

function Card({ title, value, valueClassName = '', children, isEditable = false, animateValue = false }) {
  const cardRef = useRef(null);
  const valueRef = useRef(null);
  const [displayedValue, setDisplayedValue] = useState(value);

  // Wiggle animation function (reduced wiggle)
  const wiggle = () => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        rotateZ: [0, -0.5, 0.5, -0.25, 0.25, 0],
        duration: 700,
        easing: 'easeInOutSine',
      });
    }
  };

  // Animate value (number) if enabled
  useEffect(() => {
    if (!animateValue) {
      setDisplayedValue(value);
      return;
    }
    let from = 0;
    let to = value;
    // Try to parse numbers from formatted strings
    if (typeof value === 'string' && value.match(/[-\d,.]+/)) {
      const match = value.match(/-?[\d,.]+/);
      to = match ? parseFloat(match[0].replace(/,/g, '')) : 0;
      from = 0;
    }
    anime({
      targets: { val: from },
      val: to,
      round: 100,
      duration: 1000,
      easing: 'easeOutExpo',
      update: anim => {
        let v = anim.animations[0].currentValue;
        if (typeof value === 'string') {
          // Format as currency if original value is currency
          if (value.includes('$')) {
            v = (v < 0 ? '-' : '') + '$' + Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else {
            v = v.toLocaleString();
          }
        }
        setDisplayedValue(v);
      },
      complete: () => setDisplayedValue(value)
    });
    // eslint-disable-next-line
  }, [value, animateValue]);

  // Wiggle on editable
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
        rotateZ: 0,
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
      <div className={`card-value ${valueClassName}`} ref={valueRef}>
        {animateValue ? displayedValue : value}
      </div>
      <div className="card-children">{children}</div>
    </div>
  );
}

export default memo(Card);