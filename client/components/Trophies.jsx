import React, { useEffect } from 'react'
import { getUserTrophies } from '../services/api';
import formatDate from '../src/helpers/formatDate';
import '../styles/Trophies.scss';

export const Trophies = ({trophiesList, setTrophiesList}) => {
  console.log('trophiesList before useEffect', trophiesList)
  useEffect(() => {
    // Fetch trophies data from the backend when the component mounts
    const fetchTrophies = async () => {
      const userId = 1; // hardcoded for now
      try {
        const data = await getUserTrophies(userId);
        console.log('fetched trophy data: ', data)
        const filteredData = data.filter(t => t.type === 'badge')

        setTrophiesList(filteredData); // Updates the state with fetched data
      } catch (error) {
        console.error('Failed to fetch trophies:', error);
      }
    };

    fetchTrophies();
  }, []);

  console.log('trophies list after useEffect: ', trophiesList)
  return (
    <div className='trophies-container'>
      <div className='main-content'>
        <div className="trophies-list">
            <h2>Badges Earned</h2>

            {trophiesList.length === 0 ? (
              <div className="empty-state">
                <p>No badges found. Explore the app to earn badges!</p>
              </div>
            ) : (
            <div className="table-container">
              <table className="trophies-table">
                { trophiesList.map((trophy) => (
                  <tbody className="trophy-group" key={trophy.id}>
                    <tr className="trophy-row">
                      <td className='trophy-icon'>
                        <img src={`http://localhost:3000/images/${trophy.icon_path}`} alt={trophy.name} />
                      </td>
                      <td className="trophy-name">{trophy.name}</td>
                    </tr>
                    <tr className="trophy-details-row">
                      <td colSpan="2">
                        <div className="trophy-details">
                          <div className="details-header">
                            <span>Description</span>
                            <span>Earned</span>
                          </div>
                          <div className="details-content">
                            <p className="trophy-description">{trophy.description}</p>
                            <p className="trophy-awarded-at">{formatDate(trophy.awarded_at)}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
          </div>
          )}
        </div>
      </div>
    </div>
  )
};

export default Trophies;
