import React from 'react';
import '../styles/TrophyPopup.scss';

const TrophyPopup = ({ trophy, onClose }) => {
  return (
    <div className='trophy-popup'>
      <img src={`http://localhost:3000/images/${trophy.icon_path}`} alt={trophy.name} />
      <h4>You earned the {trophy.name} Trophy!</h4>
      <p>By reaching {trophy.criteria}% of your goal 🎯</p>
    </div>
  );
};

export default TrophyPopup;