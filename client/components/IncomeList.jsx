import React, { useState, useEffect, useRef } from 'react';
import '../styles/IncomeList.scss';
import { deleteIncome, getIncome, updateIncome } from '../services/api';
import formatDate from '../src/helpers/formatDate';
import { MdEdit, MdDelete } from 'react-icons/md';

const IncomeList = ({ incomeList, setIncomeList, setEditingIncome, editSuccess, lastEditedId, triggerRefresh }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch income data from the backend when the component mounts
    const fetchIncome = async () => {
      try {
        const data = await getIncome();
        setIncomeList(data); // Updates the state with fetched data
      } catch (error) {
        console.error('Failed to fetch income:', error);
      }
    };

    // PH change - only fetch if we dont have data
    if (!incomeList || incomeList.length === 0) {
      fetchIncome();
    }
  }, []); // PH change - empty dependency array - only run on mount


  useEffect(() => {
    if (editSuccess && lastEditedId) {
      const timer = setTimeout(() => {
        // Clear the highlight after the animation finishes
        setEditingIncome(null); // assuming this resets lastEditedId to null or undefined
      }, 1500); // match your CSS animation duration

      return () => clearTimeout(timer);
    }
  }, [editSuccess, lastEditedId]);


  /**
   * Deletes an income entry by ID from the db via the API,
   * and updates the local state to reflect the change
   *
   * @param {Number} id - the ID of income record to delete
   */
  const handleDelete = async (id) => {
    try {
      await deleteIncome(id); // call to backend

      // ph change - dont fetch again, update state locally
      setIncomeList((prevList) =>
        prevList.filter((item) => item.income_id !== id)
      );

      triggerRefresh(); // trigger refresh for line graph
    } catch (error) {
      setError('Failed to delete income. Please try again later.');
      console.error('Error deleting income:', error.message);
    }
  };

  return (
    <div className="income-list">
      <h2>Income History</h2>

      {error && <div className="error-message">{error}</div>}

      {editSuccess && (
        <div className="success-message">Income updated successfully!</div>
      )}

      {incomeList.length === 0 ? (
        <div className="empty-state">
          <p>No income found. Add income to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="income-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Last Payment Date</th>
                <th>Frequency</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {incomeList.map((income) => (
                <tr
                  key={income.income_id}
                  className={lastEditedId === 'Income' && income.income_id === lastEditedId.id ? 'highlight-row' : ''}
                >
                  <td className="amount">${income.amount}</td>
                  <td>{formatDate(income.last_payment_date)}</td>
                  <td className="frequency">{income.frequency}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => setEditingIncome((prev) => prev?.income_id === income.income_id ? null : income)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(income.income_id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td className="total-label">Total</td>
                <td colSpan="2"></td>
                <td
                  className={
                    'total-amount ' +
                    (incomeList.reduce(
                      (sum, income) => sum + Number(income.amount),
                      0
                    ) < 0
                      ? 'negative'
                      : 'positive')
                  }
                >
                  $
                  {incomeList
                    .reduce((sum, income) => sum + Number(income.amount), 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncomeList;
