import React, { useState, useEffect } from 'react';
import { getUserTrophies  } from '../services/api';
import '../styles/TrophyCase.scss';

const TrophyCase = ({ userId }) => {
  const [trophies, setTrophies] = useState([]);

  useEffect(() => {
    const fetchTrophies = async () => {
      try {
        const data = await getUserTrophies(userId);
        const filteredData = data.filter(trophy => trophy.type === 'trophy') // filter for trophy of types 'trophy'
        filteredData.sort((a, b) => Number(a.criteria) - Number(b.criteria)); // Sort by percentage criteria

        setTrophies(filteredData);
      } catch (error) {
        console.error('Error fetching trophies: ', error);
        throw error;
      }
    };

    fetchTrophies();
  }, [userId]);


  return (
    <div className='trophy-case'>
      {trophies.length > 0 ? (
        trophies.map((trophy) => (
          <div key={trophy.id} className='trophy'>
            <h3>{trophy.name}</h3>
            <img src={`http://localhost:3000/images/${trophy.icon_path}`} alt={trophy.name} />
            <div className='trophy-info'>
              {Number(trophy.criteria)}% of your savings goal reached!
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