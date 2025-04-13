import React, { useState } from 'react'
import '../styles/IncomeList.scss';

export default function IncomeList({incomeList, setIncomeList}) {
  const handleDelete = async (id) => {
    console.log("Deleting income with id: ", id)
    try{
      const response = await fetch(`http://localhost:3000/api/delete/income/${id}`, {
        method: 'DELETE',
      });

      // Throw error if response promise is rejected
      if (!response.ok) throw new Error('Failed to delete income.');

      // Update local state after successful deletion
      setIncomeList(incomeList.filter(income => income.income_id !== id));
    } catch (error) {
      console.error('Error deleting income:', error.message)
    }
  };

  // format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                  <button className="edit-btn">Edit</button>
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
}
