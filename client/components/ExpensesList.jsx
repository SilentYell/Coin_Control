import React, { useState, useEffect } from 'react';
import { getExpenses, deleteExpense } from '../services/api';
import '../styles/ExpensesList.scss';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const data = await getExpenses();
        setExpenses(data);
        setUseMockData(false);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
        setError('Failed to load expenses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // handle delete expense
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      const updatedExpenses = await getExpenses();
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('API error when deleting expense:', error);
      setError('Failed to delete expense. Please try again later.');
    }
  };

  return (
    <div className="expenses-list">
      <h2>Your Expenses</h2>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found. Add an expense to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.expense_id}>
                  <td className="amount">${expense.amount.toFixed(2)}</td>
                  <td>{formatDate(expense.expense_date)}</td>
                  <td>
                    <span className="category-tag">{expense.category}</span>
                  </td>
                  <td className="description">{expense.name}</td>
                  <td className="actions">
                    <button className="edit-btn">Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(expense.expense_id)}
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
                  {expenses
                    .reduce((sum, expense) => sum + Number(expense.amount), 0)
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

export default ExpensesList;
