import React, { useState, useEffect } from 'react';
import { getUserTrophies  } from '../services/api';
import '../styles/TrophyCase.scss';

const TrophyCase = ({ userId }) => {
  const [trophies, setTrophies] = useState([]);

  useEffect(() => {
    const fetchTrophies = async () => {
      try {
        const data = await getUserTrophies(userId);
        console.log('Fetched trophies: ', data);

        setTrophies(data);
      } catch (error) {
        console.log('Error fetching trophies: ', error);
      }
    };

    fetchTrophies();
  }, [userId]);

  return (
    <div className='trophy-case'>
      {trophies.length > 0 ? (
        trophies.map((trophy) => (
          <div key={trophy.trophy_id} className='trophy'>
            <h3>{trophy.name}</h3>
            <img src={trophy.icon_url} alt={trophy.name} />
            <div className='trophy-info'>
              {trophy.percent_required}% of your savings goal reached!
            </div>
          </div>
        ))
      ) : (
        <p className='trophy-case-empty'>No trophies earned yet.</p>
      )}
    </div>
  );
};

export default TrophyCase;