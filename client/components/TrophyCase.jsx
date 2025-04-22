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
            <p>{trophy.description}</p>
            <img src={trophy.image_url} alt={trophy.name}/>
          </div>
        ))
      ) : (
        <p>No trophies earned yet.</p>
      )}
    </div>
  );
};

export default TrophyCase;