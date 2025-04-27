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

        const filteredData = data.filter(trophy => trophy.type === 'trophy') // filter for trophy of types 'trophy'
        console.log(filteredData)
        filteredData.sort((a, b) => Number(a.criteria) - Number(b.criteria));

        setTrophies(filteredData);
      } catch (error) {
        console.log('Error fetching trophies: ', error);
      }
    };

    fetchTrophies();
  }, [userId]);

  console.log('trophies state after filtering', trophies)


  return (
    <div className='trophy-case'>
      {trophies.length > 0 ? (
        trophies.map((trophy) => (
          <div key={trophy.id} className='trophy'>
            <h3>{trophy.name}</h3>
            <img src={trophy.icon_path} alt={trophy.name} />
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