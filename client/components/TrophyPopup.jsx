import React from 'react';
import '../styles/TrophyPopup.scss';

const TrophyPopup = ({ trophy, onClose }) => {
  return (
    <div className='trophy-popup'>
      <img src={trophy.icon_url} alt={trophy.name} />
      <h4>You earned the {trophy.name} Trophy!</h4>
      <p>By reaching {trophy.percent_required}% of your goal 🎯</p> 
    </div>
  );
};

export default TrophyPopup;