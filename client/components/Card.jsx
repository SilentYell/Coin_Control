import anime from 'animejs/lib/anime.es.js';
import React, { useEffect, useRef } from 'react';
import '../styles/Card.scss';

function Card({ title, value, description }) {
  const cardRef = useRef(null);

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

  return (
    <div className="card" ref={cardRef}>
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      <div className="card-description">{description}</div>
    </div>
  );
}

export default Card;