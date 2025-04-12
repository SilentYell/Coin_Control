import React from 'react';
import './Card.scss';

function Card({ title, value, description }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      <div className="card-description">{description}</div>
    </div>
  );
}

export default Card; // Correctly export the Card component