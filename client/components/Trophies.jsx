import React, { useEffect } from 'react'
import { getUserBadgeTrophies } from '../services/api';
import formatDate from '../src/helpers/formatDate';

export const Trophies = ({trophiesList, setTrophiesList}) => {
  useEffect(() => {
    // Fetch trophies data from the backend when the component mounts
    const fetchTrophies = async () => {
      try {
        const data = await getUserBadgeTrophies();
        setTrophiesList(data.allTrophies); // Updates the state with fetched data
      } catch (error) {
        console.error('Failed to fetch trophies:', error);
      }
    };

    fetchTrophies();
  }, []);

  return (
    <div className="trophies-list">
      <h2>Trophies</h2>

      {trophiesList.length === 0 ? (
        <div className="empty-state">
          <p>No trophies found. Keep saving!</p>
        </div>
      ) : (
      <div className="table-container">
        <table className="trophies-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Description</th>
              <th>Earned</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          { trophiesList.map((trophy) => (
              <tr key={trophy.id}>
                <td><img src={`http://localhost:3000/images/${trophy.icon_path}`} alt={trophy.name} /></td>
                <td className="name">{trophy.name}</td>
                <td className='description'>{trophy.description}</td>
                <td className="earned-at">{formatDate(trophy.awarded_at)}</td>
              </tr>
          ))}
          </tbody>
        </table>
    </div>
    )}
  </div>
  )
};

export default Trophies;
