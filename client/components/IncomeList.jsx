import React, { useState, useEffect } from 'react'
import '../styles/IncomeList.scss';
import { deleteIncome, getIncome, updateIncome } from '../services/api';
import formatDate from '../src/helpers/formatDate';

const IncomeList = ({ incomeList, setIncomeList, setEditingIncome }) => {
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

    fetchIncome();
  }, [setIncomeList]);

  /**
   * Deletes an income entry by ID from the db via the API,
   * and updates the local state to reflect the change
   *
   * @param {Number} id - the ID of income record to delete
   */
  const handleDelete = async (id) => {
    try {
      await deleteIncome(id) // call to backend

      // Update local state after successful deletion
      setIncomeList(incomeList.filter(income => income.income_id !== id));
    } catch (error) {
      console.error('Error deleting income:', error.message)
    }
  };

  return (
    <div className="income-list">
    <h2>Income History</h2>

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
              <th>Frequency</th>
              <th>Last Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomeList.map((income) => (
              <tr key={income.income_id}>
                <td className="amount">${income.amount}</td>
                <td>{formatDate(income.last_payment_date)}</td>
                <td className="frequency">{income.frequency}</td>
                <td className="actions">
                  <button
                    className="edit-btn"
                    onClick={() =>
                      setEditingIncome((prev) => {
                        return prev?.income_id === income.income_id ? null : income;
                      })}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(income.income_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan="4" className="total-label">
                Total
              </td>
              <td className="total-amount">
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
  )
};


export default IncomeList;